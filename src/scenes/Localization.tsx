import {useCurrentFrame,useVideoConfig} from 'remotion';
import {anim,C,Headline,Orbit,Panel,Stage,Tag} from '../design';

export const Localization=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <Stage chapter="07" label="BUILT FOR THE WAY PAKISTAN CREATES">
  <Headline lines={['Global AI.','Local simplicity.']} size={94}/>
  <Orbit size={850} style={{left:115,top:440}}/>
  <div style={{position:'absolute',left:390,top:665,width:270,height:200,textAlign:'center',fontSize:126,fontWeight:600,letterSpacing:-8,color:C.cyan,opacity:anim(f,10,35)}}>PK</div>
  <div style={{position:'absolute',left:72,top:910,width:908}}>
   {[['English','Create a launch plan for my brand.'],['اردو','میرے برانڈ کے لیے ایک منصوبہ بنائیں'],['Roman Urdu','Mere brand ke liye launch plan banao.']].map(([label,text],i)=><Panel key={label} style={{padding:'24px 30px',marginBottom:18,translate:`${anim(f,25+i*17,58+i*17,150,0)}px 0`,opacity:anim(f,25+i*17,48+i*17)}}><div style={{fontSize:19,color:C.cyan,letterSpacing:label==='اردو'?0:2,fontFamily:label==='اردو'?'NotoArabic':undefined}}>{label}</div><div style={{fontFamily:i===1?'NotoArabic':undefined,fontSize:i===1?32:27,lineHeight:1.65,marginTop:5,direction:i===1?'rtl':'ltr',textAlign:i===1?'right':'left'}}>{text}</div></Panel>)}
  </div>
  <div style={{position:'absolute',left:72,top:1500,display:'flex',gap:14,opacity:anim(f,110,140)}}><Tag>Freelancers</Tag><Tag>Students</Tag><Tag>Creators</Tag></div>
 </Stage>;
};
