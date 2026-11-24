import * as THREE from 'three';
import {poseWrestler} from './wrestler.js';
import {playTone} from './audio.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function makeParticles(scene){const g=new THREE.BufferGeometry(),max=280;const pos=new Float32Array(max*3),colors=new Float32Array(max*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(colors,3));const mesh=new THREE.Points(g,new THREE.PointsMaterial({size:.105,vertexColors:true,transparent:true,opacity:.9,depthWrite:false,sizeAttenuation:true}));scene.add(mesh);return{g,mesh,items:[],max}}
export function puff(pool,pos,power=1,color='#e6c895',count=12){for(let i=0;i<count;i++){if(pool.items.length>=pool.max)pool.items.shift();const a=Math.random()*Math.PI*2,s=(.45+Math.random()*2.2)*power;const c=new THREE.Color(color);pool.items.push({x:pos.x+(Math.random()-.5)*.3,y:pos.y+.12+Math.random()*.3,z:pos.z+(Math.random()-.5)*.3,vx:Math.cos(a)*s,vy:(.65+Math.random()*2)*power,vz:Math.sin(a)*s,life:.32+Math.random()*.5,max:.5,size:.7+Math.random()*1.6,c})}}
export function updateParticles(pool,dt){const pos=pool.g.attributes.position.array,colors=pool.g.attributes.color.array;let n=0;for(let i=pool.items.length-1;i>=0;i--){const p=pool.items[i];p.life-=dt;if(p.life<=0){pool.items.splice(i,1);continue}p.vy-=4*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;const f=p.life/p.max;pos[n*3]=p.x;pos[n*3+1]=p.y;pos[n*3+2]=p.z;colors[n*3]=p.c.r*f;colors[n*3+1]=p.c.g*f;colors[n*3+2]=p.c.b*f;n++}pool.g.setDrawRange(0,n);pool.g.attributes.position.needsUpdate=true;pool.g.attributes.color.needsUpdate=true}
export function simulate(ws,inputs,world,scene,pool,dt,t){const events=[];for(let i=0;i<2;i++){const w=ws[i],input=inputs[i];if(!input)continue;w.cooldown=Math.max(0,w.cooldown-dt);w.hitFlash=Math.max(0,w.hitFlash-dt);w.brace=input.brace?1:Math.max(0,w.brace-dt*4);
 const ax=input.x,az=input.z,mag=Math.min(1,Math.hypot(ax,az)),slow=input.brace?.52:1,maxSpeed=input.brace?2.25:3.35;const targetX=ax*maxSpeed,targetZ=az*maxSpeed,accel=(mag?8.3:5.9)/w.mass;
 w.velocity.x+=(targetX-w.velocity.x)*Math.min(1,accel*dt);w.velocity.y+=(targetZ-w.velocity.y)*Math.min(1,accel*dt);
 if(mag>.12){const l=Math.hypot(w.velocity.x,w.velocity.y)||1;w.facing.x+=(ax/l-w.facing.x)*Math.min(1,dt*7);w.facing.y+=(az/l-w.facing.y)*Math.min(1,dt*7);const fl=Math.hypot(w.facing.x,w.facing.y)||1;w.facing.x/=fl;w.facing.y/=fl}
 const shovePressed=input.shove;
 if(shovePressed&&w.phase==='ready'&&w.cooldown<=0){w.phase='windup';w.phaseTimer=0;w.charge=0;w.shoveHeld=true}
 if(w.phase==='windup'){if(shovePressed)w.charge=Math.min(1,w.charge+dt*.8);w.phaseTimer+=dt;if(w.phaseTimer>=(i===0?.23:.24)+w.charge*.35){w.phase='hit';w.phaseTimer=0;w.shoveHeld=false;w.didHit=false;playTone('pop',.4);events.push({type:'launch',w})}}
 else if(w.phase==='hit'){w.phaseTimer+=dt;if(w.phaseTimer>.13){w.phase='recovery';w.phaseTimer=0;w.cooldown=.26}}
 else if(w.phase==='recovery'){w.phaseTimer+=dt;if(w.phaseTimer>.34){w.phase='ready';w.phaseTimer=0}}
 const damp=Math.exp(-(mag?1.65:3.2)*dt);w.velocity.multiplyScalar(damp);const sp=w.velocity.length();if(sp>maxSpeed*1.22)w.velocity.multiplyScalar(maxSpeed*1.22/sp);
 w.root.position.x+=w.velocity.x*dt;w.root.position.z+=w.velocity.y*dt;
 const r=Math.hypot(w.root.position.x,w.root.position.z);if(r>world.knockoutRadius){return{winner:1-i,events}}
 if(r>world.ringRadius){const nx=w.root.position.x/r,nz=w.root.position.z/r;const excess=Math.min(.25,r-world.ringRadius);w.root.position.x-=nx*excess;w.root.position.z-=nz*excess;if(w.velocity.x*nx+w.velocity.y*nz>0){w.velocity.x-=1.65*nx;w.velocity.y-=1.65*nz}}
 if(w.phase==='hit'&&!w.didHit){const other=ws[1-i],dx=other.root.position.x-w.root.position.x,dz=other.root.position.z-w.root.position.z,dist=Math.hypot(dx,dz);const facingDot=(w.facing.x*dx+w.facing.y*dz)/(dist||1);if(dist<2.0&&facingDot>-.1){const charge=1+w.charge*.62,impact=w.strength*charge*(input.brace?.85:1);const nx=dx/(dist||1),nz=dz/(dist||1);const shove=7.2*impact/other.mass;other.velocity.x+=nx*shove;other.velocity.y+=nz*shove;other.velocity.x-=w.facing.x*.75;other.velocity.y-=w.facing.y*.75;w.velocity.x-=nx*1.15;w.velocity.y-=nz*1.15;other.hitFlash=.14;w.didHit=true;events.push({type:'impact',w,other,power:impact});playTone('thump',impact);puff(pool,{x:(w.root.position.x+other.root.position.x)/2,y:.65,z:(w.root.position.z+other.root.position.z)/2},.7+impact*.5,'#ecd8a8',19);}
 }}
 for(const w of ws)poseWrestler(w,t,dt);
 const d=ws[0].root.position.distanceTo(ws[1].root.position);if(d<1.2){const dx=ws[1].root.position.x-ws[0].root.position.x,dz=ws[1].root.position.z-ws[0].root.position.z,l=d||1,push=(1.2-d)*.5;ws[0].root.position.x-=dx/l*push;ws[0].root.position.z-=dz/l*push;ws[1].root.position.x+=dx/l*push;ws[1].root.position.z+=dz/l*push}
 updateParticles(pool,dt);return{winner:null,events}}
export function dustFoot(pool,w){if(w.velocity.length()>.8&&Math.random()<.18)puff(pool,{x:w.root.position.x,y:.59,z:w.root.position.z},.22,'#d0bb98',2)}
export function doHitStop(scale=1){window.__hitStop=Math.max(window.__hitStop||0,.045*scale)}
