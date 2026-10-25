import React,{useMemo,useEffect} from 'react';
import {useLoader,useThree} from '@react-three/fiber';
import {staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {BufferGeometry,Float32BufferAttribute,Mesh,Color,Vector3,MeshBasicMaterial,DoubleSide} from 'three';
import {OpticalLighting,opticalGlass,titanium,violetMetal,cyanMetal} from './Materials';
import {TypeSculpture} from './TypeSculpture';
import {ease,lerp,out} from './motion';

const spectral=['#86eaff','#9abfff','#ae9dff','#c6a9e8','#e6cacb'];
const beamMaterial=new MeshBasicMaterial({color:'#e5faff',toneMapped:false});
const beamGeometry=new BufferGeometry().setFromPoints([new Vector3(-9,0,0),new Vector3(0,0,0)]);
function fanGeometry(){
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute([0,0,0,8,.12,0,8,1.3,0],3));g.computeVertexNormals();return g;
}
const fan=fanGeometry();

const Beam:React.FC<{t:number}>=({t})=>{
 const p=out(t,0,.35),spread=ease(t,.3,.85),fade=1-ease(t,1.75,2.16);
 return <group position={[-.2,-.65,.1]} rotation={[0,0,-.14]} scale={[p,1,1]}>
  <mesh position={[-4.5,0,0]}><boxGeometry args={[9,.009,.014]}/><meshBasicMaterial color="#e7faff" transparent opacity={fade} toneMapped={false}/></mesh>
  {spectral.map((c,i)=><mesh key={c} geometry={fan} position={[0,-.015*i,-.35-i*.01]} rotation={[0,0,(i-2)*.017*spread]} scale={[1,.32+spread*.38,1]}>
    <meshBasicMaterial color={c} transparent opacity={.035*fade} side={DoubleSide} depthWrite={false} toneMapped={false}/>
  </mesh>)}
  {spectral.map((c,i)=><mesh key={i} position={[4,lerp(.0,.17*(i-2),spread),-.32]} rotation={[0,0,lerp(0,.045*(i-2),spread)]}><boxGeometry args={[8,.007,.008]}/><meshBasicMaterial color={c} transparent opacity={fade*.65} toneMapped={false}/></mesh>)}
 </group>;
};

function useOpticalMeshes(){
 const gltf=useLoader(GLTFLoader,staticFile('signal-correction/Optical-Convergence.glb')+'?revision=57fexqsna8');
 return useMemo(()=>{
  gltf.scene.updateMatrixWorld(true);const found:Record<string,BufferGeometry>={};
  gltf.scene.traverse(o=>{if((o as Mesh).isMesh){const m=o as Mesh;const key=m.name.match(/SIGNAL_(Prism|Petal_\d)/)?.[0];if(key)found[key]=m.geometry.clone().applyMatrix4(m.matrixWorld);}});
  return found;
 },[gltf]);
}

