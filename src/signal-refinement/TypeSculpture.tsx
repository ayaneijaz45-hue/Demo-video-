import React,{useMemo} from 'react';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import outline from './display-font.json';
import {typeFace,typeEdge} from './Materials';
import {ease,lerp,out} from './motion';
const font=new FontLoader().parse(outline);
type Glyph={g:TextGeometry;x:number};const cache=new Map<string,Glyph[]>();
function typeset(text:string,size:number,maxWidth:number){
 const key=text+size+':'+maxWidth;if(cache.has(key))return cache.get(key)!;let x=0;const result:Glyph[]=[];
 for(const c of text){
  if(c!==' '){const g=new TextGeometry(c,{font,size,depth:.28,curveSegments:16,bevelEnabled:true,bevelSize:.028,bevelThickness:.028,bevelSegments:4});const p=g.attributes.position,uv=g.attributes.uv;for(let n=0;n<p.count;n++)uv.setXY(n,p.getX(n)/size*1.8,p.getY(n)/size*1.8);uv.needsUpdate=true;result.push({g,x});}
  x+=(font.data.glyphs[c]?.ha??250)*size/1000+.004;
 }
 const fit=Math.min(1,maxWidth/x);for(const o of result){o.x=(o.x-x/2)*fit;o.g.scale(fit,fit,fit);}cache.set(key,result);return result;
}
/** Glyph depth grows into optical laminae as the camera enters the shared path. */
export const TypeSculpture:React.FC<{text:string;size:number;t:number;enter:number;exit:number;position:[number,number,number];angle?:number;maxWidth?:number}>=({text,size,t,enter,exit,position,angle=0,maxWidth=3.72})=>{
 const glyphs=useMemo(()=>typeset(text,size,maxWidth),[text,size,maxWidth]);const leave=ease(t,exit,exit+.27);
 if(t<enter-.1||t>exit+.3)return null;
 return <group position={position} rotation={[-.025,.055,angle]}>{glyphs.map(({g,x},i)=>{
  const p=out(t,enter+i*.009,enter+.24+i*.009),side=i%2===0?1:-1;
  return <mesh key={i} geometry={g} material={[typeFace,typeEdge]}
   position={[x+side*(1-p)*.25,lerp(-.25,0,p)+leave*.15,lerp(-3,0,p)-leave*(5+i*.16)]}
   rotation={[lerp(.28,0,p),lerp(side*1.3,0,p)+leave*side*1.43,leave*side*.06]}
   scale={[Math.max(.035,1-leave*.965),1,(1+(1-p)*4)+leave*16]}/>;
 })}</group>;
};
