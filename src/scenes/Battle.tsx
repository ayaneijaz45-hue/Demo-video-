import {useCurrentFrame,useVideoConfig} from 'remotion';
import {anim,Arrow,Bar,C,Headline,Panel,SampleNote,Stage,Tag} from '../design';

export const Battle=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig(); const chosen=anim(f,5*fps,5.7*fps);
 const answers=['Lead with a clear idea.\nMake the value obvious.\nInvite people to explore.','Start with the audience.\nShow a useful outcome.\nEnd with one clear action.'];
 return <Stage light chapter="04" label="ONE PROMPT. MULTIPLE PERSPECTIVES.">
  <Headline light lines={['Compare. Choose.','Continue.']} size={90}/>
  <Panel light style={{position:'absolute',left:72,top:600,width:908,translate:`0 ${anim(f,12,48,70,0)}px`}}><Bar light title="Model Battle"/><div style={{padding:30,fontSize:27}}><div style={{fontSize:20,color:C.accent,marginBottom:12}}>PROMPT</div>Write a product launch plan.</div><div style={{padding:'0 30px 28px',display:'flex',gap:12}}><Tag light>GPT ✓</Tag><Tag light>Claude ✓</Tag><span style={{fontSize:22,marginLeft:'auto',alignSelf:'center'}}>2 / 3 selected</span></div></Panel>
  <div style={{position:'absolute',left:72,top:940,display:'flex',gap:22,alignItems:'flex-start'}}>{['GPT','Claude'].map((name,i)=><Panel key={name} light style={{width:443,height:470,borderColor:i===1?`rgba(8,126,164,${.3+.7*chosen})`:'#AAC6D8',boxShadow:i===1?`0 ${35*chosen}px 70px #087EA425`:'0 25px 60px #25527315',translate:`0 ${anim(f,50+i*8,90+i*8,130,0)-chosen*(i===1?18:0)}px`,opacity:i===0?1-chosen*.28:1}}>
   <div style={{padding:28,display:'flex',justifyContent:'space-between',borderBottom:'1px solid #DAE8F0',fontSize:29,fontWeight:700}}>{name}<span style={{fontSize:17,color:C.accent,alignSelf:'center'}}>READY</span></div>
   <div style={{padding:28,fontSize:32,lineHeight:1.5,height:260,whiteSpace:'pre-line',clipPath:`inset(0 0 ${100-anim(f,70+i*12,125+i*12)*100}% 0)`}}>{answers[i]}</div>
   <div style={{margin:'0 24px',borderRadius:16,padding:'16px 20px',fontSize:22,color:i===1?C.accent:'#59707C',background:i===1?C.light:'#F5F8FB',display:'flex',justifyContent:'space-between'}}>{i===1&&chosen>.5?'✓ Winner':'Choose winner'}<Arrow/></div>
  </Panel>)}</div>
  <SampleNote top={1465} light text="Illustrative responses · each model is billed separately"/>
 </Stage>;
};
