import React,{useEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {DataTexture,EquirectangularReflectionMapping,RGBAFormat,UnsignedByteType,SRGBColorSpace,PMREMGenerator,Shape,Path,ExtrudeGeometry,Color,DoubleSide,MeshPhysicalMaterial,MeshStandardMaterial,CatmullRomCurve3,Vector3,TubeGeometry} from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {COLORS} from './motion';

export const metal=new MeshStandardMaterial({color:'#C1CDD1',metalness:1,roughness:.18});
export const darkMetal=new MeshStandardMaterial({color:'#202E3B',metalness:.90,roughness:.22});
export const glass=new MeshPhysicalMaterial({color:'#A4E6EE',metalness:.04,roughness:.12,transmission:.76,thickness:.15,ior:1.46,transparent:true,opacity:.93,attenuationColor:new Color('#55CBD7'),attenuationDistance:2.0,clearcoat:1,clearcoatRoughness:.08,side:DoubleSide});
// The small corridor edge inlays use reflective transparency; the source spine retains transmission.
export const edgeGlass=new MeshPhysicalMaterial({color:'#A4E6EE',metalness:.12,roughness:.13,transparent:true,opacity:.50,clearcoat:1,clearcoatRoughness:.08,side:DoubleSide});
export const ceramic=new MeshStandardMaterial({color:COLORS.ivory,metalness:.02,roughness:.30});
export const cyanCore=new MeshStandardMaterial({color:'#2B9EB7',emissive:'#124457',emissiveIntensity:.25,metalness:.2,roughness:.15});
export const violetCore=new MeshStandardMaterial({color:'#8173D5',emissive:'#312554',emissiveIntensity:.15,metalness:.2,roughness:.18});

/** A local studio-light environment: actual PBR reflections, no downloaded HDRI. */
export const StudioReflection:React.FC=()=>{
  const {gl,scene}=useThree();
  const env=useMemo(()=>{
    const w=512,h=256;const a=new Uint8Array(w*h*4);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const u=x/w,v=y/h;const box=(cx:number,cy:number,sx:number,sy:number)=>Math.exp(-Math.pow((u-cx)/sx,8)-Math.pow((v-cy)/sy,8));
      const key=box(.22,.42,.08,.24)*.96;const strip=box(.71,.43,.018,.34)*.76;const roof=box(.48,.14,.28,.045)*.6;const violet=box(.89,.48,.032,.18)*.24;
      const base=.035+.04*Math.max(0,Math.cos((v-.5)*Math.PI));const j=(y*w+x)*4;
      a[j]=Math.min(255,255*(base+key+roof+strip*.77+violet*.55));a[j+1]=Math.min(255,255*(base+key*.98+roof+strip*.94+violet*.43));a[j+2]=Math.min(255,255*(base+key*.95+roof+strip+violet));a[j+3]=255;
    }
    const tex=new DataTexture(a,w,h,RGBAFormat,UnsignedByteType);tex.mapping=EquirectangularReflectionMapping;tex.colorSpace=SRGBColorSpace;tex.needsUpdate=true;
    const pm=new PMREMGenerator(gl);const result=pm.fromEquirectangular(tex);tex.dispose();pm.dispose();return result;
  },[gl]);
  useEffect(()=>{scene.environment=env.texture;scene.environmentIntensity=2.0;return()=>{scene.environment=null;env.dispose();};},[scene,env]);
  return <><ambientLight intensity={.45}/><directionalLight position={[-4,7,9]} intensity={3.1} color="#FFF9ED"/><directionalLight position={[5,1,2]} intensity={1.5} color="#B5EEF4"/><directionalLight position={[-4,0,-8]} intensity={.6} color="#A59BDA"/></>;
};

function rect(shape:Shape|Path,w:number,h:number,r:number){
  const x=-w/2,y=-h/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
}
const gateCache=new Map<string,ExtrudeGeometry>();
export const gateGeometry=(w:number,h:number,b=.13,depth=.23)=>{
  const key=[w,h,b,depth].join(':');if(gateCache.has(key))return gateCache.get(key)!;
  const s=new Shape();rect(s,w,h,.10);const hole=new Path();rect(hole,w-b*2,h-b*2,.055);s.holes.push(hole);
  const g=new ExtrudeGeometry(s,{depth,steps:1,curveSegments:10,bevelEnabled:true,bevelSegments:3,bevelSize:.025,bevelThickness:.026});g.translate(0,0,-depth/2);gateCache.set(key,g);return g;
};
export const Gate:React.FC<{position:[number,number,number];width?:number;height?:number;rotation?:[number,number,number];dark?:boolean;scale?:[number,number,number]}>=({position,width=5.6,height=6.4,rotation=[0,0,0],dark=false,scale=[1,1,1]})=><mesh position={position} rotation={rotation} scale={[scale[0]*width/5.6,scale[1]*height/6.4,scale[2]]} geometry={gateGeometry(5.6,6.4)} material={dark?darkMetal:metal}/>;

export const BeveledBar:React.FC<{position:[number,number,number];size:[number,number,number];material?:MeshPhysicalMaterial|MeshStandardMaterial;rotation?:[number,number,number]}>=({position,size,material=metal,rotation=[0,0,0]})=>{
  const geometry=useMemo(()=>new RoundedBoxGeometry(size[0],size[1],size[2],3,Math.min(...size)*.10),[size[0],size[1],size[2]]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh position={position} rotation={rotation} geometry={geometry} material={material}/>;
};

export const ExtrudedSpine:React.FC<{x:number;depth:number;shear:[number,number];material:MeshPhysicalMaterial|MeshStandardMaterial}>=({x,depth,shear,material})=>{
  const geometry=useMemo(()=>{
    const g=new RoundedBoxGeometry(.083,1.22,depth,3,.008);g.translate(0,0,-depth/2);
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++){const q=-p.getZ(i)/depth;p.setXY(i,p.getX(i)+shear[0]*q,p.getY(i)+shear[1]*q);}
    p.needsUpdate=true;g.computeVertexNormals();return g;
  },[depth,shear[0],shear[1]]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh position={[x,1.77,0]} geometry={geometry} material={material}/>;
};

export const SignalRoute:React.FC<{points:[number,number,number][];progress:number;violet?:boolean;radius?:number}>=({points,progress,violet=false,radius=.025})=>{
  const curve=useMemo(()=>new CatmullRomCurve3(points.map(p=>new Vector3(...p)),false,'centripetal'),[JSON.stringify(points)]);
  const tube=useMemo(()=>new TubeGeometry(curve,90,radius,8,false),[curve,radius]);
  const tip=curve.getPoint(Math.max(0,Math.min(1,progress)));
  useEffect(()=>()=>tube.dispose(),[tube]);
  return <group><mesh geometry={tube} material={violet?violetCore:cyanCore}/><mesh position={tip}><sphereGeometry args={[radius*2.3,12,12]}/><meshBasicMaterial color={violet?'#C4BAF9':'#E4FEFF'}/></mesh></group>;
};
