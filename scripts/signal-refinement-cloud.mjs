import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {RenderInternals} from '@remotion/renderer';
const executable=(type)=>RenderInternals.getExecutablePath({type,indent:false,logLevel:'error',binariesDirectory:null});
const ffmpeg=executable('ffmpeg'),ffprobe=executable('ffprobe');
assert.equal(process.env.GITHUB_ACTIONS,'true','Final video export is GitHub Actions only');
assert.equal(process.env.RUNNER_ENVIRONMENT,'github-hosted');
assert.equal(process.env.GITHUB_REPOSITORY,'ayaneijaz45-hue/Demo-video-');
assert.equal(process.platform,'linux');
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
assert.equal(event.repository.private,false,'Existing public standard runner only');
assert.equal(event.inputs.mode,'signal-refinement');
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const provenance=JSON.parse(readFileSync('production/signal/refinement/ASSET-PROVENANCE.json','utf8'));
assert.equal(sha(provenance.audio.file),provenance.audio.sha256,'Approved master must remain unchanged');
assert.equal(sha(provenance.geometry.glb),provenance.geometry.sha256,'Render the inspected Blender geometry');
const started=Date.now(),dir='out/signal-refinement';mkdirSync(dir,{recursive:true});
const out=`${dir}/SIGNAL-Refined-Opening-6s-1080x1920-30fps.mp4`;
const args=['render','src/signal-refinement/index.ts','SignalRefinedOpening',out,'--frames=0-179','--gl=swangle','--concurrency=2','--codec=h264','--crf=16','--pixel-format=yuv420p','--image-format=png','--audio-codec=aac','--audio-bitrate=320k','--timeout=120000'];
assert.equal(spawnSync(process.execPath,['node_modules/@remotion/cli/remotion-cli.js',...args],{stdio:'inherit'}).status,0);
const probe=spawnSync(ffprobe,['-v','error','-count_frames','-show_streams','-show_format','-of','json',out],{encoding:'utf8'});assert.equal(probe.status,0,probe.stderr);
const media=JSON.parse(probe.stdout),v=media.streams.find(s=>s.codec_type==='video'),a=media.streams.find(s=>s.codec_type==='audio');
assert.equal(v.width,1080);assert.equal(v.height,1920);assert.equal(v.r_frame_rate,'30/1');assert.equal(Number(v.nb_read_frames),180);assert.ok(a&&a.channels===2&&a.sample_rate==='48000');assert.ok(Math.abs(Number(media.format.duration)-6)<.05);
writeFileSync(`${dir}/MEDIA-PROBE.json`,JSON.stringify(media,null,2));
const decode=spawnSync(ffmpeg,['-v','error','-i',out,'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'],{encoding:'utf8'});assert.equal(decode.status,0,decode.stderr);
for(const frame of [3,17,37,61,66,81,101,128,138,151,166,179]){
 const still=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-i',out,'-ss',String(frame/30),'-frames:v','1',`${dir}/frame-${String(frame).padStart(3,'0')}.png`],{encoding:'utf8'});assert.equal(still.status,0,still.stderr);
}
const loud=spawnSync(ffmpeg,['-hide_banner','-nostats','-i',out,'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8'});assert.equal(loud.status,0);let measurement=null;try{measurement=JSON.parse(loud.stderr.slice(loud.stderr.lastIndexOf('{'),loud.stderr.lastIndexOf('}')+1));}catch{}
writeFileSync(`${dir}/RENDER-REPORT.json`,JSON.stringify({commit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,composition:'SignalRefinedOpening',dimensions:[1080,1920],fps:30,frames:180,pictureSeconds:6,renderer:'Remotion 4.0.537 / Three.js 0.186.1 / GitHub-hosted standard Ubuntu / SwiftShader ANGLE',runtimeSeconds:(Date.now()-started)/1000,outputSHA256:sha(out),audioSource:provenance.audio,audioAACMeasurement:measurement,decode:'PASS',originalBlenderMeshesUsed:true,blenderCyclesMotionRender:false,optics:'Three.js physical transmission and dispersion, directional HDR reflections, and a true planar reflector. Continuous Blender-sector deformation and camera travel. Curved reflections remain environment based, not Cycles path tracing.',websiteFootage:false,elevenLabsCredits:0,full24SecondRender:false},null,2));
