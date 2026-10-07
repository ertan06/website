(function(){
  var stage=document.querySelector('.pf-stage');
  if(!stage)return;
  var slides=[].slice.call(stage.querySelectorAll('.pf-slide'));
  var items=[].slice.call(document.querySelectorAll('.pf-item'));
  var n=slides.length,active=0,timer=null,start=0,raf=0,paused=false,DUR=4800;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function layout(){
    slides.forEach(function(s,i){
      var off=(i-active+n)%n;
      var pos=off===n-1?'exit':String(Math.min(off,4));
      s.dataset.pos=pos;
      s.tabIndex=off===0?0:-1;
      s.setAttribute('aria-hidden',off===0?'false':'true');
    });
    items.forEach(function(b,i){
      b.classList.toggle('is-active',i===active);
      b.style.setProperty('--p',0);
    });
  }
  function tick(t){
    if(paused){start=t-(parseFloat(items[active].style.getPropertyValue('--p'))||0)*DUR;}
    var p=Math.min(1,(t-start)/DUR);
    items[active].style.setProperty('--p',p);
    if(p>=1){go((active+1)%n);return}
    raf=requestAnimationFrame(tick);
  }
  function play(){
    cancelAnimationFrame(raf);
    if(reduce)return;
    start=performance.now();
    raf=requestAnimationFrame(tick);
  }
  function go(i){
    active=i;layout();play();
  }
  items.forEach(function(b){b.addEventListener('click',function(){go(+b.dataset.index)})});
  slides.forEach(function(s,i){
    s.addEventListener('click',function(e){
      if(i!==active){e.preventDefault();go(i)}
    });
  });
  [stage,document.querySelector('.pf-list')].forEach(function(el){
    el.addEventListener('mouseenter',function(){paused=true});
    el.addEventListener('mouseleave',function(){paused=false});
    el.addEventListener('focusin',function(){paused=true});
    el.addEventListener('focusout',function(){paused=false});
  });
  document.addEventListener('visibilitychange',function(){paused=document.hidden});
  layout();play();
})();
