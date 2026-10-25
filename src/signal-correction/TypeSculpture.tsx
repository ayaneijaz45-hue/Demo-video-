import React,{useMemo} from 'react';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import outline from './display-font.json';
import {darkFace,silverFace,typeEdge} from './Materials';
import {ease,lerp,out} from './motion';
const font=new FontLoader().parse(outline);
const cache=new Map<string,{g:TextGeometry;x:number}[]>();
function typeset(text:string,size:number){
 const key=text+size;if(cache.has(key))return cache.get(key)!;
 let x=0;const glyphs:{g:TextGeometry;x:number}[]=[];
 for(const char of text){
  if(char!==' '){const g=new TextGeometry(char,{font,size,depth:.16,curveSegments:16,bevelEnabled:true,bevelSize:.009,bevelThickness:.014,bevelSegments:4});const uv=g.attributes.uv,pos=g.attributes.position;for(let n=0;n<pos.count;n++)uv.setXY(n,pos.getX(n)/size,pos.getY(n)/(size*.972));uv.needsUpdate=true;glyphs.push({g,x});}
  x+=(font.data.glyphs[char]?.ha??250)*size/1000-.018;
 }
 const fit=Math.min(1,4.6/x);
 for(const item of glyphs){item.x=(item.x-x/2)*fit;item.g.scale(fit,fit,fit);}
 cache.set(key,glyphs);return glyphs;
}
export const TypeSculpture:React.FC<{text:string;size:number;t:number;enter:number;exit:number;position:[number,number,number];dark?:boolean;angle?:number}>=({text,size,t,enter,exit,position,dark=false,angle=0})=>{
 const glyphs=useMemo(()=>typeset(text,size),[text,size]);
 const leave=ease(t,exit,exit+.25);
 if(t<enter-.25||t>exit+.3)return null;
 return <group position={position} rotation={[0,0,angle+leave*.35]}>{glyphs.map(({g,x},i)=>{
  const p=out(t,enter+i*.012,enter+.3+i*.012);
  return <mesh key={i} geometry={g} material={[dark?darkFace:silverFace,typeEdge]}
    position={[x+lerp((i-glyphs.length/2)*.32,0,p)+leave*(i-glyphs.length/2)*.45,lerp(-.7,0,p)-leave*1.3,lerp(-1.8,0,p)+leave*1.2]}
    rotation={[lerp(-1.3,0,p),lerp(.45,0,p)+leave*.6,0]} scale={[1,1,lerp(4,1,p)]}/>;
 })}</group>;
};
