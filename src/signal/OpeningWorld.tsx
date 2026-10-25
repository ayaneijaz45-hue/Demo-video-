import React,{useLayoutEffect,useMemo} from 'react';
import {useThree,useLoader} from '@react-three/fiber';
import {useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import {PerspectiveCamera,TextureLoader,SRGBColorSpace,DoubleSide} from 'three';
import {BeveledBar,ceramic,darkMetal,edgeGlass,ExtrudedSpine,Gate,glass,metal,SignalRoute,StudioReflection} from './Optics';
import {KineticWord} from './Typography';
import {cameraAt,cameraQuaternion,clamp,COLORS,ease,FOCAL_Z,mix,ramp,smooth} from './motion';

const CameraRig:React.FC<{time:number}>=({time})=>{
  const {camera}=useThree();const state=cameraAt(time);
  useLayoutEffect(()=>{
    const c=camera as PerspectiveCamera;c.position.set(...state.position);c.quaternion.copy(cameraQuaternion(state));c.fov=state.fov;c.near=.025;c.far=120;c.updateProjectionMatrix();c.updateMatrixWorld();
  },[camera,...state.position,...state.target,state.fov,state.roll]);
  return null;
};

const CameraAnchoredType:React.FC<{time:number;children:React.ReactNode}>=({time,children})=>{
  const state=cameraAt(time);const distance=6/Math.tan(state.fov*Math.PI/360);
  return <group position={state.position} quaternion={cameraQuaternion(state)}><group position={[0,0,-distance]}>{children}</group></group>;
};

/** The I becomes two guides around a real longitudinal opening, not a letter counter. */
const SourceAndType:React.FC<{time:number}>=({time:t})=>{
  const release=smooth(t,1.6,2.05);const growth=smooth(t,.80,1.35);const depth=mix(.065,6.8,growth)*(1-release)+4.4*release;const split=mix(0,.105,smooth(t,1.72,2.08));
  const emerge=ease(t,.20,.40);const pointX=-.10625,pointY=1.36875;
  const pointTravel=smooth(t,.20,.38);
  return <>
    {t<.64?<mesh position={[pointX,pointY,.08]} scale={[mix(1,.60,pointTravel),mix(1,6,pointTravel),1]}>
      <sphereGeometry args={[.018,20,16]}/><meshBasicMaterial color={COLORS.ivory}/>
    </mesh>:null}
    {t>=.20&&t<.8?<BeveledBar position={[mix(pointX,-2.675,emerge),mix(pointY,1.77,emerge),0]} size={[.155,mix(.07,1.22,emerge),.065]} material={metal}/>:null}
    <KineticWord text="ONE" position={[-2.775,2.67,0]} capHeight={1.22} time={t} arrival={.245} duration={.12} fold={release}/>
    <KineticWord text="IDEA." position={[-2.775,1.16,0]} capHeight={1.22} time={t} arrival={.62} duration={.12} fold={release} skipFirst={t>=1.6}/>
    {t>=.8?<group>
      <ExtrudedSpine x={-2.675-.042-split} depth={depth} shear={[4*growth*(1-release),-5.7*growth*(1-release)]} material={glass}/>
      <ExtrudedSpine x={-2.675+.042+split} depth={depth} shear={[4*growth*(1-release),-5.7*growth*(1-release)]} material={metal}/>
      {t>=1.6?<mesh position={[-2.675,1.77,-4.48]}><planeGeometry args={[12,24]}/><meshBasicMaterial color={COLORS.ivory} side={DoubleSide}/></mesh>:null}
      <SignalRoute points={[[-2.675,1.24,-.12],[-2.675,1.55,-1.4],[-2.675,1.77,-4.4]]} progress={ramp(t,1.8,2.2)} radius={.011}/>
    </group>:null}
  </>;
};

const WorkspaceSurface:React.FC<{time:number}>=({time:t})=>{
  const texture=useLoader(TextureLoader,staticFile('signal/private/workspace.png'));
  texture.colorSpace=SRGBColorSpace;
  const p=smooth(t,4.2,5.2);const yaw=mix(.12,0,p);
  return <group position={[0,-.85,-22]} rotation={[0,yaw,0]}>
    <Gate position={[0,0,0]} width={4.42} height={4.02} dark/>
    <mesh position={[0,0,.05]}><planeGeometry args={[4.2,3.8]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
    <mesh position={[0,0,.08]}><planeGeometry args={[4.2,3.8]}/><meshBasicMaterial color="#08111A" transparent opacity={mix(1,0,ease(t,4.35,5.2))}/></mesh>
  </group>;
};

/** Nested extrusions, independently routed splines, then a shared physical viewport. */
const OpticalCorridor:React.FC<{time:number}>=({time:t})=>{
  const fork=smooth(t,2.60,3.2);const converge=smooth(t,3.8,4.6);const clear=smooth(t,4.2,5.08);
  const zPositions=[-1.6,-4.8,-8.0,-11.2,-14.4,-17.6,-20.0];
  return <>
    <group>
      {zPositions.map((z,i)=>{
        const departure=smooth(t,4.2+i*.012,5.08+i*.012);const gz=mix(z,-22.2,converge);
        const w=mix(5.6,4.42,converge),h=mix(6.4,4.02,converge);
        return <group key={i} position={[0,-.85,gz]} rotation={[0,mix((i%2===0?.025:-.025),0,converge),0]} scale={[mix(1,.999,converge),1,1]}>
          <Gate position={[mix(0,(i%2===0?-12:12),departure),0,0]} width={w} height={h} rotation={[0,departure*(i%2===0?-.95:.95),0]}/>
          <BeveledBar position={[mix(-2.55,-12,departure),0,-.14]} size={[.12,mix(6.05,3.8,converge),.4]} material={edgeGlass}/>
          <BeveledBar position={[mix(2.55,12,departure),0,-.14]} size={[.12,mix(6.05,3.8,converge),.4]} material={edgeGlass}/>
        </group>;
      })}
    </group>
    <mesh position={[-mix(4,18,clear),0,-15]} rotation={[0,Math.PI/2+clear*Math.PI/2,0]}><planeGeometry args={[44,22]}/><primitive attach="material" object={ceramic}/></mesh>
    <mesh position={[mix(4,18,clear),0,-15]} rotation={[0,-Math.PI/2-clear*Math.PI/2,0]}><planeGeometry args={[44,22]}/><primitive attach="material" object={ceramic}/></mesh>
    <mesh position={[0,mix(-4.15,-18,clear),-15]} rotation={[-Math.PI/2-clear*.5,0,0]}><planeGeometry args={[44,44]}/><primitive attach="material" object={ceramic}/></mesh>
    <mesh position={[0,0,-37]} rotation={[0,clear*Math.PI/2,0]}><planeGeometry args={[50,45]}/><primitive attach="material" object={ceramic}/></mesh>
    {t<4.95?<group>
      <SignalRoute points={[[0,-2.9,1],[0,-2.4,-3],[mix(0,-1.8,fork)*(1-converge),-2.0,-7],[mix(0,-1.8,fork)*(1-converge),-1.5,-14],[mix(0,-1.4,fork)*(1-converge),-.85,-21.9]]} progress={ramp(t,2.2,4.6)} radius={.022}/>
      <SignalRoute points={[[0,-2.9,1],[0,-2.4,-3],[0,mix(-2,-1.8,fork)*(1-converge)-.85*converge,-8],[0,mix(-1.5,-1.15,fork)*(1-converge)-.85*converge,-15],[0,-.85,-21.9]]} progress={ramp(t,2.6,4.6)} radius={.021}/>
      <SignalRoute points={[[0,-2.9,1],[0,-2.4,-3],[mix(0,1.8,fork)*(1-converge),-1.65,-7],[mix(0,1.8,fork)*(1-converge),-1.2,-14],[mix(0,1.4,fork)*(1-converge),-.85,-21.9]]} progress={ramp(t,2.78,4.6)} radius={.019} violet/>
    </group>:null}
    <WorkspaceSurface time={t}/>
    <CameraAnchoredType time={t}>
      {t<4.5?<group position={[0,4.2,.2]} rotation={[smooth(t,3.8,4.5)*Math.PI/2,0,0]}>
        <mesh renderOrder={900}><planeGeometry args={[12,4.7]}/><meshBasicMaterial color={COLORS.ivory} toneMapped={false} depthTest={false} depthWrite={false} transparent/></mesh>
      </group>:null}
      {t<4.5?<group position={[0,0,0]} rotation={[0,0,0]}>
        <KineticWord text="MANY" position={[-2.775,3.12,0]} capHeight={.875} time={t} arrival={2.59} duration={.19} formation="rail" tone="dark" fold={smooth(t,3.8,4.35)}/>
        <KineticWord text="AI MODELS." position={[-2.775,1.99,0]} capHeight={.78} time={t} arrival={2.77} duration={.17} formation="rail" tone="dark" fold={smooth(t,3.8,4.35)}/>
      </group>:null}
      {t>=4.45?<>
        <KineticWord text="ONE" position={[-2.775,3.17,0]} capHeight={.81} time={t} arrival={4.51} duration={.09}/>
        <KineticWord text="WORKSPACE." position={[-2.775,2.29,0]} capHeight={.57} time={t} arrival={4.59} duration={.18}/>
      </>:null}
    </CameraAnchoredType>
  </>;
};

export const OpeningWorld:React.FC<{offsetSeconds?:number}>=({offsetSeconds=0})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps+offsetSeconds;
  return <>
    <color attach="background" args={[COLORS.black]}/>
    <CameraRig time={time}/><StudioReflection/>
    {time<2.2?<SourceAndType time={time}/>:<OpticalCorridor time={time}/>}
  </>;
};
