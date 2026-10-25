import React from 'react';
import {AbsoluteFill,Composition,Folder,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {OpticalWorld} from './OpticalWorld';
import {ease} from './motion';

export const SignalRefinement:React.FC<{audio?:boolean;blurSamples?:number}>=({audio=true,blurSamples=2})=>{
 const {width,height,fps}=useVideoConfig(),t=useCurrentFrame()/fps;
 return <AbsoluteFill style={{background:'#050b13'}}>
  <style>{`@font-face{font-family:Manrope;src:url(${staticFile('fonts/manrope-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800;font-display:block}`}</style>
  <Sequence name="Continuous optical world / Blender sector deformation / camera travel" premountFor={fps}>
   <CameraMotionBlur shutterAngle={100} samples={blurSamples}>
    <ThreeCanvas width={width} height={height} dpr={1.25} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} camera={{fov:36,position:[0,.55,17],near:.08,far:120}}><OpticalWorld/></ThreeCanvas>
   </CameraMotionBlur>
  </Sequence>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 46%,transparent 42%,rgba(1,5,12,.25) 100%)',pointerEvents:'none'}}/>
  {t>5.2?<div style={{position:'absolute',left:76,bottom:105,display:'flex',alignItems:'center',gap:17,color:'#d9e7f1',font:'650 30px Manrope',opacity:ease(t,5.2,5.52)}}><Img src={staticFile('brand/models-suite-logo.png')} style={{width:48,height:48,objectFit:'contain'}}/>Models Suite</div>:null}
  {audio?<Audio name="Approved Phase 2 opening / unity / zero offset" src={staticFile('signal/audio/SIGNAL-opening-6s-REVIEW.wav')} volume={1} premountFor={fps}/>:null}
 </AbsoluteFill>;
};
export const RefinementRegistrations=()=><Folder name="SIGNAL-Refined">
 <Composition id="SignalRefinedOpening" component={SignalRefinement} width={1080} height={1920} fps={30} durationInFrames={180} defaultProps={{audio:true,blurSamples:2}}/>
</Folder>;
