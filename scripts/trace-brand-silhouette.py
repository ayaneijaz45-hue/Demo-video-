"""Derive a 3D mesh boundary from the authentic PNG alpha. No logo redesign.
Only creates code geometry; the source brand bitmap remains unchanged.
"""
from PIL import Image
import numpy as np
from pathlib import Path
import json

root=Path(__file__).resolve().parents[1]
im=Image.open(root/'public/brand/models-suite-logo.png').convert('RGBA')
w=260; h=round(w*im.height/im.width)
mask=np.asarray(im.resize((w,h),Image.Resampling.LANCZOS))[:,:,3]>120
edges={}
def edge(a,b): edges.setdefault(a,[]).append(b)
for y in range(h):
 for x in range(w):
  if not mask[y,x]: continue
  if y==0 or not mask[y-1,x]: edge((x,y),(x+1,y))
  if x==w-1 or not mask[y,x+1]: edge((x+1,y),(x+1,y+1))
  if y==h-1 or not mask[y+1,x]: edge((x+1,y+1),(x,y+1))
  if x==0 or not mask[y,x-1]: edge((x,y+1),(x,y))

def simplify(p,epsilon=.65):
 if len(p)<3:return p
 a=np.array(p[0],float); b=np.array(p[-1],float);v=b-a
 pts=np.asarray(p,float)
 if np.dot(v,v)==0:dist=np.linalg.norm(pts-a,axis=1)
 else:dist=np.abs(np.cross(v,pts-a))/np.linalg.norm(v)
 i=int(np.argmax(dist))
 if dist[i]>epsilon:return simplify(p[:i+1],epsilon)[:-1]+simplify(p[i:],epsilon)
 return [p[0],p[-1]]

paths=[]
while edges:
 start=next(iter(edges));p=[start];cur=start
 for _ in range(w*h*4):
  if cur not in edges:break
  nxt=edges[cur].pop()
  if not edges[cur]:del edges[cur]
  p.append(nxt);cur=nxt
  if cur==start:break
 area=sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(p,p[1:]))/2
 if abs(area)>40:
  q=simplify(p)
  paths.append({'area':area,'points':[[round((x/w-.5)*3.6,5),round((.5-y/h)*3.6*h/w,5)] for x,y in q]})
paths.sort(key=lambda x:abs(x['area']),reverse=True)
data={'width':3.6,'height':3.6*h/w,'outers':[p['points'] for p in paths if p['area']*paths[0]['area']>0],'holes':[p['points'] for p in paths[1:] if p['area']*paths[0]['area']<0]}
(root/'src/first-reveal/logoContours.ts').write_text('// Derived from the unchanged authentic logo alpha by scripts/trace-brand-silhouette.py\nexport const logoContours = '+json.dumps(data,separators=(',',':'))+';\n')
print('Components',len(data['outers']),'points',[len(p) for p in data['outers']],'holes',len(data['holes']),'source alpha geometry; source PNG unchanged')