export const OpticalWorld:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const {camera,scene}=useThree();const meshes=useOpticalMeshes();
 const petals=useMemo(()=>[0,1,2].map(i=>{const source=meshes[`SIGNAL_Petal_${i}`],g=source.clone();g.setAttribute('tangent',new Float32BufferAttribute(new Float32Array(source.attributes.position.count*4),4));return {g,source:new Float32Array(source.attributes.position.array)};}),[meshes]);
 useEffect(()=>()=>petals.forEach(p=>p.g.dispose()),[petals]);
 const many=ease(t,2.08,2.38),unify=ease(t,4.34,4.85),reveal=out(t,0,.8);
 const bg=new Color('#101923').lerp(new Color('#dce5e4'),many*(1-unify));
 scene.background=bg;
 const whip=Math.sin(Math.PI*ease(t,1.98,2.4))*.8-Math.sin(Math.PI*ease(t,4.34,4.88))*.65;
 camera.position.set(1.9*(1-reveal)+whip,.12*Math.cos(t*.65),17.8-1.1*ease(t,5.2,7));camera.lookAt(0,0,0);
 const unfold=out(t,2.14,2.95)*(1-unify);
 petals.forEach(({g,source},k)=>{
  const p=g.attributes.position,start=-.25*Math.PI+k*Math.PI*2/3;
  for(let n=0;n<p.count;n++){
   const x=source[n*3],y=source[n*3+1],z=source[n*3+2];let a=Math.atan2(-z,x);while(a<start-.03)a+=Math.PI*2;while(a>start+Math.PI*2)a-=Math.PI*2;
   const u=Math.max(0,Math.min(1,(a-start)/(.62*Math.PI))),r=Math.hypot(x,z),edge=r-(2.05+.2*Math.sin(u*Math.PI));
   const tx=(u-.5)*4.4,ty=Math.sin(u*Math.PI*2+k*.85)*.7+edge*1.1,tz=Math.cos(u*Math.PI*2+k*.85)*.7+y;
   p.setXYZ(n,lerp(x,tx,unfold),lerp(y,ty,unfold),lerp(z,tz,unfold));
  }
  p.needsUpdate=true;g.computeVertexNormals();
  // Authored along-surface tangents keep anisotropic reflections valid without UV maps.
  // They deform with the ribbon, then project into each updated normal plane.
  const normals=g.attributes.normal,tangents=g.attributes.tangent;
  for(let n=0;n<p.count;n++){
   const x=source[n*3],z=source[n*3+2];let a=Math.atan2(-z,x);while(a<start-.03)a+=Math.PI*2;while(a>start+Math.PI*2)a-=Math.PI*2;
   const u=Math.max(0,Math.min(1,(a-start)/(.62*Math.PI))),phase=u*Math.PI*2+k*.85;
   let tx=lerp(-Math.sin(a)*4.2,4.4,unfold),ty=lerp(.28*Math.PI*2*Math.cos(u*Math.PI*2),.7*Math.PI*2*Math.cos(phase),unfold),tz=lerp(-Math.cos(a)*4.2,-.7*Math.PI*2*Math.sin(phase),unfold);
   const nx=normals.getX(n),ny=normals.getY(n),nz=normals.getZ(n),dot=tx*nx+ty*ny+tz*nz;
   tx-=nx*dot;ty-=ny*dot;tz-=nz*dot;
   let length=Math.hypot(tx,ty,tz);
   if(length<1e-7){if(Math.abs(nx)<.8){tx=0;ty=nz;tz=-ny;}else{tx=-nz;ty=0;tz=nx;}length=Math.hypot(tx,ty,tz);}
   if(length<1e-7){tx=1;ty=0;tz=0;length=1;}
   tangents.setXYZW(n,tx/length,ty/length,tz/length,1);
  }
  tangents.needsUpdate=true;
 });
 const heroY=lerp(-.8,1.25,unify),heroScale=lerp(1.8,1,reveal)*(1-.64*many*(1-unify));
 const pose=lerp(lerp(lerp(-.95,.12,reveal)+.12*t,-.2+.12*t,many),-.4+.1*(t-4.6),unify);
 return <>
  <OpticalLighting/>
  <group position={[0,heroY,0]} rotation={[.06+many*.15,pose,-.14+.15*unify]} scale={heroScale}>
   <mesh geometry={meshes.SIGNAL_Prism} material={opticalGlass}/>
  </group>
  {t<2.22?<Beam t={t}/>:null}
  <group position={[0,lerp(lerp(-1.6,-.1,many),1.1,unify),-.3]} rotation={[lerp(.95,.1,many)+unify*.8,lerp(.12,-.2,many),.12+t*.06]} scale={1-.12*many*(1-unify)}>
   {[0,1,2].map(i=>{
    const separate=out(t,2.14+i*.035,2.85+i*.035)*(1-unify);
    const birth=out(t,.12,1.25);
    const a=i*Math.PI*2/3;
    return <group key={i} position={[Math.cos(a)*separate*.9,Math.sin(a)*separate*1.3,lerp(-2,0,birth)+separate*(i-1)*.6]}
      rotation={[separate*(i-1)*.65,Math.sin(a)*separate*.45,(i-1)*separate*.22+unify*.15]}
      scale={lerp(.25,1,birth)*(1+separate*.06)}>
      <mesh geometry={petals[i].g} material={i===1?violetMetal:i===2?cyanMetal:titanium}/>
    </group>;
   })}
  </group>
  <TypeSculpture text="ONE" size={.76} t={t} enter={.4} exit={1.98} position={[-1.4,3.2,1]} angle={-.025}/>
  <TypeSculpture text="IDEA." size={1.8} t={t} enter={.8} exit={1.98} position={[0,1.16,1.2]} angle={-.025}/>
  <TypeSculpture text="MANY" size={1.2} t={t} enter={2.2} exit={4.36} position={[-.8,2.75,1.5]} dark angle={-.07}/>
  <TypeSculpture text="AI" size={1.2} t={t} enter={2.6} exit={4.36} position={[-1.4,1.0,1.5]} dark angle={-.07}/>
  <TypeSculpture text="MODELS." size={1.08} t={t} enter={2.85} exit={4.36} position={[0,-2.6,1.6]} dark angle={-.07}/>
  <TypeSculpture text="ONE" size={.78} t={t} enter={4.6} exit={7} position={[0,-1.75,1.7]}/>
  <TypeSculpture text="WORKSPACE." size={.96} t={t} enter={4.72} exit={7} position={[0,-2.95,1.7]}/>
 </>;
};
