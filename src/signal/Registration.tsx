import React from 'react';
import {AbsoluteFill,Composition,Folder,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {OpeningWorld} from './OpeningWorld';
import {SharpWordFace} from './Typography';
import {ease} from './motion';

type SignalProps={offsetSeconds?:number;audio?:boolean;blurSamples?:number};

const ReadingFaces:React.FC<{offsetSeconds:number}>=({offsetSeconds})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps+offsetSeconds;
  return <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    {t>=.8&&t<=1.6?<><SharpWordFace text="ONE" capHeight={1.22} x={-2.775} y={2.67}/><SharpWordFace text="IDEA." capHeight={1.22} x={-2.775} y={1.16}/></>:null}
    {t>=3.0&&t<=3.8?<><SharpWordFace text="MANY" capHeight={.875} x={-2.775} y={3.12} tone="dark"/><SharpWordFace text="AI MODELS." capHeight={.78} x={-2.775} y={1.99} tone="dark"/></>:null}
    {t>=5.2?<><SharpWordFace text="ONE" capHeight={.81} x={-2.775} y={3.17}/><SharpWordFace text="WORKSPACE." capHeight={.57} x={-2.775} y={2.29}/></>:null}
  </svg>;
};

const OfficialIdentity:React.FC<{offsetSeconds:number}>=({offsetSeconds})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps+offsetSeconds;
  if(t<5)return null;
  return <div style={{position:'absolute',left:137,top:650,display:'flex',alignItems:'center',gap:15,opacity:ease(t,5,5.22),translate:`0 ${12*(1-ease(t,5,5.22))}px`,fontFamily:'Manrope',fontWeight:750,color:'#F2F0E9',fontSize:39}}>
    <Img src={staticFile('brand/models-suite-logo.png')} style={{width:48,height:48,objectFit:'contain'}}/>
    <span>Models Suite</span>
  </div>;
};

export const SignalOpening:React.FC<SignalProps>=({offsetSeconds=0,audio=true,blurSamples=3})=>{
  const {width,height,fps}=useVideoConfig();
  return <AbsoluteFill style={{background:'#080C12'}}>
    <style>{`@font-face{font-family:Manrope;src:url(${staticFile('fonts/manrope-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800;font-display:block}`}</style>
    <Sequence from={0} name="Optical Switch — continuous geometry and camera" premountFor={fps}>
      <CameraMotionBlur shutterAngle={100} samples={blurSamples}>
        <ThreeCanvas width={width} height={height} dpr={1} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} camera={{fov:35,position:[0,0,19.03],near:.025,far:120}}>
          <OpeningWorld offsetSeconds={offsetSeconds}/>
        </ThreeCanvas>
      </CameraMotionBlur>
    </Sequence>
    <ReadingFaces offsetSeconds={offsetSeconds}/>
    <OfficialIdentity offsetSeconds={offsetSeconds}/>
    {audio?<Audio name="Phase 2 commercial-use synchronized review — unchanged" src={staticFile('signal/audio/SIGNAL-opening-6s-REVIEW.wav')} volume={1} premountFor={fps}/>:null}
  </AbsoluteFill>;
};

export const SignalRegistrations=()=> <Folder name="SIGNAL">
  <Composition id="SignalOpening6Review30" component={SignalOpening} width={1080} height={1920} fps={30} durationInFrames={180} defaultProps={{offsetSeconds:0,audio:true,blurSamples:2}}/>
  <Composition id="SignalOpening6" component={SignalOpening} width={1080} height={1920} fps={60} durationInFrames={360} defaultProps={{offsetSeconds:0,audio:true,blurSamples:3}}/>
  <Composition id="SignalOneIdea" component={SignalOpening} width={1080} height={1920} fps={60} durationInFrames={132} defaultProps={{offsetSeconds:0,audio:false,blurSamples:3}}/>
  <Composition id="SignalManyModels" component={SignalOpening} width={1080} height={1920} fps={60} durationInFrames={144} defaultProps={{offsetSeconds:2.2,audio:false,blurSamples:3}}/>
  <Composition id="SignalWorkspaceHandle" component={SignalOpening} width={1080} height={1920} fps={60} durationInFrames={144} defaultProps={{offsetSeconds:4.6,audio:false,blurSamples:3}}/>
</Folder>;
