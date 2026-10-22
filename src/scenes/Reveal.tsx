import {useCurrentFrame,useVideoConfig} from 'remotion';
import {anim,Arrow,Bar,C,Headline,Logo,Orbit,Panel,Stage,Tag} from '../design';

export const Reveal=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <Stage light chapter="02" label="ONE CONNECTED AI WORKSPACE">
  <Headline light lines={['Meet','Models Suite.']} size={108}/>
  <Orbit size={960} light style={{left:60,top:560}}/>
  <Logo size={360} style={{position:'absolute',left:360,top:680,scale:anim(f,0,1.6*fps,.25,1),translate:`0 ${anim(f,0,2*fps,140,0)}px`,filter:'drop-shadow(0 30px 22px #087EA42A)'}}/>
  <div style={{position:'absolute',left:95,top:1110,width:850,perspective:1600,transform:`translateY(${anim(f,30,95,240,0)}px) rotateX(${anim(f,30,110,30,5)}deg) rotateY(${anim(f,30,125,-12,0)}deg)`,opacity:anim(f,25,55)}}>
   <Panel light><Bar light title="Models Suite"/><div style={{padding:'42px 38px 38px'}}><div style={{fontSize:44,fontWeight:650,letterSpacing:-1}}>What will you create today?</div><div style={{display:'flex',gap:14,marginTop:28}}>{['Chat','Images','Video','Voice'].map(t=><Tag light key={t}>{t}</Tag>)}</div><div style={{marginTop:32,background:C.light,borderRadius:20,padding:25,fontSize:26,display:'flex',justifyContent:'space-between'}}><span>Ask anything…</span><Arrow/></div></div></Panel>
  </div>
  <div style={{position:'absolute',left:72,top:620,color:'#4E6D7B',fontSize:28,opacity:anim(f,15,45)}}>Your next idea starts here.</div>
 </Stage>;
};
