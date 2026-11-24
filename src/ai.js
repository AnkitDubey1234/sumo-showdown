export function planAI(cpu,player,edge,t,settings){
 const cfg={easy:{reaction:.6,quality:.58,commit:.35,brace:.67},medium:{reaction:.38,quality:.8,commit:.67,brace:.72},hard:{reaction:.24,quality:.94,commit:.88,brace:.8}}[settings.difficulty]||{reaction:.38,quality:.8,commit:.67,brace:.72};
 const gap=Math.hypot(player.x-cpu.x,player.z-cpu.z),toPlayer=Math.atan2(player.z-cpu.z,player.x-cpu.x);
 const edgeDir=Math.atan2(-cpu.z,-cpu.x),edgeDist=Math.hypot(cpu.x,cpu.z);let state=cpu.ai;if(!state||t>=state.next){const threaten=gap<2.5&&Math.random()<cfg.commit&&cpu.phase==='ready';const avoid=gap>1.55&&edgeDist>4.35&&Math.random()<cfg.quality;const brace=gap<1.45&&Math.random()<cfg.brace&&(Math.hypot(player.velocity.x,player.velocity.y)>.7);state=cpu.ai={next:t+cfg.reaction*(.55+Math.random()*.8),mode:threaten?'shove':avoid?'recover':brace?'brace':'approach'};if(state.mode==='shove')cpu.ai.shoveFor=.15+Math.random()*.35}
 const orbit=Math.sin(t*.7+cpu.aiPhase||t*.7);let dir;
 if(edgeDist>4.05)dir=edgeDir;else if(state.mode==='recover')dir=toPlayer+(Math.random()<.5?-.55:.55);else if(state.mode==='approach'||state.mode==='shove')dir=toPlayer+(edgeDist>3.7?-.4:.15*orbit);else dir=toPlayer;
 const dx=Math.cos(dir),dz=Math.sin(dir);return{x:dx,z:dz,shove:state.mode==='shove'&&gap<2.0,brace:state.mode==='brace'&&gap<1.65}
}
