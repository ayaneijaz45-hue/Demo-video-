"""Audio-only review editor. No video rendering, network access or synthesis.

Requires existing private 48 kHz PCM WAV working copies, numpy, and the
project's pinned Remotion FFmpeg wrapper. The original media is never edited.
This separate review path permits local audio work explicitly; the existing
video/cloud master safeguards remain unchanged.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import wave
import numpy as np

SR = 48000
N = 30 * SR
REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "production/first-reveal/audio-assets"
CLI = ["node", str(REPO / "node_modules/@remotion/cli/remotion-cli.js"), "ffmpeg"]


def read_wav(path):
    with wave.open(str(path), "rb") as w:
        assert w.getframerate() == SR and w.getsampwidth() == 3
        channels = w.getnchannels()
        raw = np.frombuffer(w.readframes(w.getnframes()), np.uint8).reshape(-1, 3).astype(np.int32)
    values = raw[:, 0] | raw[:, 1] << 8 | raw[:, 2] << 16
    return (((values ^ 0x800000) - 0x800000) / 8388608).reshape(-1, channels)


def write_wav(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    assert np.max(np.abs(x)) < 1, "Refuse clipped PCM output"
    q = np.rint(x * 8388608).astype(np.int32).reshape(-1)
    b = np.column_stack((q & 255, (q >> 8) & 255, (q >> 16) & 255)).astype(np.uint8)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(3); w.setframerate(SR)
        w.writeframes(b.tobytes())


def stereo(x):
    return np.repeat(x, 2, axis=1) if x.shape[1] == 1 else x


def db(x):
    return float(20 * np.log10(max(float(x), 1e-12)))


def fade(x, entrance=.004, exit=.045):
    x = x.copy()
    a, b = min(len(x), round(entrance * SR)), min(len(x), round(exit * SR))
    if a: x[:a] *= np.sin(np.linspace(0, np.pi / 2, a))[:, None] ** 2
    if b: x[-b:] *= np.cos(np.linspace(0, np.pi / 2, b))[:, None] ** 2
    return x


def filter_spectrum(x, highpass=None, lowpass=None):
    # Zero-phase, smoothly shaped, padded offline correction. No creative tone generation.
    pad = min(SR // 4, len(x) - 1)
    y = np.pad(x, ((pad, pad), (0, 0)), mode="reflect")
    f = np.fft.rfftfreq(len(y), 1 / SR)
    gain = np.ones(len(f))
    if highpass:
        gain *= 1 / np.sqrt(1 + (highpass / np.maximum(f, .001)) ** 4)
        gain[0] = 0
    if lowpass: gain *= 1 / np.sqrt(1 + (f / lowpass) ** 8)
    y = np.fft.irfft(np.fft.rfft(y, axis=0) * gain[:, None], n=len(y), axis=0)
    return y[pad:pad + len(x)]


def envelope(x, attack, release, block=240):
    power = np.mean(stereo(x) ** 2, axis=1)
    pad = (-len(power)) % block
    values = np.sqrt(np.pad(power, (0, pad)).reshape(-1, block).mean(axis=1))
    state = 0.; result = []
    for v in values:
        tau = attack if v > state else release
        coefficient = np.exp(-block / (SR * tau))
        state = coefficient * state + (1 - coefficient) * v
        result.append(state)
    return np.interp(np.arange(len(x)), np.arange(len(result)) * block + block / 2, result)


def measure(path, report):
    r = subprocess.run(CLI + ["-hide_banner", "-i", str(path), "-af", "loudnorm=I=-16:TP=-1.8:LRA=11:print_format=json", "-f", "null", "-"], cwd=REPO, text=True, capture_output=True, check=True)
    import re
    data = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S)[-1])
    report.write_text(json.dumps(data, indent=2) + "\n")
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio-only-review", action="store_true", required=True)
    parser.parse_args()
    config = json.loads((REPO / "production/first-reveal/audio-integration.json").read_text())
    edit = config["audioReviewEdit"]
    analysis = ROOT / "analysis"
    analysis.mkdir(exist_ok=True)
    output = ROOT / "review"
    output.mkdir(exist_ok=True)
    original = read_wav(ROOT / "narration/narration-working.wav")
    voice = np.zeros((N, 2))
    for part in edit["narrationEdits"]:
        a, b = round(part["sourceStart"] * SR), round(part["sourceEnd"] * SR)
        at = round(part["timelineStart"] * SR)
        clip = stereo(original[a:b])
        assert at >= 0 and at + len(clip) <= N
        # Edits land in measured quiet regions; 3 ms declicks do not time-stretch speech.
        voice[at:at + len(clip)] += fade(clip, .003 if a else 0, .003)
    voice -= voice.mean(axis=0)
    env = envelope(voice, .020, .140)
    level = 20 * np.log10(np.maximum(env, 1e-8))
    reduction = np.minimum(1.7, np.maximum(0, level + 18) * (1 - 1 / 1.3))
    voice *= 10 ** ((edit["voiceGainDb"] - reduction)[:, None] / 20)
    # Music stays stereo; no looping or tempo changes. Select one continuous excerpt.
    music = read_wav(ROOT / "music/cinematic.wav")
    begin = round(config["music"]["trimStartSeconds"] * SR)
    music = stereo(music[begin:begin + N])
    assert len(music) == N
    music = filter_spectrum(music, highpass=35)
    music = fade(music, .35, 1.45)
    detection = envelope(voice, .025, .260)
    activity = np.clip((20 * np.log10(np.maximum(detection, 1e-8)) + 44) / 18, 0, 1)
    duck_db = -edit["musicMaximumDuckDb"] * activity
    music *= 10 ** ((config["music"]["gainDb"] + duck_db)[:, None] / 20)
    fx = np.zeros((N, 2))
    source_analysis = []
    corrections = edit["sfxCorrections"]
    for cue in config["cues"]:
        if not cue["enabled"]: continue
        name = cue["asset"]
        source = stereo(read_wav(ROOT / config["sfx"][name]["path"]))
        setting = corrections[name]
        # Declick source boundaries before offline EQ so abrupt file ends cannot
        # create filter-edge peaks that would mislead source-level matching.
        source = fade(source, .001 if name == "ui" else .005, .025)
        source -= source.mean(axis=0)
        source = filter_spectrum(source, setting.get("highpassHz"), setting.get("lowpassHz"))
        # Peak-match corrected sources. Quiet UI transients need more gain than the bass hits.
        gain_db = min(24., -6 - db(np.abs(source).max()))
        source *= 10 ** (gain_db / 20)
        skip = round(setting.get("trimStartSeconds", 0) * SR)
        length = round((cue["endSeconds"] - cue["startSeconds"]) * SR)
        clip = source[skip:skip + length]
        clip = fade(clip, .001 if name == "ui" else .005, min(.09, len(clip) / SR / 4))
        at = round(cue["startSeconds"] * SR)
        clip *= 10 ** ((cue["gainDb"] + config["sfx"][name]["gainDb"]) / 20)
        # A gentle additional reduction under words keeps the texture behind speech.
        clip *= 10 ** ((-2.5 * activity[at:at + len(clip)])[:, None] / 20)
        fx[at:at + len(clip)] += clip
        source_analysis.append({"cue": cue["id"], "asset": name, "correctedSourcePeakDbFS": db(abs(source).max()), "sourceGainDb": gain_db, "placedPeakDbFS": db(abs(clip).max()), "startSeconds": cue["startSeconds"], "endSeconds": (at + len(clip)) / SR})
    raw = voice + music + fx
    assert abs(raw).max() < 1, "Adjust mix gain; no clipping or distortion is allowed"
    raw_path = output / "FirstReveal-review-premaster.wav"
    write_wav(raw_path, raw)
    for name, data in [("voice-conformed", voice), ("music-ducked", music), ("sfx-aligned", fx)]:
        write_wav(output / (name + ".wav"), data)
    first = measure(raw_path, analysis / "premaster-loudness.json")
    args = f"loudnorm=I=-16:TP=-1.8:LRA=11:measured_I={first['input_i']}:measured_TP={first['input_tp']}:measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:offset={first['target_offset']}:linear=true:print_format=json"
    final = output / "ModelsSuiteFirstReveal-AUDIO-REVIEW-v1.wav"
    r = subprocess.run(CLI + ["-hide_banner", "-y", "-i", str(raw_path), "-af", args, "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", str(final)], cwd=REPO, capture_output=True, text=True, check=True)
    (analysis / "normalization-pass2.log").write_text(r.stderr)
    measurements = measure(final, analysis / "review-loudness.json")
    y = read_wav(final)
    assert len(y) == N and y.shape[1] == 2
    assert float(measurements["input_tp"]) <= -1.5
    assert -17 <= float(measurements["input_i"]) <= -15
    active = activity > .6
    voice_rms = np.sqrt(np.mean(voice[active] ** 2))
    music_rms = np.sqrt(np.mean(music[active] ** 2))
    width = float(np.corrcoef(y.T)[0, 1])
    report = {"status": "AUDIO REVIEW — USER APPROVAL PENDING", "seconds": len(y) / SR, "sampleRate": SR, "channels": 2, "codec": "pcm_s24le", "integratedLUFS": float(measurements["input_i"]), "truePeakDbTP": float(measurements["input_tp"]), "loudnessRangeLU": float(measurements["input_lra"]), "samplePeakDbFS": db(abs(y).max()), "clippedSamples": int((abs(y) >= .9999).sum()), "speechActiveVoiceVsMusicRmsMarginDb": db(voice_rms / music_rms), "stereoCorrelation": width, "narrationPlaybackRate": 1, "narrationPitchChanged": False, "musicSourceRangeSeconds": [config["music"]["trimStartSeconds"], config["music"]["trimStartSeconds"] + 30], "cues": source_analysis, "wavSha256": hashlib.sha256(final.read_bytes()).hexdigest(), "finalVideoRendered": False, "listeningApproval": "Pending user listening; numerical checks are not a perceptual-quality certification"}
    (analysis / "audio-review-verification.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({k: v for k, v in report.items() if k != "cues"}, indent=2))


if __name__ == "__main__":
    main()
