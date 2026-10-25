import React,{useMemo,useEffect} from 'react';
import {useLoader,useThree} from '@react-three/fiber';
import {staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {BufferGeometry,Float32BufferAttribute,Mesh,Color,Vector3,Matrix4,Euler,FogExp2,DataTexture,RGBAFormat,UnsignedByteType} from 'three';
import {silver,blue,violet,champagne,glass,OpticalLighting} from './Materials';
import {OpticalStage} from './Stage';
import {TypeSculpture} from './TypeSculpture';
import {ease,out,lerp,clamp} from './motion';

type Pose={c:Vector3;b:Vector3;n:Vector3;d:Vector3};
/** Three coherent paths share a clear reading aperture, with depth along the camera's travel. */
function path(u:number,k:number,t:number,offset=0):Pose{
 const sample=(v:number)=>{
  const a=k*Math.PI*2/3+.32*Math.sin(v*Math.PI*1.8)+t*.09;
  const aperture=.9*Math.exp(-Math.pow((v-.36)/.21,2));
  const r=2.4+.55*Math.cos(v*Math.PI*2)+aperture+offset;
  return new Vector3(Math.cos(a)*r+.22*Math.sin(v*8+k),Math.sin(a)*r*.86+.15*Math.sin(v*7+k),-1-30*v);
 };
 const c=sample(u),d=sample(u+.001).sub(sample(u-.001)).normalize();
 const a=k*Math.PI*2/3+.32*Math.sin(u*Math.PI*1.8)+t*.09;
 let b=new Vector3(Math.cos(a),Math.sin(a),0);b.addScaledVector(d,-b.dot(d)).normalize();
 const n=new Vector3().crossVectors(d,b).normalize();
 const twist=.38*Math.sin(u*Math.PI*3+k)+.13*t;
 b=b.multiplyScalar(Math.cos(twist)).addScaledVector(n,Math.sin(twist));
 return {c,b,n:new Vector3().crossVectors(d,b).normalize(),d};
}
function tangent(g:BufferGeometry,dirs:Float32Array){
 const n=g.attributes.normal,a=g.attributes.tangent;
 for(let i=0;i<n.count;i++){
  let x=dirs[i*3],y=dirs[i*3+1],z=dirs[i*3+2];const nx=n.getX(i),ny=n.getY(i),nz=n.getZ(i),dot=x*nx+y*ny+z*nz;x-=nx*dot;y-=ny*dot;z-=nz*dot;
  let length=Math.hypot(x,y,z);if(length<1e-7){x=Math.abs(nx)<.8?0:-nz;y=Math.abs(nx)<.8?nz:0;z=Math.abs(nx)<.8?-ny:nx;length=Math.hypot(x,y,z);}if(length<1e-7){x=1;y=0;z=0;length=1;}a.setXYZW(i,x/length,y/length,z/length,1);
 }a.needsUpdate=true;
}
function useMeshes(){
 const gltf=useLoader(GLTFLoader,staticFile('signal-correction/Optical-Convergence.glb'));
 return useMemo(()=>{gltf.scene.updateMatrixWorld(true);const m:Record<string,BufferGeometry>={};gltf.scene.traverse(o=>{if((o as Mesh).isMesh){const mesh=o as Mesh,key=mesh.name.match(/SIGNAL_(Prism|Petal_\d)/)?.[0];if(key)m[key]=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);}});return m;},[gltf]);
}
type Sector={g:BufferGeometry;inner:BufferGeometry;source:Float32Array;u:Float32Array;edge:Float32Array;height:Float32Array;dirs:Float32Array};
function prepareSector(source:BufferGeometry,k:number):Sector{
 const g=source.clone(),inner=source.clone(),p=source.attributes.position,count=p.count,u=new Float32Array(count),edge=new Float32Array(count),height=new Float32Array(count),start=-.25*Math.PI+k*Math.PI*2/3;
 for(let i=0;i<count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);let a=Math.atan2(-z,x);while(a<start-.03)a+=Math.PI*2;while(a>start+Math.PI*2)a-=Math.PI*2;u[i]=clamp((a-start)/(.62*Math.PI));edge[i]=Math.hypot(x,z)-(2.05+.2*Math.sin(u[i]*Math.PI));height[i]=y-.28*Math.sin(u[i]*Math.PI*2);}
 for(const geo of [g,inner])geo.setAttribute('tangent',new Float32BufferAttribute(new Float32Array(count*4),4));
 return {g,inner,source:new Float32Array(p.array),u,edge,height,dirs:new Float32Array(count*3)};
}
const profile=[[-.5,-.2],[-.45,-.5],[.45,-.5],[.5,-.2],[.5,.2],[.45,.5],[-.45,.5],[-.5,.2]];
function ribbonGeometry(){
 const steps=112,sides=profile.length,g=new BufferGeometry(),indices:number[]=[];
 g.setAttribute('position',new Float32BufferAttribute(new Float32Array((steps+1)*sides*3),3));g.setAttribute('tangent',new Float32BufferAttribute(new Float32Array((steps+1)*sides*4),4));
 for(let j=0;j<steps;j++)for(let c=0;c<sides;c++){const next=(c+1)%sides,a=j*sides+c,b=j*sides+next,d=(j+1)*sides+c,e=(j+1)*sides+next;indices.push(a,b,d,b,e,d);}
 for(let c=1;c<sides-1;c++){indices.push(0,c+1,c);const last=steps*sides;indices.push(last,last+c,last+c+1);}g.setIndex(indices);
 return {g,dirs:new Float32Array((steps+1)*sides*3),steps,sides};
}
const sparkPixels=new Uint8Array(64*64*4);
for(let y=0;y<64;y++)for(let x=0;x<64;x++){const r=Math.hypot((x-31.5)/31.5,(y-31.5)/31.5),i=(y*64+x)*4;sparkPixels[i]=210;sparkPixels[i+1]=239;sparkPixels[i+2]=255;sparkPixels[i+3]=255*Math.exp(-r*r*7)*Math.max(0,1-r);}
const sparkMap=new DataTexture(sparkPixels,64,64,RGBAFormat,UnsignedByteType);sparkMap.needsUpdate=true;

