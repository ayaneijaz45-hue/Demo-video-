"""Import a reviewed, checksum-pinned audio ZIP from an optional masked secret URL.

Never uploads source audio or license documents. No URL is logged.
"""
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import urllib.parse
import urllib.request
import zipfile

url = os.environ.get("FIRST_REVEAL_AUDIO_BUNDLE_URL", "")
if not url:
    print("No cloud audio bundle configured. Preflight will report missing assets.")
    raise SystemExit(0)
assert os.environ.get("GITHUB_REPOSITORY") == "ayaneijaz45-hue/Demo-video-"
assert os.environ.get("RUNNER_ENVIRONMENT") == "github-hosted"
assert urllib.parse.urlsplit(url).scheme == "https", "Audio bundle must use HTTPS"
config = json.loads(Path("production/first-reveal/audio-integration.json").read_text())
expected = config.get("cloudBundleSha256")
assert isinstance(expected, str) and len(expected) == 64, "Pin the approved bundle SHA-256 first"
limit = 400 * 1024 * 1024
try:
    with urllib.request.urlopen(url, timeout=60) as response:
        assert urllib.parse.urlsplit(response.url).scheme == "https"
        data = response.read(limit + 1)
except Exception:
    raise SystemExit("Audio bundle download failed. Check the secret URL and its expiry.") from None
assert len(data) <= limit, "Bundle exceeds 400 MB"
assert hashlib.sha256(data).hexdigest() == expected, "Bundle differs from the reviewed checksum"
root = Path("production/first-reveal/audio-assets").resolve()
allowed = {config["narration"]["path"], config["music"]["path"], config["approvedMix"]["path"],
           *[x["path"] for x in config["sfx"].values()], "rights/rights.json"}
with zipfile.ZipFile(io.BytesIO(data)) as bundle:
    assert len(bundle.infolist()) <= 40, "Unexpected bundle file count"
    assert sum(x.file_size for x in bundle.infolist()) <= 800 * 1024 * 1024
    files = [x for x in bundle.infolist() if not x.is_dir()]
    assert len({x.filename for x in files}) == len(files), "Duplicate ZIP paths"
    for item in files:
        p = PurePosixPath(item.filename)
        assert not p.is_absolute() and ".." not in p.parts and "\\" not in item.filename
        assert item.filename in allowed, "Bundle contains an unexpected file"
        assert ((item.external_attr >> 16) & 0o170000) != 0o120000, "Symlinks are not accepted"
    for item in files:
        target = root / item.filename
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(bundle.read(item))
print("Checksum-pinned audio bundle imported into ignored staging directory.")
