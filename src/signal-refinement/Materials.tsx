import React,{useMemo,useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {Color,DataTexture,RGBAFormat,FloatType,UnsignedByteType,EquirectangularReflectionMapping,PMREMGenerator,MeshPhysicalMaterial,FrontSide,RepeatWrapping,Vector2,ACESFilmicToneMapping} from 'three';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();

export const silver=new MeshPhysicalMaterial({color:'#a9becd',metalness:1,roughness:.16,clearcoat:.65,clearcoatRoughness:.1,anisotropy:.55,envMapIntensity:1.25});
export const blue=new MeshPhysicalMaterial({color:'#5595b9',metalness:.98,roughness:.15,clearcoat:.9,anisotropy:.45,envMapIntensity:1.2});
export const violet=new MeshPhysicalMaterial({color:'#9b97c6',metalness:.98,roughness:.17,clearcoat:.9,iridescence:.22,iridescenceIOR:1.35,envMapIntensity:1.2});
export const champagne=new MeshPhysicalMaterial({color:'#bea08a',metalness:1,roughness:.18,clearcoat:.6,envMapIntensity:1.2});
export const glass=new MeshPhysicalMaterial({color:'#d9f4ff',metalness:0,roughness:.065,transmission:.98,thickness:.5,ior:1.49,dispersion:.55,attenuationColor:new Color('#9bdbfa'),attenuationDistance:8,clearcoat:1,side:FrontSide});
const grain=new Uint8Array(128*128*4);
for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4,h=Math.sin(x*127.1+y*311.7)*43758.5453,n=h-Math.floor(h);grain[i]=128+Math.sin(x*.1)*18+Math.sin(x*.72+y*.06)*5+(n-.5)*3;grain[i+1]=128+Math.sin(y*.12)*10;grain[i+2]=255;grain[i+3]=255;}
const normalMap=new DataTexture(grain,128,128,RGBAFormat,UnsignedByteType);normalMap.wrapS=normalMap.wrapT=RepeatWrapping;normalMap.needsUpdate=true;
export const typeFace=new MeshPhysicalMaterial({color:'#e1f0f8',metalness:.76,roughness:.15,clearcoat:1,clearcoatRoughness:.09,envMapIntensity:1.65,normalMap,normalScale:new Vector2(.45,.45),emissive:'#173148',emissiveIntensity:.12});
export const typeEdge=new MeshPhysicalMaterial({color:'#9bbed3',metalness:.95,roughness:.12,clearcoat:1,envMapIntensity:1.65});

export const OpticalLighting:React.FC<{cameraZ:number}>=({cameraZ})=>{
 const {gl,scene}=useThree();
 const env=useMemo(()=>{
  const w=1024,h=512,d=new Float32Array(w*h*4);
  const box=(u:number,v:number,x:number,y:number,sx:number,sy:number)=>Math.exp(-Math.pow((u-x)/sx,10)-Math.pow((v-y)/sy,10));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const u=x/w,v=y/h,i=(y*w+x)*4;
   const key=box(u,v,.22,.43,.055,.23)*4.5,edge=box(u,v,.66,.44,.009,.31)*13,roof=box(u,v,.48,.15,.24,.018)*5,warm=box(u,v,.84,.46,.018,.25)*4.2;
   const front=box(u,v,.75,.47,.12,.27)*1.0+box(u,v,.716,.48,.012,.28)*3.4+box(u,v,.785,.5,.017,.24)*2.8;
   const grad=.035+.11*Math.pow(Math.sin(v*Math.PI),2);
   d[i]=grad+key*.88+edge*.48+roof+warm+front;d[i+1]=grad+key*.96+edge*.78+roof+warm*.64+front;d[i+2]=grad+key+edge+roof+warm*.42+front;d[i+3]=1;
  }
  const tex=new DataTexture(d,w,h,RGBAFormat,FloatType);tex.mapping=EquirectangularReflectionMapping;tex.needsUpdate=true;const p=new PMREMGenerator(gl),result=p.fromEquirectangular(tex);p.dispose();tex.dispose();return result;
 },[gl]);
 useEffect(()=>{scene.environment=env.texture;scene.environmentIntensity=1;gl.toneMapping=ACESFilmicToneMapping;gl.toneMappingExposure=.9;return()=>{scene.environment=null;env.dispose();};},[env,scene,gl]);
 return <><ambientLight intensity={.18}/><rectAreaLight position={[-1.8,2.7,cameraZ-3]} rotation={[-.24,-.15,0]} width={7} height={4.5} intensity={7} color="#f0f7ff"/><rectAreaLight position={[3.5,.5,cameraZ-4]} rotation={[0,.23,0]} width={1.1} height={7} intensity={9} color="#a2d9ff"/><directionalLight position={[-3,6,10]} intensity={2.2} color="#e0f5ff"/><directionalLight position={[5,2,-10]} intensity={2.4} color="#71bfff"/><directionalLight position={[-5,0,-22]} intensity={1.7} color="#d6ad8a"/></>;
};
