import React,{useEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {DataTexture,RGBAFormat,FloatType,UnsignedByteType,SRGBColorSpace,EquirectangularReflectionMapping,PMREMGenerator,MeshPhysicalMaterial,MeshStandardMaterial,Color,FrontSide,ACESFilmicToneMapping} from 'three';

export const titanium=new MeshPhysicalMaterial({color:'#8d9eaf',metalness:1,roughness:.26,clearcoat:.45,clearcoatRoughness:.2,anisotropy:.65,envMapIntensity:.65});
export const violetMetal=new MeshPhysicalMaterial({color:'#8170ac',metalness:.98,roughness:.23,clearcoat:.7,envMapIntensity:.8,iridescence:.3,iridescenceIOR:1.36,iridescenceThicknessRange:[180,420]});
export const cyanMetal=new MeshPhysicalMaterial({color:'#4c8398',metalness:.92,roughness:.25,clearcoat:.6,anisotropy:.6,envMapIntensity:.8});
export const opticalGlass=new MeshPhysicalMaterial({color:'#c4f5ff',metalness:0,roughness:.085,transmission:.96,thickness:1.2,ior:1.52,dispersion:.6,attenuationColor:new Color('#7dd7f2'),attenuationDistance:4,clearcoat:1,side:FrontSide});
const sheen=new Uint8Array(4*512);
const stops:[[number,number,number,number]]|number[][]=[[0,40,66,89],[.22,176,208,222],[.43,233,242,241],[.48,89,118,147],[.53,38,55,79],[.78,145,184,205],[1,232,244,246]];
for(let y=0;y<512;y++){const u=y/511;let a=stops[0],b=stops[1];for(let i=1;i<stops.length;i++){if(u<=stops[i][0]){a=stops[i-1];b=stops[i];break;}}const p=(u-a[0])/(b[0]-a[0]);for(let c=0;c<3;c++)sheen[y*4+c]=a[c+1]+(b[c+1]-a[c+1])*p;sheen[y*4+3]=255;}
const sheenMap=new DataTexture(sheen,1,512,RGBAFormat,UnsignedByteType);sheenMap.colorSpace=SRGBColorSpace;sheenMap.needsUpdate=true;
export const silverFace=new MeshPhysicalMaterial({color:'#d0e7f0',map:sheenMap,metalness:.48,roughness:.27,clearcoat:.5});
export const typeEdge=new MeshPhysicalMaterial({color:'#62758b',metalness:.8,roughness:.29,clearcoat:.3});
export const darkFace=new MeshStandardMaterial({color:'#101c2d',metalness:.35,roughness:.30});

/** HDR values, softbox geometry and black flags create broad, shaped metal reflections. */
export const OpticalLighting:React.FC=()=>{
 const {scene,gl}=useThree();
 const env=useMemo(()=>{
  const w=1024,h=512,data=new Float32Array(w*h*4);
  const panel=(u:number,v:number,cx:number,cy:number,sx:number,sy:number)=>Math.exp(-Math.pow((u-cx)/sx,12)-Math.pow((v-cy)/sy,12));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const u=x/w,v=y/h,j=(y*w+x)*4;
   const a=panel(u,v,.23,.44,.09,.26)*2,b=panel(u,v,.64,.38,.014,.28)*4,c=panel(u,v,.46,.12,.22,.025)*2.4,d=panel(u,v,.9,.48,.07,.24)*1;
   const base=.025+.075*Math.sin(v*Math.PI);
   data[j]=base+a+b*.72+c+d*.60;data[j+1]=base+a*.98+b*.9+c+d*.44;data[j+2]=base+a*.95+b+c+d;data[j+3]=1;
  }
  const tex=new DataTexture(data,w,h,RGBAFormat,FloatType);tex.mapping=EquirectangularReflectionMapping;tex.needsUpdate=true;
  const pmrem=new PMREMGenerator(gl),render=pmrem.fromEquirectangular(tex);pmrem.dispose();tex.dispose();return render;
 },[gl]);
 useEffect(()=>{scene.environment=env.texture;scene.environmentIntensity=1;gl.toneMapping=ACESFilmicToneMapping;gl.toneMappingExposure=1;return()=>{scene.environment=null;env.dispose();};},[env,scene,gl]);
 return <><ambientLight intensity={.25}/><directionalLight position={[-5,7,8]} intensity={2.1} color="#fff4e4"/><directionalLight position={[4,-2,5]} intensity={1.4} color="#99d7ff"/></>;
};
