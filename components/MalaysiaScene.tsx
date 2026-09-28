'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {destinations} from '@/lib/destinations';
type Props={selected:string;onSelect:(id:string)=>void;command:{type:string;key:number}};
const positions:Record<string,[number,number,number]>={kl:[-3.35,.65,1.45],penang:[-4.5,.65,-1.75],melaka:[-2.55,.6,2.4],kelantan:[-2.65,.7,-1.5],sabah:[4.05,.6,-1.2],sarawak:[1.65,.6,1.3]};
export default function MalaysiaScene({selected,onSelect,command}:Props){
 const mount=useRef<HTMLDivElement>(null);const labels=useRef<HTMLDivElement>(null);const choose=useRef(onSelect);const selection=useRef(selected);
 const actions=useRef<(type:string)=>void>(()=>{});const [failed,setFailed]=useState(false);const [ready,setReady]=useState(false);
 useEffect(()=>{choose.current=onSelect;selection.current=selected},[onSelect,selected]);
 useEffect(()=>{actions.current(command.type)},[command]);
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.setClearColor(0xeaf2ef,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-7,7,5,-5,.1,100);camera.position.set(6,11,14);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.15,0);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minZoom=.75;controls.maxZoom=1.8;controls.minPolarAngle=.3;controls.maxPolarAngle=1.25;controls.rotateSpeed=.55;controls.zoomSpeed=.6;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scene.add(new THREE.HemisphereLight(0xeef8ff,0x698b75,3));const sunlight=new THREE.DirectionalLight(0xfff5df,4);sunlight.position.set(-6,14,8);sunlight.castShadow=true;sunlight.shadow.mapSize.set(2048,2048);sunlight.shadow.camera.left=-10;sunlight.shadow.camera.right=10;sunlight.shadow.camera.top=10;sunlight.shadow.camera.bottom=-10;sunlight.shadow.normalBias=.035;scene.add(sunlight);
  const materials=new Map<string,THREE.MeshStandardMaterial>();
  function material(color:string,metalness=0){const key=color+metalness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.7,metalness,flatShading:true}));return materials.get(key)!;}
  function mesh(geometry:THREE.BufferGeometry,color:string,parent:THREE.Object3D=scene,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function box(parent:THREE.Object3D,w:number,h:number,d:number,color:string,x=0,y=0,z=0){return mesh(new THREE.BoxGeometry(w,h,d),color,parent,x,y,z);}
  function cylinder(parent:THREE.Object3D,top:number,bottom:number,height:number,color:string,x=0,y=0,z=0,segments=8){return mesh(new THREE.CylinderGeometry(top,bottom,height,segments),color,parent,x,y,z);}
  const world=new THREE.Group();scene.add(world);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.085}));ground.rotation.x=-Math.PI/2;ground.position.y=-.45;ground.receiveShadow=true;scene.add(ground);
  function island(points:number[][]){const shape=new THREE.Shape();points.forEach((p,i)=>i?shape.lineTo(p[0],-p[1]):shape.moveTo(p[0],-p[1]));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:.46,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.16,bevelThickness:.12});geo.rotateX(-Math.PI/2);mesh(geo,'#a6cbb0',world,0,-.08,0);const shore=geo.clone();shore.scale(1.045,.58,1.045);mesh(shore,'#dfd4ad',world,0,-.22,0);}
  island([[-4.5,-3],[-3.5,-2.95],[-3.2,-2.5],[-2.5,-2.2],[-2.15,-1.4],[-2.3,-.7],[-1.85,.1],[-1.9,.9],[-1.35,1.9],[-1.5,2.8],[-1.05,3.6],[-1.55,3.9],[-2.45,3.1],[-3,2.7],[-3.8,1.2],[-4.1,.2],[-4.7,-.6],[-4.95,-1.8]]);
  island([[.45,1.85],[.2,1.2],[.6,.55],[1.25,.15],[1.5,-.5],[2.1,-.8],[2.55,-1.2],[2.9,-1.65],[3.45,-1.75],[3.8,-2.4],[4.15,-2.3],[4.5,-1.7],[5.05,-1.3],[5.3,-.8],[5.05,-.35],[5.4,.1],[4.6,.6],[4.1,.95],[3.65,1.4],[2.9,1.85],[2.2,2],[1.25,2.1]]);
  // A deliberately stylised discovery landscape, not a geographic or border map.
  cylinder(world,.32,.4,.15,'#a6cbb0',-5.2,.17,-1.9,7);cylinder(world,.23,.3,.13,'#a6cbb0',5.5,.14,-1.5,6);
  const groups:Record<string,THREE.Group>={};
  Object.entries(positions).forEach(([id,p])=>{const g=new THREE.Group();g.position.set(...p);g.userData.destination=id;groups[id]=g;world.add(g)});
  const kl=groups.kl;
  function tower(x:number){const g=new THREE.Group();g.position.x=x;kl.add(g);cylinder(g,.27,.34,.16,'#d5dde0',0,0);for(let i=0;i<14;i++){const radius=.26-(i>8?(i-8)*.025:0);cylinder(g,radius,radius,.11,i%2===0?'#a8c6d1':'#e9f0ef',0,.13+i*.13,0,8);}cylinder(g,.06,.15,.3,'#b9cfd5',0,2.01);cylinder(g,0,.05,.55,'#dfe6e1',0,2.4);}
  tower(-.37);tower(.37);box(kl,.85,.1,.14,'#b9d6de',0,.96,.02);box(kl,1.25,.08,.85,'#d7d5c2',0,-.12);cylinder(kl,.08,.1,.5,'#b6cdd6',.78,.25,-.4);cylinder(kl,.16,.08,.18,'#ebeee8',.78,.6,-.4);cylinder(kl,.015,.025,.28,'#b6cdd6',.78,.84,-.4);
  function house(parent:THREE.Object3D,x:number,z:number,color:string,height=.5,width=.42){const group=new THREE.Group();group.position.set(x,0,z);parent.add(group);box(group,width,height,.55,color,0,height/2);const roof=mesh(new THREE.ConeGeometry(width*.88,.35,4),'#b65c49',group,0,height+.12);roof.rotation.y=Math.PI/4;roof.scale.z=1.22;box(group,.085,.2,.012,'#48767a',-.1,.24,.282);box(group,.085,.2,.012,'#48767a',.1,.24,.282);box(group,.09,.22,.015,'#f1e6cc',0,.11,.29);return group;}
  ['#efb979','#a0c3b5','#e7cba0','#e99780'].forEach((c,i)=>house(groups.penang,(i-1.5)*.37,0,c,.6,.34));
  house(groups.melaka,-.23,0,'#ce705b',.64,.6);house(groups.melaka,.38,.08,'#d98269',.46,.48);const church=groups.melaka;box(church,.18,1,.2,'#e7c2a3',-.25,.48,-.16);mesh(new THREE.ConeGeometry(.18,.3,4),'#bf6155',church,-.25,1.1,-.16);box(church,.04,.25,.04,'#efe6ce',-.25,1.33,-.16);box(church,.16,.035,.04,'#efe6ce',-.25,1.36,-.16);
  const kite=groups.kelantan;house(kite,.02,.18,'#e3c196',.32,.5);const kiteObject=new THREE.Group();kiteObject.position.set(0,1.2,0);kite.add(kiteObject);const diamond=mesh(new THREE.OctahedronGeometry(.43,0),'#ecbc45',kiteObject);diamond.scale.set(1.35,1,.11);diamond.rotation.z=.18;const crescent=mesh(new THREE.TorusGeometry(.23,.075,5,18,Math.PI*1.4),'#326898',kiteObject,0,-.36);crescent.rotation.z=-Math.PI*.2;const kiteString=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-.55,0),new THREE.Vector3(.15,-.9,0),new THREE.Vector3(0,-1.15,0)]),new THREE.LineBasicMaterial({color:'#7e967d'}));kiteObject.add(kiteString);
  const mountain=groups.sabah;const mountainColors=['#789689','#779c85','#638774'];[[0,0,1.55,.8],[-.65,.12,.85,.65],[.65,.16,1.15,.6]].forEach((p,i)=>{const m=mesh(new THREE.ConeGeometry(p[3],p[2],5),mountainColors[i],mountain,p[0],p[2]/2-.08,p[1]);m.rotation.y=i*.9;});const peak=mesh(new THREE.ConeGeometry(.23,.43,5),'#c4d0c6',mountain,0,1.41,0);peak.rotation.y=.1;mesh(new THREE.ConeGeometry(.14,.38,4),'#bdc7bd',mountain,.15,1.42,.07);
  const longhouse=groups.sarawak;box(longhouse,1.65,.44,.64,'#be9566',0,.47,0);box(longhouse,1.88,.06,.9,'#ccb388',0,.2,.04);for(let i=0;i<6;i++){box(longhouse,.035,.3,.035,'#8c7253',-.76+i*.3,.08,.35);box(longhouse,.12,.22,.02,'#634d3b',-.66+i*.27,.44,.335);}const roof=mesh(new THREE.ConeGeometry(1,.4,4),'#7c6550',longhouse,0,.85);roof.rotation.y=Math.PI/4;roof.scale.set(1.43,1,.6);box(longhouse,.25,.05,.28,'#b29c78',.6,.1,.57);box(longhouse,.25,.05,.3,'#b29c78',.6,.0,.7);
  function tree(x:number,z:number,scale=1){const g=new THREE.Group();g.position.set(x,.45,z);g.scale.setScalar(scale);world.add(g);cylinder(g,.04,.065,.28,'#9b8960',0,.1);mesh(new THREE.IcosahedronGeometry(.27,0),'#699c77',g,0,.43);mesh(new THREE.IcosahedronGeometry(.19,0),'#8cb189',g,.12,.58);}
  [[-4.25,-2.5,.8],[-3.7,-2.3,1],[-3.55,-1.5,.8],[-3.75,-.5,1],[-2.8,-.35,.8],[-2.9,.4,.7],[-2.2,1.3,.8],[-1.75,2.6,.7],[-2.5,2.9,.8],[.8,1.2,.8],[1.45,.3,.9],[2.4,-.3,1.1],[3,-.7,.8],[3.1,1.3,.7],[4.2,.35,1],[4.6,-.45,.85],[2.5,1.1,.8]].forEach(p=>tree(p[0],p[1],p[2]));
  // Slow cloud motion adds depth without moving or hiding the controls.
  const clouds:THREE.Group[]=[];[[-4,3,-3],[3.5,3.2,2.7],[.2,2.7,-2.7]].forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);[[0,0,0,.25],[.3,.09,0,.35],[-.3,0,.02,.23],[.6,0,.03,.21]].forEach(a=>{const m=mesh(new THREE.IcosahedronGeometry(a[3],1),'#ffffff',g,a[0],a[1],a[2]);m.castShadow=false;});g.userData.base=p[0];g.scale.setScalar(i===2?.65:.8);clouds.push(g);world.add(g)});
  const rings:Record<string,THREE.Mesh>={};Object.entries(positions).forEach(([id,p])=>{const ring=new THREE.Mesh(new THREE.RingGeometry(.58,.62,48),new THREE.MeshBasicMaterial({color:'#3466c6',transparent:true,opacity:.8,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(p[0],.53,p[2]);scene.add(ring);rings[id]=ring;});
  Object.entries(groups).forEach(([id,g])=>g.traverse(obj=>{obj.userData.destination=id}));
  const ray=new THREE.Raycaster();const pointer=new THREE.Vector2();let down={x:0,y:0};
  function pointerDown(e:PointerEvent){down={x:e.clientX,y:e.clientY};}
  function pointerUp(e:PointerEvent){if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(Object.values(groups),true).find(h=>h.object.userData.destination);if(hit)choose.current(hit.object.userData.destination);}
  function contextLost(e:Event){e.preventDefault();setFailed(true);renderer.setAnimationLoop(null);}
  renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.addEventListener('webglcontextlost',contextLost);
  function resize(){const w=host!.clientWidth,h=host!.clientHeight;renderer.setSize(w,h);const aspect=w/h;const width=Math.max(12.5,9.4*aspect);camera.left=-width/2;camera.right=width/2;camera.top=width/aspect/2;camera.bottom=-width/aspect/2;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();controls.update();controls.saveState();
  actions.current=(type)=>{if(type==='reset')controls.reset();else{camera.zoom=THREE.MathUtils.clamp(camera.zoom*(type==='in'?1.16:1/1.16),.75,1.8);camera.updateProjectionMatrix();}};
  const vec=new THREE.Vector3();let last=0;
  renderer.setAnimationLoop((time)=>{
   if(time-last<30||document.hidden)return;last=time;controls.update();
   if(!reduced){clouds.forEach((g,i)=>g.position.x=g.userData.base+Math.sin(time*.00018+i)*.18);kiteObject.rotation.z=Math.sin(time*.0007)*.07;}
   Object.entries(rings).forEach(([id,ring])=>{ring.visible=id===selection.current});renderer.render(scene,camera);
   const occupied:{x:number;y:number;w:number;h:number}[]=[];
   const pinElements=Array.from(labels.current?.querySelectorAll<HTMLButtonElement>('[data-place]')??[]);
   pinElements.sort((a,b)=>Number(b.dataset.place===selection.current)-Number(a.dataset.place===selection.current));
   for(const label of pinElements){const id=label.dataset.place!,p=positions[id];
    vec.set(p[0],p[1]+(id==='kl'?2.8:id==='sabah'?1.8:id==='kelantan'?1.9:1.05),p[2]).project(camera);
    const w=label.offsetWidth,h=label.offsetHeight;
    const x=THREE.MathUtils.clamp((vec.x*.5+.5)*host!.clientWidth-w/2,8,host!.clientWidth-w-8);
    let y=THREE.MathUtils.clamp((-vec.y*.5+.5)*host!.clientHeight-h,8,host!.clientHeight-h-8);
    for(let i=0;i<8;i++){const collision=occupied.find(b=>x<b.x+b.w+5&&x+w+5>b.x&&y<b.y+b.h+5&&y+h+5>b.y);if(!collision)break;y=collision.y+collision.h+7;}
    occupied.push({x,y,w,h});label.style.transform=`translate(${x}px,${y}px)`;label.style.visibility=vec.z>1?'hidden':'visible';
   }
  });setReady(true);
  return()=>{observer.disconnect();renderer.setAnimationLoop(null);renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('webglcontextlost',contextLost);controls.dispose();scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const list=Array.isArray(obj.material)?obj.material:[obj.material];list.forEach(m=>m.dispose());}else if(obj instanceof THREE.Line){obj.geometry.dispose();(obj.material as THREE.Material).dispose();}});materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="scene-wrap" role="region" aria-label="Interactive 3D Malaysia. Drag to rotate, pinch to zoom, or use the place buttons."><div ref={mount} className="scene-mount" aria-hidden="true"/>{failed?<div className="scene-fallback"><span>Malaysia, one story at a time.</span><p>3D isn’t available on this device. Choose any destination to keep exploring.</p>{destinations.map(d=><button key={d.id} onClick={()=>onSelect(d.id)}>{d.name}</button>)}</div>:<div className="scene-labels" ref={labels} style={{visibility:ready?'visible':'hidden'}}>{destinations.map(d=><button key={d.id} data-place={d.id} className={`scene-pin ${d.id===selected?'active':''}`} aria-label={`Select ${d.name} on the map`} aria-pressed={selected===d.id} onClick={()=>onSelect(d.id)}><i/>{d.name}</button>)}</div>}</div>;
}
