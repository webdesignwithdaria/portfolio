'use strict';
const $=s=>document.querySelector(s), clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n)},mix=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'), mobileQuery=matchMedia('(max-width:1024px)');
const introSection=$('.intro-section'),stack=$('.project-stack'),outroSection=$('.outro-section');
const introVideo=$('#intro-video'),idleVideo=$('#idle-video'),outroVideo=$('#outro-video');
const heroMedia=$('.hero-media'),outroMedia=$('.outro-media');
const contactTemplate=$('#contact-template').innerHTML;
for(const panel of document.querySelectorAll('.contact-content'))panel.innerHTML=contactTemplate;
stack.innerHTML=projects.map((p,i)=>`<article class="project-card" data-project="${i}" aria-labelledby="project-title-${i}"><div class="project-art artboard"><div class="project-media"><img class="laptop-base" src="assets/intro-hq-end.webp" alt="Laptop on a silver stand" width="1920" height="1080" loading="${i?'lazy':'eager'}"><div class="screen"><img src="${i===1?'assets/project-2-complete.webp':`assets/project-${i+1}-poster.webp`}" alt="${p.name} website" width="1440" height="810" loading="${i?'lazy':'eager'}"><video muted playsinline loop preload="none" data-src="assets/project-${i+1}.mp4" poster="${i===1?'assets/project-2-complete.webp':`assets/project-${i+1}-poster.webp`}" aria-label="${p.name} website walkthrough"></video></div><button class="project-toggle" type="button" aria-label="Pause ${p.name} video">Pause video</button></div><div class="project-copy"><div class="tags">${p.tags.map((tag,j)=>`<span class="tag"><span class="desktop-label">${tag}</span><span class="mobile-label">${p.mobile[j]}</span></span>`).join('')}</div><h2 id="project-title-${i}">${p.name}</h2><p class="subtitle">${p.subtitle}</p><a class="website-link" href="${p.url}" target="_blank" rel="noopener noreferrer">website link<img src="assets/link.svg" alt="" width="17.5" height="17.5"></a><div class="case-body"><section><h3>CONTEXT:</h3><p>${p.context}</p></section><section><h3>MY APPROACH:</h3>${p.approach}</section><section><h3>OUTCOME:</h3><p>${p.outcome}</p></section></div></div></div></article>`).join('');
const cards=[...document.querySelectorAll('.project-card')],projectVideos=cards.map(c=>c.querySelector('video'));
// These elements are stable after project markup is created.
const introFill=$('.intro-fill'),
      heroTitle=$('.hero-title-layer'),
      heroHeading=$('.hero-art h1'),
      scrollCue=$('.scroll-cue'),
      idleToggle=$('.idle-toggle'),
      heroFallback=$('.hero-fallback'),
      outroPin=$('.outro-pin'),
      outroFallback=$('.outro-fallback'),
      desktopContact=$('.desktop-contact'),
      mobileContact=$('.mobile-contact'),
      firstProjectCopy=cards[0].querySelector('.project-copy'),
      lastProjectScreen=cards[2].querySelector('.screen'),
      lastProjectCopy=cards[2].querySelector('.project-copy'),
      lastProjectToggle=cards[2].querySelector('.project-toggle');