export const OpticalWorld:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps,{camera,scene}=useThree(),meshes=useMeshes();
 const sectors=useMemo(()=>[0,1,2].map(k=>prepareSector(meshes[`SIGNAL_Petal_${k}`],k)),[meshes]);
 const ribbons=useMemo(()=>Array.from({length:6},()=>ribbonGeometry()),[]);
 useEffect(()=>()=>{sectors.forEach(s=>{s.g.dispose();s.inner.dispose();});ribbons.forEach(s=>s.g.dispose());},[sectors,ribbons]);
 useEffect(()=>{scene.fog=new FogExp2('#06111e',.019);return()=>{scene.fog=null;};},[scene]);
 scene.background=new Color('#050b13');
 const birth=out(t,.1,.68),unfold=ease(t,1.76,2.52)*(1-ease(t,4.30,4.94)),final=ease(t,4.30,4.94);
 const travel=12*ease(t,1.82,2.7)+7*ease(t,4.35,5.08),push=.6*ease(t,5.1,7);
 const whip=.7*Math.sin(Math.PI*ease(t,1.76,2.7))-.6*Math.sin(Math.PI*ease(t,4.3,5.1));
 const camZ=lerp(17,13,out(t,0,.88))-travel-push;
 camera.position.set(2.3*(1-out(t,0,.88))+.18*Math.sin(t*.9)+whip+.45*ease(t,5.05,7),.55+.15*Math.sin(t*.7),camZ);
 camera.lookAt(.06*Math.sin(t),-.05,camZ-14);camera.rotateZ(.06*Math.sin(Math.PI*ease(t,1.76,2.7))-.045*Math.sin(Math.PI*ease(t,4.3,5.1)));
 const matrix=new Matrix4().makeRotationFromEuler(new Euler(lerp(1.05,1.22,final),.22+t*.14,lerp(-.3,.52,final)));
 const bodyScale=(.1+.9*birth)*lerp(1.12,1.06,final),bodyZ=lerp(-.65,-20,final),elements=matrix.elements;
 sectors.forEach((s,k)=>{
  const p=s.g.attributes.position,ip=s.inner.attributes.position;
  for(let i=0;i<p.count;i++){
   const u=s.u[i],x=s.source[i*3],y=s.source[i*3+1],z=s.source[i*3+2],r=Math.hypot(x,z),a=Math.atan2(-z,x),pose=path(u,k,t);
   const sx=(elements[0]*x+elements[4]*y+elements[8]*z)*bodyScale,sy=(elements[1]*x+elements[5]*y+elements[9]*z)*bodyScale,sz=(elements[2]*x+elements[6]*y+elements[10]*z)*bodyScale+bodyZ;
   const tx=pose.c.x+pose.b.x*s.edge[i]-pose.n.x*s.height[i],ty=pose.c.y+pose.b.y*s.edge[i]-pose.n.y*s.height[i],tz=pose.c.z+pose.b.z*s.edge[i]-pose.n.z*s.height[i];
   p.setXYZ(i,lerp(sx,tx,unfold),lerp(sy,ty,unfold),lerp(sz,tz,unfold));
   const ix=Math.cos(a)*(r-.65+s.edge[i]*-.4),iy=y-s.height[i]*.2,iz=-Math.sin(a)*(r-.65+s.edge[i]*-.4);
   const gx=(elements[0]*ix+elements[4]*iy+elements[8]*iz)*bodyScale,gy=(elements[1]*ix+elements[5]*iy+elements[9]*iz)*bodyScale,gz=(elements[2]*ix+elements[6]*iy+elements[10]*iz)*bodyScale+bodyZ;
   ip.setXYZ(i,lerp(gx,pose.c.x+pose.b.x*(s.edge[i]*.6-.65)-pose.n.x*s.height[i]*.8,unfold),lerp(gy,pose.c.y+pose.b.y*(s.edge[i]*.6-.65)-pose.n.y*s.height[i]*.8,unfold),lerp(gz,pose.c.z+pose.b.z*(s.edge[i]*.6-.65)-pose.n.z*s.height[i]*.8,unfold));
   const ax=-Math.sin(a),az=-Math.cos(a);s.dirs[i*3]=lerp(elements[0]*ax+elements[8]*az,pose.d.x,unfold);s.dirs[i*3+1]=lerp(elements[1]*ax+elements[9]*az,pose.d.y,unfold);s.dirs[i*3+2]=lerp(elements[2]*ax+elements[10]*az,pose.d.z,unfold);
  }
  p.needsUpdate=true;ip.needsUpdate=true;s.g.computeVertexNormals();s.inner.computeVertexNormals();tangent(s.g,s.dirs);tangent(s.inner,s.dirs);
 });
 ribbons.forEach((s,j)=>{
  const k=Math.floor(j/2),layer=j%2,p=s.g.attributes.position;
  for(let q=0;q<=s.steps;q++){
   const u=q/s.steps,pose=path(u,k,t,(layer+1)*.21),width=(.16+layer*.045)*Math.sin(Math.PI*(.03+.94*u));
   for(let c=0;c<s.sides;c++){const i=q*s.sides+c,side=profile[c][0]*width,depth=profile[c][1]*.028;const endZ=-20+(pose.c.z+20)*unfold;
    p.setXYZ(i,(pose.c.x+pose.b.x*side+pose.n.x*depth)*unfold,(pose.c.y+pose.b.y*side+pose.n.y*depth)*unfold,endZ+pose.b.z*side+pose.n.z*depth);
    s.dirs[i*3]=pose.d.x;s.dirs[i*3+1]=pose.d.y;s.dirs[i*3+2]=pose.d.z;
   }
  }p.needsUpdate=true;s.g.computeVertexNormals();tangent(s.g,s.dirs);
 });
 const coreProgress=ease(t,1.76,2.6),coreZ=lerp(-.7,-20,coreProgress);
 const coreScale=(.02+.98*out(t,.1,.6))*(1-.53*coreProgress*(1-final));
 const beamFade=(1-ease(t,1.45,1.85));
 return <>
  <OpticalLighting cameraZ={camZ}/><OpticalStage/>
  <pointLight position={[-3,2,-10]} intensity={12} distance={12} color="#80c7ff"/><pointLight position={[3,1,-23]} intensity={16} distance={15} color="#efc3a2"/>
  {sectors.map((s,k)=><group key={k}><mesh frustumCulled={false} geometry={s.g} material={k===0?silver:k===1?violet:blue}/><mesh frustumCulled={false} geometry={s.inner} material={glass}/></group>)}
  {unfold>.001?ribbons.map((s,j)=><mesh frustumCulled={false} key={j} geometry={s.g} material={j===3?champagne:j%2?blue:silver}/>):null}
  <mesh geometry={meshes.SIGNAL_Prism} material={glass} position={[0,.05,coreZ]} rotation={[-.28,.55+t*.18,-.42]} scale={[coreScale*.88,coreScale*.88,coreScale*.6]}/>
  {t<1.85?<group position={[0,0,-.7]}>
   <mesh><cylinderGeometry args={[.004,.004,9,8]}/><meshBasicMaterial color="#e4f6ff" transparent opacity={beamFade} toneMapped={false}/></mesh>
   <sprite scale={[.55,.55,1]}><spriteMaterial map={sparkMap} transparent opacity={(1-ease(t,.22,.65))*.9} depthWrite={false} toneMapped={false}/></sprite>
  </group>:null}
  <TypeSculpture text="ONE" size={1.16} t={t} enter={.4} exit={1.76} position={[-.08,.75,1.35]}/>
  <TypeSculpture text="IDEA." size={1.65} t={t} enter={.8} exit={1.86} position={[0,-1.04,1.45]}/>
  <TypeSculpture text="MANY AI" size={1.18} t={t} enter={2.2} exit={4.24} position={[-.04,.65,-10.45]} angle={-.065}/>
  <TypeSculpture text="MODELS." size={1.27} t={t} enter={2.6} exit={4.28} position={[.02,-.96,-10.25]} angle={-.065}/>
  <TypeSculpture text="ONE" size={.9} t={t} enter={4.6} exit={7} position={[0,.35,-17.65]} angle={.025}/>
  <TypeSculpture text="WORKSPACE." size={.94} t={t} enter={4.72} exit={7} position={[0,-.72,-17.5]} angle={.025}/>
 </>;
};
