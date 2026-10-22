import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family:'Manrope',url:staticFile('fonts/manrope-latin-wght-normal.woff2'),weight:'200 800'});
loadFont({family:'NotoArabic',url:staticFile('fonts/noto-sans-arabic-arabic-wght-normal.woff2'),weight:'100 900'});
export const C={bg:'#05070A',white:'#F5F8FB',cyan:'#7EE7FF',violet:'#8FA7FF',light:'#EAF7FC',ink:'#102A36',accent:'#087EA4',muted:'#90A9B8'};
export const ease=Easing.bezier(.16,1,.3,1);
export const anim=(f:number,a:number,b:number,x=0,y=1)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
export const sans='Manrope, sans-serif';

export const Stage=({children,light=false,chapter,label}:{children:ReactNode;light?:boolean;chapter:string;label:string})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:light?C.light:C.bg,color:light?C.ink:C.white,fontFamily:sans,overflow:'hidden'}}>
  <AbsoluteFill style={{background:light?'radial-gradient(ellipse at 85% 25%, #fff 0%, transparent 55%)':'radial-gradient(ellipse at 80% 52%, #102336 0%, transparent 60%)'}}/>
  <div style={{position:'absolute',left:72,right:86,top:116,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:22,fontWeight:650,letterSpacing:3,color:light?C.accent:C.cyan}}>
   <span>MODELS SUITE</span><span>{chapter} / 08</span>
  </div>
  <div style={{position:'absolute',top:179,left:72,right:86,height:1,background:light?'#087EA429':'#7EE7FF26'}}/>
  <AbsoluteFill style={{clipPath:`inset(0 ${(1-anim(f,0,.55*fps))*100}% 0 0)`}}>{children}</AbsoluteFill>
  <div style={{position:'absolute',left:72,bottom:224,fontSize:20,fontWeight:600,letterSpacing:4,color:light?'#4E6D7B':'#8296A6'}}>{label}</div>
 </AbsoluteFill>;
};

export const Headline=({lines,light=false,top=260,size=98,delay=0}:{lines:string[];light?:boolean;top?:number;size?:number;delay?:number})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:72,right:86,top,fontWeight:650,fontSize:size,lineHeight:1.08,letterSpacing:-5}}>
  {lines.map((line,i)=><div key={line} style={{overflow:'hidden',paddingBottom:8}}><div style={{translate:`0 ${anim(f,delay+i*4,delay+i*4+.7*fps,110,0)}%`,opacity:anim(f,delay+i*4,delay+i*4+.5*fps),color:i===lines.length-1?(light?C.accent:C.cyan):undefined}}>{line}</div></div>)}
 </div>;
};

export const Logo=({size=110,style={}}:{size?:number;style?:CSSProperties})=><CanvasImage src={staticFile('brand/models-suite-logo.png')} style={{width:size,height:size,objectFit:'contain',...style}}/>;
export const Tag=({children,light=false,style={}}:{children:ReactNode;light?:boolean;style?:CSSProperties})=><div style={{display:'inline-flex',alignItems:'center',gap:12,padding:'13px 20px',border:`1px solid ${light?'#087EA433':'#7EE7FF40'}`,borderRadius:100,fontSize:26,fontWeight:650,letterSpacing:.3,color:light?C.accent:C.cyan,background:light?'#FFFFFF99':'#0F2335AA',...style}}>{children}</div>;
export const Panel=({children,light=false,style={}}:{children:ReactNode;light?:boolean;style?:CSSProperties})=><div style={{background:light?'#FFFFFFF5':'linear-gradient(145deg,#152A3DF5,#0A121DFB)',border:`1px solid ${light?'#AAC6D8':'#70889C55'}`,borderRadius:32,boxShadow:light?'0 42px 100px #25527320, inset 0 1px white':'0 40px 100px #0009, inset 0 1px #FFFFFF30',overflow:'hidden',...style}}>{children}</div>;
export const Bar=({title,light=false}:{title:string;light?:boolean})=><div style={{height:83,padding:'0 30px',borderBottom:`1px solid ${light?'#DAE8F0':'#52677A44'}`,display:'flex',alignItems:'center',gap:14,color:light?C.ink:C.white,fontSize:30,fontWeight:650}}><Logo size={32}/><span>{title}</span><span style={{marginLeft:'auto',fontSize:22,opacity:.6}}>— &nbsp; ◇</span></div>;
export const SampleNote=({light=false,top=1535,text='Illustrative interface · example content'}:{light?:boolean;top?:number;text?:string})=><div style={{position:'absolute',top,left:72,right:86,fontSize:26,lineHeight:1.5,color:light?'#4E6D7B':'#9EB2C3'}}>{text}</div>;
export const Arrow=()=> <span style={{fontSize:36,lineHeight:1}}>↗</span>;

export const Orbit=({size=700,light=false,style={}}:{size?:number;light?:boolean;style?:CSSProperties})=>{
 const f=useCurrentFrame();
 return <div style={{position:'absolute',width:size,height:size,...style}}>
  {[0,1,2].map(i=><div key={i} style={{position:'absolute',inset:i*42,border:`1px solid ${light?'#087EA433':'#7EE7FF30'}`,borderRadius:'50%',transform:`perspective(1000px) rotateX(${58+i*6}deg) rotateZ(${i*55+f*.17}deg)`}}/>)}
  <div style={{position:'absolute',inset:size*.2,borderRadius:'50%',background:light?'radial-gradient(circle,#7EE7FF66,transparent 70%)':'radial-gradient(circle,#7EE7FF22,transparent 70%)'}}/>
 </div>;
};