// Keep the last laptop pinned while the closing clip covers it in-place.
stack.append(outroSection);
let mobile=mobileQuery.matches,h=innerHeight,scale=1,lastWidth=innerWidth,positions={},scheduled=false,activeProject=-1,hasScrolled=false;
const pausedProjects=new Set(),decoded=new WeakMap(),failed=new WeakSet();
const textMotion=window.createTextMotion(cards,reduced);
function queueRender(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
function loadVideo(v){if(!v.getAttribute('src')){v.src=v.dataset.src;v.preload='auto';v.load();}}
function unloadVideo(v){v.pause();if(v.getAttribute('src')){v.removeAttribute('src');v.load();}decoded.delete(v);failed.delete(v);v.classList.remove('failed','has-frame');}
function endTime(v){return Number.isFinite(v.duration)?Math.max(0,v.duration-1/120):0;}
function seek(v,p){if(!Number.isFinite(v.duration)||v.seeking||failed.has(v))return;const t=p<=0?0:p>=1?endTime(v):Math.min(endTime(v),(Math.floor(p*v.duration*24)+.5)/24);if(Math.abs(v.currentTime-t)>.008)v.currentTime=t;}
function progress(v){return endTime(v)>0?clamp((decoded.get(v)||0)/endTime(v)):0;}
for(const v of [introVideo,outroVideo]){
 v.pause();
 const complete=()=>{if(!v.seeking&&v.readyState>=2)decoded.set(v,v.currentTime);queueRender()};
 v.addEventListener('loadedmetadata',queueRender);v.addEventListener('loadeddata',complete);v.addEventListener('seeked',complete);v.addEventListener('canplay',complete);
 v.addEventListener('error',()=>{if(v.getAttribute('src')){failed.add(v);v.classList.add('failed');queueRender()}});
}
for(const [i,v] of projectVideos.entries()){
 v.addEventListener('loadeddata',()=>{v.classList.add('has-frame');queueRender()});
 v.addEventListener('canplay',queueRender);
 v.addEventListener('error',()=>v.classList.remove('has-frame'));
 cards[i].querySelector('.project-toggle').addEventListener('click',e=>{if(pausedProjects.has(i)){pausedProjects.delete(i);if(!mobile)v.play().catch(()=>{});}else{pausedProjects.add(i);v.pause();}e.currentTarget.textContent=pausedProjects.has(i)?'Play video':'Pause video';e.currentTarget.setAttribute('aria-label',`${pausedProjects.has(i)?'Play':'Pause'} ${projects[i].name} video`);});
}
const idleLoop = window.createIdleLoop({
 video: idleVideo,
 button: idleToggle,
 reduced,
 isMobile: () => mobile,
 onChange: queueRender
});
function updateIdle() { idleLoop.update(); }
function layout(){
 const nextMobile=mobileQuery.matches,modeChanged=nextMobile!==mobile;
 if(!nextMobile||innerWidth!==lastWidth||Math.abs(innerHeight-h)>160)h=innerHeight;
 mobile=nextMobile;lastWidth=innerWidth;
 scale=mobile?innerWidth/393:Math.min(innerWidth/1440,h/810);
 document.documentElement.style.setProperty('--scale',scale);
 document.documentElement.style.setProperty('--side-gap', Math.max(0, (innerWidth - 1440 * scale) / 2) + 'px');
 document.documentElement.style.setProperty('--viewport',h+'px');
 document.documentElement.style.setProperty('--logical-height',h/scale+'px');
 document.documentElement.style.setProperty('--mobile-card-scale',innerWidth/393);
 const heroFit = Math.min(1, h / scale / 852);
 document.documentElement.style.setProperty('--hero-fit', heroFit);
 // Keep the first project's laptop aligned with Frame 1's fixed vertical position.
 // v28 ended at -15 logical pixels; v29 stays at its opening 232 * fit.
 document.documentElement.style.setProperty('--first-project-offset', (232 * heroFit + 15) + 'px');
 const introDistance=h*(mobile?1.9:2.4);
 introSection.style.height=introDistance+h+'px';
 outroSection.style.height=mobile?'0px':h*3.3+'px';
 positions={introEnd:introDistance,projectStart:introDistance,projects:cards.map((c,i)=>({start:mobile?c.offsetTop+stack.offsetTop:introDistance+cards.slice(0,i).reduce((sum,card)=>sum+card.offsetHeight+parseFloat(getComputedStyle(card).marginBottom),0),length:c.offsetHeight})),outroStart:mobile?Infinity:outroSection.offsetTop+stack.offsetTop,contactStart:mobile?mobileContact.offsetTop:outroSection.offsetTop+stack.offsetTop+h*1.9};
 if(mobile){if(modeChanged||outroVideo.getAttribute('src')){unloadVideo(outroVideo);projectVideos.forEach(unloadVideo);activeProject=-1;}}
 textMotion.configure(mobile);
 queueRender();
}
function setActive(i,visible=[]){activeProject=i;projectVideos.forEach((v,j)=>{const play=visible.includes(j)&&!pausedProjects.has(j)&&!reduced.matches&&!mobile&&!document.hidden;if(play){loadVideo(v);if(v.paused)v.play().catch(()=>{});}else if(!v.paused)v.pause();});}
function render(){
 scheduled=false;const y=scrollY;const introFraction=clamp((y-h*.12)/(positions.introEnd-h*.34));
 if(y>0||hasScrolled){hasScrolled=true;loadVideo(introVideo);seek(introVideo,introFraction);}
 const introPose=smooth(progress(introVideo)||((failed.has(introVideo))?introFraction:0));
 if(mobile){const fit=Math.min(1,h/scale/852),left=mix(196.5-390*fit,-303.5,introPose),top=232*fit,width=mix(780*fit,686,introPose),height=width*9/16;
  Object.assign(heroMedia.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});
  const fill=introFill;fill.style.top=((top+height-1)*scale)+'px';fill.style.opacity=smooth((introPose-.08)/.5);fill.style.setProperty('--join-soft',((1-introPose)*24)+'px');
  const title=heroTitle;title.style.setProperty('--media-left',left+'px');title.style.setProperty('--media-top',top+'px');title.style.setProperty('--media-width',width+'px');title.style.setProperty('--media-height',height+'px');
 }else{heroMedia.removeAttribute('style');for(const key of ['--media-left','--media-top','--media-width','--media-height'])heroTitle.style.removeProperty(key);}
 const idleVisible=y<2||(!decoded.has(introVideo)&&!failed.has(introVideo));idleVideo.style.opacity=idleVisible?'1':'0';updateIdle();
 heroMedia.classList.toggle('idle-static', idleVisible && idleLoop.isStatic);
 const titleOpacity=1-smooth(y/(h*.18));heroHeading.style.opacity=titleOpacity;scrollCue.style.opacity=titleOpacity;idleToggle.style.visibility=titleOpacity>.5?'visible':'hidden';
 if(failed.has(introVideo))heroFallback.src=introFraction>.8?'assets/intro-v26-end.webp':'assets/idle-v21-poster.webp';
 cards[0].classList.toggle('revealed',y>=positions.introEnd-1);
 if(mobile)textMotion.project(0,y>=positions.introEnd-1?1:0);
 firstProjectCopy.style.opacity=1;
 let next=-1,visible=[];
 if(!mobile){
  const rects=cards.map(c=>c.getBoundingClientRect());
  cards.forEach((c,i)=>textMotion.project(i,i===0?(y-positions.introEnd+1)/(h*.2):(h*.72-rects[i].top)/(h*.72)));
  rects.forEach((r,i)=>{const uncoveredBottom=Math.min(r.bottom,i<cards.length-1?rects[i+1].top:h);
   if(r.top<h*1.5&&r.bottom>0&&y>=positions.introEnd-h*.5)loadVideo(projectVideos[i]);
   if(r.top<h&&uncoveredBottom>Math.max(0,r.top)+1&&y>=positions.introEnd&&y<positions.outroStart){visible.push(i);next=i;}
  });
  const endFade=1-smooth((y-(positions.outroStart-h*.3))/(h*.3));
  lastProjectScreen.style.opacity=endFade;
  lastProjectCopy.style.opacity=endFade;
  lastProjectToggle.style.visibility=endFade<.5?'hidden':'';
 }else{lastProjectScreen.style.opacity=1;lastProjectCopy.style.opacity=1;}
 setActive(next,visible);
 if(!mobile){
  if(y>positions.outroStart-h)loadVideo(outroVideo);
  const outFraction=clamp((y-positions.outroStart-h*.12)/(h*1.55));seek(outroVideo,outFraction);
  // The clip stays opaque while seeking, including temporary readyState changes.
  outroPin.style.opacity=y>=positions.outroStart?'1':'0';
  const outPose=smooth(progress(outroVideo));outroMedia.style.transform=`translateY(${24*outPose}px)`;
  const fallback=failed.has(outroVideo);if(fallback){outroFallback.src=outFraction>.6?'assets/outro-hq-end.webp':'assets/outro-hq-poster.webp';outroMedia.style.transform=`translateY(${outFraction>.6?24:0}px)`;}
  const contactOpacity=(progress(outroVideo)>.99||fallback)?smooth((y-positions.contactStart)/(h*.22)):0;
  textMotion.contact(contactOpacity);
  const panel=desktopContact;panel.style.opacity=contactOpacity>0?1:0;panel.classList.toggle('is-visible',contactOpacity>0);panel.inert=contactOpacity<=0;
 }
 document.body.dataset.frame=y<positions.introEnd?'1':mobile?'mobile-flow':y<positions.outroStart?String(Math.max(0,next)+2):y<positions.contactStart?'5':'6';
}
function navigate(hash,instant=false){const target=hash==='#home'?0:hash==='#projects'?positions.projectStart+(mobile?0:h*.2):hash==='#contact'?positions.contactStart+(mobile?0:h*.3):null;if(target!==null)scrollTo({top:target,behavior:instant||reduced.matches?'instant':'smooth'});}
for(const a of document.querySelectorAll('a[href^="#"]'))a.addEventListener('click',e=>{e.preventDefault();navigate(a.hash);history.replaceState(null,'',a.hash)});
addEventListener('scroll',queueRender,{passive:true});addEventListener('resize',layout);mobileQuery.addEventListener('change',layout);reduced.addEventListener('change',()=>{setActive(-1);textMotion.configure(mobile);updateIdle();queueRender()});
addEventListener('hashchange',()=>navigate(location.hash));
addEventListener('visibilitychange',()=>{if(document.hidden){idleVideo.pause();projectVideos.forEach(v=>v.pause());}else{activeProject=-1;updateIdle();queueRender();}});
layout();document.fonts.ready.then(()=>{layout();if(location.hash)navigate(location.hash,true)});updateIdle();
window.portfolio={get positions(){return positions},get activeProject(){return activeProject},render};
