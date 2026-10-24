'use strict';
window.createTextMotion=(cards,reduced)=>{
 const gsap=window.gsap;
 if(!gsap)return {configure(){},project(){},contact(){}};
 const select='.tags,h2,.subtitle,.website-link,.case-body h3,.case-body p,.case-body ul';
 const contactSelect='h2,.availability,.services,.contact-links';
 const desktopContact=document.querySelector('.desktop-contact'),mobileContact=document.querySelector('.mobile-contact .contact-content');
 const groups=cards.map(c=>[...c.querySelectorAll(select)]);
 const all=[...groups.flat(),...desktopContact.querySelectorAll(contactSelect),...mobileContact.querySelectorAll(contactSelect)];
 let mode,reduce,observer,timelines=[],contactTimeline,firstObserved=false;
 const from={opacity:0,filter:'blur(10px)',y:6};
 const to={opacity:1,filter:'blur(0px)',y:0,duration:.7,ease:'power2.out'};
 const reveal=(t,p)=>{if(!t)return;if(p>0)t.play();else if(p<0)t.pause(0);};
 const timeline=targets=>gsap.timeline({paused:true}).fromTo(targets,from,{...to,stagger:.045});
 return {
  configure(mobile){
   if(mode===mobile&&reduce===reduced.matches)return;
   mode=mobile;reduce=reduced.matches;observer?.disconnect();timelines.forEach(t=>t.kill());contactTimeline?.kill();gsap.killTweensOf(all);gsap.set(all,{clearProps:'opacity,filter,transform'});timelines=[];contactTimeline=null;firstObserved=false;
   if(reduce)return;
   if(mobile){
    const targets=[...groups.flat(),...mobileContact.querySelectorAll(contactSelect)];
    gsap.set(targets,from);
    observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){gsap.to(entry.target,{...to,clearProps:'opacity,filter,transform'});observer.unobserve(entry.target);}},{rootMargin:'0px 0px -6% 0px',threshold:.01});
    targets.filter(el=>!groups[0].includes(el)).forEach(el=>observer.observe(el));
   }else{timelines=groups.map(timeline);contactTimeline=timeline([...desktopContact.querySelectorAll(contactSelect)]);}
  },
  project(i,p){if(mode&&!reduce&&i===0&&p>0&&!firstObserved){firstObserved=true;groups[0].forEach(el=>observer.observe(el));}reveal(timelines[i],p);},
  contact(p){reveal(contactTimeline,p>0?p:-1);}
 };
};
