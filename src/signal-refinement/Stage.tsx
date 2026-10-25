import React,{useMemo,useEffect} from 'react';
import {PlaneGeometry,Color} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

export const OpticalStage:React.FC=()=>{
 const floor=useMemo(()=>{
  const mirror=new Reflector(new PlaneGeometry(90,100),{color:new Color('#61748b'),textureWidth:640,textureHeight:640,clipBias:.003,multisample:0});mirror.rotation.x=-Math.PI/2;mirror.position.set(0,-3.15,-15);return mirror;
 },[]);
 useEffect(()=>()=>{floor.geometry.dispose();floor.dispose();},[floor]);
 return <><primitive object={floor}/>
  <mesh position={[0,-3.145,-15]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[90,100]}/><meshPhysicalMaterial color="#08101c" roughness={.22} metalness={.5} transparent opacity={.55} depthWrite={false}/></mesh>
 </>;
};
