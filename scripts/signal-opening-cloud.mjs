import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
assert.equal(process.env.GITHUB_ACTIONS,'true','Video export is GitHub Actions only');
assert.equal(process.env.RUNNER_ENVIRONMENT,'github-hosted');
assert.equal(process.env.GITHUB_REPOSITORY,'ayaneijaz45-hue/Demo-video-');
assert.equal(process.platform,'linux');
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
assert.equal(event.repository.private,false,'Use only the existing public standard runner');
assert.equal(event.inputs.mode,'signal-opening');
const started=Date.now();mkdirSync('out/signal-phase3',{recursive:true});
const provenance=JSON.parse(readFileSync('production/signal/phase3/ASSET-PROVENANCE.json','utf8'));
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
assert.ok(existsSync('public/signal/private/workspace.png'),'Private clean workspace capture was not staged');
assert.equal(sha('public/signal/private/workspace.png'),provenance.product.sha256);
assert.equal(sha('public/signal/audio/SIGNAL-opening-6s-REVIEW.wav'),provenance.audio.sha256);
const cli='node_modules/@remotion/cli/remotion-cli.js';
const args=['render','src/signal/index.ts','SignalOpening6Review30','out/signal-phase3/SIGNAL-Opening-6s-1080x1920-30fps.mp4','--frames=0-179','--gl=swangle','--concurrency=2','--codec=h264','--crf=16','--pixel-format=yuv420p','--audio-codec=aac','--audio-bitrate=320k','--timeout=120000'];
const rendered=spawnSync(process.execPath,[cli,...args],{stdio:'inherit'});assert.equal(rendered.status,0,'SIGNAL six-second render failed');
const out='out/signal-phase3/SIGNAL-Opening-6s-1080x1920-30fps.mp4';
const probe=spawnSync('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',out],{encoding:'utf8'});assert.equal(probe.status,0,probe.stderr);const media=JSON.parse(probe.stdout);const v=media.streams.find(s=>s.codec_type==='video'),a=media.streams.find(s=>s.codec_type==='audio');
assert.equal(v.width,1080);assert.equal(v.height,1920);assert.equal(v.r_frame_rate,'30/1');assert.equal(Number(v.nb_read_frames),180);assert.ok(a&&a.channels===2&&a.sample_rate==='48000');assert.ok(Math.abs(Number(media.format.duration)-6)<.05);
writeFileSync('out/signal-phase3/MEDIA-PROBE.json',JSON.stringify(media,null,2));
const decode=spawnSync('ffmpeg',['-v','error','-i',out,'-f','null','-'],{encoding:'utf8'});assert.equal(decode.status,0,decode.stderr);
const frames=[6,36,58,75,99,138,170,179];
for(const frame of frames){
  const still=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-i',out,'-vf',`select=eq(n\\,${frame})`,'-frames:v','1',`out/signal-phase3/frame-${String(frame).padStart(3,'0')}.png`],{encoding:'utf8'});assert.equal(still.status,0,still.stderr);
}
const loud=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',out,'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8'});assert.equal(loud.status,0);let measurement=null;try{measurement=JSON.parse(loud.stderr.slice(loud.stderr.lastIndexOf('{'),loud.stderr.lastIndexOf('}')+1));}catch{}
writeFileSync('out/signal-phase3/RENDER-REPORT.json',JSON.stringify({commit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,composition:'SignalOpening6Review30',remotion:'4.0.537',renderer:'GitHub-hosted public standard Ubuntu / SwiftShader ANGLE / concurrency 2',runtimeSeconds:(Date.now()-started)/1000,dimensions:[1080,1920],fps:30,frames:180,seconds:6,audioSource:provenance.audio,privateWorkspace: {sha256:provenance.product.sha256,transport:'Temporary encrypted Actions secrets; source pixels absent from Git history'},outputSHA256:sha(out),audioAACMeasurement:measurement,decode:'PASS',full24SecondRender:false,sceneplaneAssetsUsed:false,blenderRender:false,sourceUI:'Fresh authenticated blank creation surface; no fabricated responses or account/wallet pixels'},null,2));
