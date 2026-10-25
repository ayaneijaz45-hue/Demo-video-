import React, {useMemo} from 'react';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {Box3, MeshBasicMaterial, MeshStandardMaterial} from 'three';
import outline from './display-font.json';
import {clamp, COLORS, ease, mix} from './motion';

const font=new FontLoader().parse(outline);
const frontLight=new MeshBasicMaterial({color:COLORS.ivory,toneMapped:false,depthTest:false,depthWrite:false,transparent:true});
const frontDark=new MeshBasicMaterial({color:COLORS.black,toneMapped:false,depthTest:false,depthWrite:false,transparent:true});
const bevel=new MeshStandardMaterial({color:'#A5B6C5',metalness:.94,roughness:.19,depthTest:false,depthWrite:false,transparent:true});

type Glyph = {character:string; x:number; width:number; geometry:TextGeometry; svg:string; origin:number};
const cache=new Map<string,{glyphs:Glyph[];width:number;height:number}>();
function typeset(text:string,cap:number,tracking:number){
  const key=`${text}-${cap}-${tracking}`;const old=cache.get(key);if(old)return old;
  const test=new TextGeometry('E',{font,size:1,depth:.06,curveSegments:10});test.computeBoundingBox();
  const size=cap/(test.boundingBox!.max.y-test.boundingBox!.min.y);test.dispose();
  let x=0;const glyphs:Glyph[]=[];
  for(const character of text){
    const advance=(font.data.glyphs[character]?.ha??font.data.glyphs[' '].ha)*size/font.data.resolution;
    if(character!==' '){
      const geometry=new TextGeometry(character,{font,size,depth:.065,curveSegments:14,bevelEnabled:true,bevelSegments:3,bevelThickness:.012,bevelSize:.010});
      geometry.computeBoundingBox();const box=geometry.boundingBox as Box3;
      const origin=-box.min.x;geometry.translate(origin,0,0);glyphs.push({character,x,width:box.max.x-box.min.x,geometry,svg:glyphSVG(font.data.glyphs[character].o??''),origin});
    }
    x+=advance+tracking;
  }
  const result={glyphs,width:x-tracking,height:cap};cache.set(key,result);return result;
}

export type KineticWordProps = {
  text:string;capHeight:number;position:[number,number,number];
  time:number;arrival:number;duration?:number;tone?:'light'|'dark';
  tracking?:number;fold?:number;skipFirst?:boolean;formation?:'seat'|'rail';
};
/** Font-outline solids turn from their narrow physical edges into complete words. */
export const KineticWord:React.FC<KineticWordProps>=({text,capHeight,position,time,arrival,duration=.24,tone='light',tracking=-.016,fold=0,skipFirst=false,formation='seat'})=>{
  const data=useMemo(()=>typeset(text,capHeight,tracking),[text,capHeight,tracking]);
  const reading=(time>=.8&&time<=1.6)||(time>=3&&time<=3.8)||time>=5.2;
  if(reading)return null;
  return <group position={position}>{data.glyphs.map((g,i)=>{
    if(skipFirst&&i===0)return null;
    const stagger=Math.min(i*.012,.055);const p=ease(time,arrival+stagger,arrival+duration+stagger);
    if(p<=0&&time<arrival-.15)return null;
    const lateral=formation==='rail'?mix(-.18,0,p):mix(.07,0,p);
    const depart=clamp(fold);
    // Keep D/E/A and the first line clear of the camera entering the I seam.
    const exitX=(text==='ONE'||text==='IDEA.')?g.x+3.5:g.x*.16;
    return <mesh key={`${text}-${i}`} renderOrder={1000} geometry={g.geometry} material={[tone==='light'?frontLight:frontDark,bevel]}
      position={[mix(g.x,exitX,depart)+lateral,mix(formation==='rail'?-capHeight*.62:.16,0,p)+depart*(i%2===0?.11:-.09),mix(-.9,0,p)-depart*(.4+g.x)]}
      rotation={[mix(formation==='rail'?.22:-.08,0,p),mix(-Math.PI/2+.04,0,p)+depart*.85,0]}
      scale={[1,1,mix(3.8,1,p)]}/>
  })}</group>;
};

export const typeWidth=(text:string,cap:number)=>typeset(text,cap,-.016).width;

function glyphSVG(outline:string){
  const tokens=outline.trim().split(/\s+/);let i=0,d='';
  while(i<tokens.length){
    const op=tokens[i++];const n=()=>Number(tokens[i++]);
    if(op==='m')d+=`M${n()} ${n()} `;
    else if(op==='l')d+=`L${n()} ${n()} `;
    else if(op==='q'){const x=n(),y=n(),cx=n(),cy=n();d+=`Q${cx} ${cy} ${x} ${y} `;}
    else if(op==='b'){const x=n(),y=n(),a=n(),b=n(),c=n(),e=n();d+=`C${a} ${b} ${c} ${e} ${x} ${y} `;}
  }
  return d;
}

/** Exact outline faces are composited above the 3D bevel during the reading hold. */
export const SharpWordFace:React.FC<{text:string;capHeight:number;x:number;y:number;tone?:'light'|'dark'}>=({text,capHeight,x,y,tone='light'})=>{
  const data=typeset(text,capHeight,-.016);const scale=capHeight/.972;const projection=19.03/(19.03-.077);
  return <g transform={`translate(540 960) scale(${160*projection} ${-160*projection}) translate(${x} ${y})`} fill={tone==='light'?COLORS.ivory:COLORS.black}>
    {data.glyphs.map((g,i)=><path key={i} d={g.svg} transform={`translate(${g.x+g.origin} 0) scale(${scale/1000})`}/>)}
  </g>;
};
