import {useCurrentFrame,useVideoConfig} from 'remotion';
import {anim,Bar,C,Headline,Panel,Stage,Tag} from '../design';

export const Hook=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const converge=anim(f,2.7*fps,4.75*fps);
 return <Stage chapter="01" label="A BETTER WAY TO CREATE">
  <Headline lines={['Too many','AI tools?']} size={116}/>
  <div style={{position:'absolute',left:76,top:590,fontSize:30,color:C.muted,opacity:anim(f,20,42)}}>Your ideas deserve one place.</div>
  <div style={{position:'absolute',left:540,top:1090,perspective:1400}}>
   {[['CHAT',-235,-145,-12],['IMAGES',230,-30,10],['VIDEO',-170,230,-7],['VOICE',225,330,12]].map(([name,x,y,r],i)=><Panel key={name} style={{position:'absolute',width:500,height:245,left:-250,top:-125,opacity:1-converge*.95,transform:`translate(${Number(x)*(1-converge)}px,${Number(y)*(1-converge)+Math.sin(f/22+i)*8}px) rotate(${Number(r)*(1-converge)}deg) scale(${1-converge*.7})`,filter:`blur(${converge*3}px)`}}>
    <Bar title={String(name)}/><div style={{padding:28,display:'flex',gap:12}}>{[0,1,2].map(j=><div key={j} style={{height:16,width:70+j*28,borderRadius:30,background:j===0?C.cyan:'#516479',opacity:.65}}/>)}</div>
    <div style={{marginLeft:28,width:310,height:14,background:'#51647966',borderRadius:20}}/>
   </Panel>)}
   <div style={{position:'absolute',left:-70,top:10,width:140,height:140,borderRadius:40,background:`linear-gradient(135deg,${C.cyan},${C.violet})`,rotate:`${anim(f,85,149,-45,0)}deg`,scale:anim(f,85,146,.05,1),boxShadow:'0 0 90px #7EE7FF44'}}/>
  </div>
  <Tag style={{position:'absolute',left:72,top:1490,opacity:anim(f,35,55)}}>01 idea. Too many tabs.</Tag>
 </Stage>;
};
