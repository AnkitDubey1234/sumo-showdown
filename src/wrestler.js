import * as THREE from 'three';
const sphereGeo=new THREE.SphereGeometry(1,18,14);
function material(color,roughness=.72){return new THREE.MeshStandardMaterial({color,roughness})}
export function makeWrestler(scene,id,name,color,accent,position){
 const root=new THREE.Group();root.position.set(position[0],.59,position[1]);scene.add(root);
 const cloth=material(color),skin=material(id===0?'#f5bb8a':'#d5966e'),dark=material('#29252a'),beltMat=material(accent),white=material('#fff4df');
 const belly=new THREE.Mesh(sphereGeo,skin);belly.scale.set(.79,.83,.7);belly.position.y=.76;belly.castShadow=true;root.add(belly);
 const torso=new THREE.Mesh(sphereGeo,cloth);torso.scale.set(.82,.82,.68);torso.position.y=1.06;torso.castShadow=true;root.add(torso);
 const mawashi=new THREE.Mesh(new THREE.CylinderGeometry(.64,.71,.31,16),beltMat);mawashi.position.y=.61;mawashi.castShadow=true;root.add(mawashi);
 const beltfront=new THREE.Mesh(new THREE.BoxGeometry(.24,.82,.1),beltMat);beltfront.position.set(0,.55,.66);beltfront.rotation.x=-.28;beltfront.castShadow=true;root.add(beltfront);
 for(let s of [-1,1]){const arm=new THREE.Group();arm.position.set(s*.68,1.32,0);root.add(arm);const upper=new THREE.Mesh(sphereGeo,skin);upper.scale.set(.3,.43,.32);upper.rotation.z=s*-.48;upper.position.set(s*.09,-.21,.06);upper.castShadow=true;arm.add(upper);const fist=new THREE.Mesh(sphereGeo,skin);fist.scale.set(.26,.24,.3);fist.position.set(s*.17,-.45,.2);fist.castShadow=true;arm.add(fist);arm.name=s<0?'armL':'armR';
  const leg=new THREE.Mesh(sphereGeo,skin);leg.scale.set(.27,.45,.3);leg.position.set(s*.42,.22,.02);leg.castShadow=true;root.add(leg);const foot=new THREE.Mesh(sphereGeo,white);foot.scale.set(.32,.13,.42);foot.position.set(s*.45,.065,.12);foot.castShadow=true;root.add(foot)}
 const head=new THREE.Mesh(sphereGeo,skin);head.scale.set(.48,.39,.43);head.position.y=1.88;head.castShadow=true;root.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.47,14,8,0,Math.PI*2,0,Math.PI*.42),dark);hair.scale.set(1,.62,1);hair.position.set(0,2.09,0);hair.castShadow=true;root.add(hair);
 const topknot=new THREE.Mesh(sphereGeo,dark);topknot.scale.set(.17,.24,.17);topknot.position.set(0,2.31,-.02);topknot.castShadow=true;root.add(topknot);
 for(let s of [-1,1]){const eye=new THREE.Mesh(sphereGeo,material('#29252a',.45));eye.scale.set(.055,.07,.04);eye.position.set(s*.19,1.92,.394);root.add(eye);const brow=new THREE.Mesh(new THREE.BoxGeometry(.12,.035,.035),dark);brow.position.set(s*.19,2.015,.41);brow.rotation.z=-s*.18;root.add(brow);const cheek=new THREE.Mesh(sphereGeo,material(id===0?'#ef8c78':'#df7f7a'));cheek.scale.set(.12,.065,.035);cheek.position.set(s*.30,1.78,.36);root.add(cheek)}
 const mouth=new THREE.Mesh(new THREE.BoxGeometry(.16,.035,.025),dark);mouth.position.set(0,1.76,.408);root.add(mouth);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.72,22),new THREE.MeshBasicMaterial({color:'#303443',transparent:true,opacity:.25,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.018;root.add(shadow);
 return{id,name,color,accent,root,velocity:new THREE.Vector2(),facing:new THREE.Vector2(0,id===0?1:-1),mass:id===0?1:1.13,strength:id===0?1:1.02,phase:'ready',phaseTimer:0,cooldown:0,charge:0,brace:0,hitFlash:0,aiPhase:Math.random()*5,arms:root.children.filter(c=>c.name.startsWith('arm')),belly,legs:root.children.filter(c=>c.geometry===sphereGeo)}
}
export function poseWrestler(w,t,dt){const v=w.velocity.length(),walk=Math.min(1,v/2);w.root.rotation.y=Math.atan2(w.facing.x,w.facing.y);w.root.position.y=.59+Math.sin(t*10+w.aiPhase)*.035*walk;w.belly.rotation.x=Math.sin(t*2+w.aiPhase)*.035;for(let i=0;i<w.arms.length;i++){const a=w.arms[i],sign=i===0?-1:1;let target=i===0?.22:-.22;if(w.phase==='windup')target+=sign*.6;if(w.phase==='hit')target+=sign*.35;if(w.brace>0)target=sign*.92;a.rotation.x+=(target-a.rotation.x)*Math.min(1,dt*12);a.rotation.z+=(sign*(.25+walk*.32)-a.rotation.z)*Math.min(1,dt*8)}w.root.rotation.z+=(w.phase==='hit'?-.07:0-w.root.rotation.z)*Math.min(1,dt*8)}
