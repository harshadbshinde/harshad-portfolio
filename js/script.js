window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader").classList.add("hide"),650));

const menu=document.getElementById("menuToggle");
const nav=document.getElementById("navMenu");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#navMenu a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const cursor=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* 3D background: floating particles + rotating cloud/network */
if(window.THREE){
  const canvas=document.getElementById("webgl");
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);
  camera.position.z=10;

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);

  const world=new THREE.Group();
  scene.add(world);

  const particles=420;
  const positions=new Float32Array(particles*3);
  for(let i=0;i<particles;i++){
    positions[i*3]=(Math.random()-.5)*22;
    positions[i*3+1]=(Math.random()-.5)*14;
    positions[i*3+2]=(Math.random()-.5)*16-5;
  }
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
  const pMat=new THREE.PointsMaterial({
    color:0x38cfff,size:.035,transparent:true,opacity:.45
  });
  world.add(new THREE.Points(pGeo,pMat));

  const ringMaterial=new THREE.MeshBasicMaterial({
    color:0xff9900,wireframe:true,transparent:true,opacity:.12
  });
  for(let i=0;i<4;i++){
    const ring=new THREE.Mesh(
      new THREE.TorusGeometry(2.1+i*.75,.012,8,120),
      ringMaterial
    );
    ring.rotation.x=Math.PI/2+i*.25;
    ring.rotation.z=i*.35;
    world.add(ring);
  }

  const cloud=new THREE.Group();
  const cloudMaterial=new THREE.MeshStandardMaterial({
    color:0x122236,roughness:.65,metalness:.2,transparent:true,opacity:.55
  });
  const spheres=[
    [-1.0,0,0,.95],[0,0.35,0,1.25],[1.05,.05,0,.9],
    [-.25,.75,.1,.85],[.55,.7,.05,.8]
  ];
  spheres.forEach(([x,y,z,s])=>{
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(s,20,14),cloudMaterial);
    mesh.position.set(x,y,z);
    cloud.add(mesh);
  });
  const base=new THREE.Mesh(new THREE.BoxGeometry(2.7,.7,1.35),cloudMaterial);
  base.position.y=-.25;
  cloud.add(base);
  cloud.position.set(0,0,-2);
  world.add(cloud);

  scene.add(new THREE.AmbientLight(0x45627a,1.1));
  const orangeLight=new THREE.PointLight(0xff9900,4,12);
  orangeLight.position.set(2,2,3);
  scene.add(orangeLight);

  let targetX=0,targetY=0;
  window.addEventListener("pointermove",e=>{
    targetX=(e.clientX/innerWidth-.5)*.35;
    targetY=(e.clientY/innerHeight-.5)*.2;
  });

  function animate(){
    requestAnimationFrame(animate);
    world.rotation.y+=(targetX-world.rotation.y)*.02;
    world.rotation.x+=(-targetY-world.rotation.x)*.02;
    world.rotation.z+=.00035;
    cloud.rotation.y+=.004;
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener("resize",()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  });
}
