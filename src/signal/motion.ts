import {Easing} from 'remotion';
import {Matrix4, Quaternion, Vector3} from 'three';

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = (time: number, a: number, b: number) => Easing.bezier(.16, 1, .30, 1)(clamp((time-a)/(b-a)));
export const smooth = (time: number, a: number, b: number) => {const x=clamp((time-a)/(b-a)); return x*x*(3-2*x);};
export const ramp = (time: number, a: number, b: number) => clamp((time-a)/(b-a));
export const COLORS = {black:'#080C12', ivory:'#F2F0E9', cyan:'#7DEBFA', violet:'#8173D5', silver:'#D4DEE3'};
export const FOCAL_Z=19.03;
export const PIXEL=1/160;

export type CameraState = {position: [number,number,number]; target: [number,number,number]; fov: number; roll: number};
export const cameraAt = (t: number): CameraState => {
  if (t < 2.2) {
    const dive=Math.pow(smooth(t,1.6,2.2),2.2);
    return {position:[mix(0,-2.675,dive),mix(0,1.77,dive),mix(FOCAL_Z,.27,dive)],target:[mix(0,-2.675,dive),mix(0,1.77,dive),mix(0,-4,dive)],fov:35,roll:mix(0,-.018,smooth(t,1.93,2.2))};
  }
  const p=clamp((t-2.2)/2.4);
  // One continuous Hermite dolly: nonzero entry velocity, smooth cruise, zero end velocity.
  const move=1.1*p+.8*p*p-.9*p*p*p;
  const seat=smooth(t,4.2,5.2);
  return {position:[mix(-.32,0,seat),mix(.13,0,seat),mix(1.0,-6.2,move)-.2*smooth(t,5.2,7)],target:[mix(.12,0,seat),mix(-.27,0,seat),-22],fov:mix(55,35,seat),roll:mix(-.018,0,seat)};
};
export const cameraQuaternion = ({position,target,roll}:CameraState) => {
  const m=new Matrix4().lookAt(new Vector3(...position),new Vector3(...target),new Vector3(0,1,0));
  const q=new Quaternion().setFromRotationMatrix(m);
  if(roll)q.multiply(new Quaternion().setFromAxisAngle(new Vector3(0,0,1),roll));
  return q;
};

export const OPENING_TIMING = {
  fps:60, width:1080,height:1920,proofFrames:360,continuityEndFrame:420,
  cues:[
    {id:'Q001',frame:0,action:'Single source; restrained emergence'},
    {id:'Q002',frame:24,action:'ONE seats; physical letter contact'},
    {id:'Q003',frame:48,action:'IDEA. seats; full phrase readable'},
    {id:'Q004',frame:120,action:'Camera accelerates into I slot'},
    {id:'Q005',frame:132,action:'I sidewall opens into first optical gate'},
    {id:'Q006',frame:156,endFrame:192,action:'Signal divides and MANY / AI MODELS. turns into view'},
    {id:'Q007',frame:228,action:'Guide contact; pathways begin converging'},
    {id:'Q008',frame:264,action:'Final intake; gates align to viewport'},
    {id:'Q009',frame:276,action:'Workspace convergence and physical seat'},
  ],
  holds:{oneIdea:[48,96],manyModels:[180,228],workspace:[324,396]},
  audio:{file:'signal/audio/SIGNAL-opening-6s-REVIEW.wav',offsetSamples:0,gain:1,retimed:false},
};
