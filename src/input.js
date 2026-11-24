const code = new Set();
const touch = {x:0,z:0,shove:false,brace:false};
const starts = new Set(['Space','Enter']);
const prevent = new Set(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftRight']);
window.addEventListener('keydown',e=>{if(prevent.has(e.code))e.preventDefault();code.add(e.code)},{passive:false});
window.addEventListener('keyup',e=>code.delete(e.code));
window.addEventListener('blur',()=>code.clear());
function deadKeys(){for(const k of starts)code.delete(k)}
function keysPressed(){return code}
function stickSetup(){const base=document.querySelector('#stick'),knob=document.querySelector('#stick-knob');if(!base||!knob)return;let pointer=null;const move=e=>{if(pointer!==e.pointerId)return;const r=base.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),cap=34;if(len>cap){dx=dx/len*cap;dy=dy/len*cap}touch.x=dx/cap;touch.z=dy/cap;knob.style.transform=`translate(${dx}px, ${dy}px)`};base.addEventListener('pointerdown',e=>{pointer=e.pointerId;base.setPointerCapture(pointer);move(e)});base.addEventListener('pointermove',move);const up=e=>{if(pointer!==e.pointerId)return;pointer=null;touch.x=touch.z=0;knob.style.transform=''};base.addEventListener('pointerup',up);base.addEventListener('pointercancel',up);const button=(id,key)=>{const el=document.querySelector(id);if(!el)return;const on=e=>{e.preventDefault();touch[key]=true;el.classList.add('active');el.setPointerCapture(e.pointerId)};const off=()=>{touch[key]=false;el.classList.remove('active')};el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('lostpointercapture',off)};button('#touch-shove','shove');button('#touch-brace','brace')}
stickSetup();
export function readInput(player,vsCpu=false){const k=keysPressed();let x=0,z=0;if(player===0){x=(k.has('KeyD')?1:0)-(k.has('KeyA')?1:0)+touch.x;z=(k.has('KeyS')?1:0)-(k.has('KeyW')?1:0)+touch.z;return{ x:clamp(x),z:clamp(z), shove:k.has('Space')||touch.shove,brace:k.has('ShiftLeft')||touch.brace}}if(vsCpu)return null;x=(k.has('ArrowRight')?1:0)-(k.has('ArrowLeft')?1:0);z=(k.has('ArrowDown')?1:0)-(k.has('ArrowUp')?1:0);return{x:clamp(x),z:clamp(z),shove:k.has('Enter'),brace:k.has('ShiftRight')}}
export function clearShoveKey(){deadKeys()}
function clamp(n){return Math.max(-1,Math.min(1,n))}
