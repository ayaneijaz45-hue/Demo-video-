import React,{useMemo,useEffect} from 'react';
import {PlaneGeometry,Color,ShaderMaterial} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {useCurrentFrame} from 'remotion';
// The pinned add-on exposes this shader at runtime; its typings omit the static member.
const reflectorShader=(Reflector as typeof Reflector & {ReflectorShader:{name:string;uniforms:Record<string,{value:unknown}>;vertexShader:string;fragmentShader:string}}).ReflectorShader;

export const OpticalStage:React.FC=()=>{
 const sample=useCurrentFrame();
 const floor=useMemo(()=>{
  const shader={...reflectorShader,
   vertexShader:reflectorShader.vertexShader
    .replace('varying vec4 vUv;','varying vec4 vUv; varying float vDepth;')
    .replace('gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );','vec4 viewPosition = modelViewMatrix * vec4(position, 1.0); vDepth = -viewPosition.z; gl_Position = projectionMatrix * viewPosition;'),
   fragmentShader:reflectorShader.fragmentShader
    .replace('varying vec4 vUv;','varying vec4 vUv; varying float vDepth;')
    .replace('gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );','float visibility = exp(-0.00036 * vDepth * vDepth); vec3 reflected = max(vec3(0.0), base.rgb - color); reflected = reflected / (vec3(1.0) + reflected); gl_FragColor = vec4(color + reflected * 0.38 * visibility, 1.0);')};
  const mirror=new Reflector(new PlaneGeometry(180,300),{color:new Color('#050b13'),shader,textureWidth:640,textureHeight:640,clipBias:.003,multisample:0});mirror.rotation.x=-Math.PI/2;mirror.position.set(0,-3.15,-60);
  (mirror.material as ShaderMaterial).toneMapped=false;
  // Transmission and opaque passes can request the same camera reflection twice.
  // Reuse only an identical time and camera transform; a changed sample renders anew.
  const renderReflection=mirror.onBeforeRender;let lastSignature='';
  mirror.onBeforeRender=function(renderer,scene,camera,geometry,material,group){
   const signature=[this.userData.sample,camera.uuid,...camera.matrixWorld.elements,...camera.projectionMatrix.elements].join(',');
   if(signature===lastSignature)return;
   lastSignature=signature;renderReflection.call(this,renderer,scene,camera,geometry,material,group);
  };
  return mirror;
 },[]);
 floor.userData.sample=sample;
 useEffect(()=>()=>{floor.geometry.dispose();floor.dispose();},[floor]);
 return <primitive object={floor}/>;
};
