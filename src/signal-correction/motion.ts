export const clamp=(n:number)=>Math.min(1,Math.max(0,n));
export const ease=(t:number,a:number,b:number)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
export const out=(t:number,a:number,b:number)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
