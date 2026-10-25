import React from 'react';
import {AbsoluteFill,Composition,Folder,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {OpticalWorld} from './OpticalWorld';
import {ease} from './motion';

export const SignalCorrection:React.FC<{audio?:boolean;blurSamples?:number}>=({audio=true,blurSamples=2})=>{
 const {width,height,fps}=useVideoConfig(),t=useCurrentFrame()/fps;
 return <AbsoluteFill style={{background:'#101923'}}>
  <style>{`@font-face{font-family:Manrope;src:url(${staticFile('fonts/manrope-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800;font-display:block}`}</style>
  <Sequence name="Original Blender optical sculpture / kinetic type / continuous convergence" premountFor={fps}>
   <CameraMotionBlur shutterAngle={110} samples={blurSamples}>
    <ThreeCanvas width={width} height={height} dpr={1.5} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} camera={{fov:32,position:[0,0,17.8],near:.05,far:100}}>
     <OpticalWorld/>
    </ThreeCanvas>
   </CameraMotionBlur>
  </Sequence>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 48%,transparent 42%,rgba(4,10,18,.3) 100%)',pointerEvents:'none'}}/>
  <div style={{position:'absolute',left:75,right:75,top:82,display:'flex',justifyContent:'space-between',font:'500 20px Manrope',letterSpacing:4,color:t>2.25&&t<4.5?'#475c68':'#96aebd',opacity:.75}}><span>MODELS SUITE</span><span>SIGNAL / 01</span></div>
  {t>5.03?<div style={{position:'absolute',left:75,bottom:125,display:'flex',alignItems:'center',gap:18,color:'#d9e6ed',font:'650 33px Manrope',opacity:ease(t,5.03,5.4)}}><Img src={staticFile('brand/models-suite-logo.png')} style={{width:52,height:52,objectFit:'contain'}}/>Models Suite</div>:null}
  {audio?<Audio name="Approved Phase 2 opening / unchanged / 48kHz" src={staticFile('signal/audio/SIGNAL-opening-6s-REVIEW.wav')} volume={1} premountFor={fps}/>:null}
 </AbsoluteFill>;
};
export const CorrectionRegistrations=()=><Folder name="SIGNAL-Corrected">
 <Composition id="SignalCorrectedOpening" component={SignalCorrection} width={1080} height={1920} fps={30} durationInFrames={180} defaultProps={{audio:true,blurSamples:2}}/>
</Folder>;
