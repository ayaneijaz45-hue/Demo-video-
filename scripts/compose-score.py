"""Original score and FX, synthesized from scratch. No samples or third-party music.
Run with Python + numpy. Generates audio only; never renders video locally.
Music: 120 BPM, D minor / F major colors, 60 seconds, 48 kHz stereo.
"""
from pathlib import Path
import json, wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
SR=48000
N=SR*60
music=np.zeros((N,2),dtype=np.float64)
fx=np.zeros((N,2),dtype=np.float64)
rng=np.random.default_rng(6721)

def hz(n): return 440*2**((n-69)/12)
def add(dst,start,signal,pan=0):
    a=int(start*SR)
    if a<0: signal=signal[-a:]; a=0
    signal=signal[:N-a]
    if len(signal)==0: return
    dst[a:a+len(signal),0]+=signal*np.sqrt((1-pan)/2)
    dst[a:a+len(signal),1]+=signal*np.sqrt((1+pan)/2)

# Warm additive pads with slow stereo motion; original harmony, not a song interpolation.
chords=[[50,57,60,64,69],[46,53,57,60,65],[53,60,64,67,72],[48,55,60,62,67]]
for bar in range(15):
    start=bar*4
    t=np.arange(int(5.7*SR))/SR
    env=np.minimum(t/.8,1)*np.minimum((5.7-t)/1.8,1)
    for j,note in enumerate(chords[(bar//2)%4]):
        freq=hz(note)
        tone=(np.sin(2*np.pi*freq*t)+.17*np.sin(2*np.pi*freq*2.001*t)+.07*np.sin(2*np.pi*freq*3*t))
        add(music,start,tone*env*.048,(-.6+j*.3))

# A compact mallet signature; space between phrases leaves room for narration.
for step in range(240):
    start=step*.25
    if start<5 or start>57.5: continue
    if step%8 in (3,6,7): continue
    notes=chords[(int(start)//8)%4]
    freq=hz(notes[(step*3)%len(notes)]+24)
    t=np.arange(int(.8*SR))/SR
    env=(1-np.exp(-t*180))*np.exp(-t*7)
    tone=(np.sin(2*np.pi*freq*t)+.18*np.sin(2*np.pi*freq*3*t))*env
    add(music,start,tone*.082,np.sin(step)*.6)
    add(music,start+.1875,tone*.019,-np.sin(step)*.6)

# Subtle halftime rhythm and low-frequency pulse, deliberately restrained under text.
for beat in range(120):
    start=beat*.5
    if start<5 or start>=58: continue
    t=np.arange(int(.34*SR))/SR
    if beat%2==0:
        phase=2*np.pi*(48*t+65*.035*(1-np.exp(-t/.035)))
        add(music,start,np.sin(phase)*np.exp(-t*17)*.22)
    if beat%4==2:
        noise=rng.standard_normal(len(t))
        filtered=noise-np.roll(noise,1)
        add(music,start,filtered*np.exp(-t*35)*.022)
    if beat%2==1:
        noise=rng.standard_normal(len(t))
        add(music,start,(noise-np.roll(noise,1))*np.exp(-t*95)*.012,.35)

# Score gets quieter in the reserved professional narration windows.
cues=json.loads((ROOT/'production/narration.json').read_text())['cues']
timeline=np.arange(N)/SR
duck=np.ones(N)
for cue in cues:
    a,b=cue['start'],cue['end']
    inside=np.clip((timeline-(a-.25))/.25,0,1)*np.clip(((b+.35)-timeline)/.35,0,1)
    duck*=1-inside*.24
music*=duck[:,None]

# Custom whooshes, low impacts, and UI ticks at real editorial events.
for start in [5,12,20,28,40,48,54]:
    t=np.arange(int(.7*SR))/SR
    noise=rng.standard_normal(len(t))
    smooth=np.convolve(noise,np.ones(11)/11,mode='same')
    env=np.sin(np.pi*t/.7)**2
    add(fx,start-.48,smooth*env*.22,-.15)
    t=np.arange(int(1.6*SR))/SR
    impact=np.sin(2*np.pi*(42*t+25*.06*(1-np.exp(-t/.06))))*np.exp(-t*6)
    shine=np.sin(2*np.pi*hz(86)*t)*np.exp(-t*12)*.14
    add(fx,start,impact*.3+shine*.2)
for start in [3.25,6.0,16.1,18.0,22.4,25.1,30.15,31.8,33.5,41.7,44.8,49.6,50.7,51.8,57.2]:
    t=np.arange(int(.22*SR))/SR
    tick=(np.sin(2*np.pi*hz(86)*t)+.3*np.sin(2*np.pi*hz(93)*t))*np.exp(-t*38)
    add(fx,start,tick*.075,np.sin(start)*.4)

fade=np.clip(timeline/1.0,0,1)*np.clip((60-timeline)/1.1,0,1)
music*=fade[:,None]
fx*=fade[:,None]
peak=float(np.max(np.abs(music*.85+fx*.65)))
if peak>.82:
    music*=.82/peak
    fx*=.82/peak
out=ROOT/'public/audio'
out.mkdir(exist_ok=True)
for name,data in [('one-workspace-score',music),('one-workspace-fx',fx)]:
    pcm=(np.clip(data,-1,1)*32767).astype('<i2')
    with wave.open(str(out/(name+'.wav')),'wb') as wav:
        wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR);wav.writeframes(pcm.tobytes())
    print(name,'60.000s stereo 48000Hz; peak',round(float(np.max(np.abs(data))),3))
