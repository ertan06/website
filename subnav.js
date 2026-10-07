(function(){
  var bar=document.querySelector('.subnav');
  if(!bar)return;
  var list=bar.querySelector('.subnav-links');
  var links=[].slice.call(list.querySelectorAll('a'));
  var indicator=list.querySelector('.subnav-indicator');
  var progress=bar.querySelector('.subnav-progress');
  var topBtn=bar.querySelector('.subnav-top');
  var content=document.getElementById('content');
  var targets=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STICK=80, active=-1, ticking=false;

  function moveIndicator(i){
    if(i<0){indicator.style.opacity='0';return}
    var a=links[i];
    indicator.style.opacity='1';
    indicator.style.width=a.offsetWidth+'px';
    indicator.style.transform='translateX('+a.offsetLeft+'px)';
  }
  function setActive(i){
    if(i===active)return;
    active=i;
    links.forEach(function(a,n){
      if(n===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    });
    moveIndicator(i);
    if(i>=0){
      var a=links[i];
      list.scrollTo({left:a.offsetLeft-(list.clientWidth-a.offsetWidth)/2,behavior:reduce?'auto':'smooth'});
    }
  }
  function update(){
    ticking=false;
    var y=window.scrollY;
    var barH=bar.offsetHeight;
    var line=STICK+barH+24;
    var idx=-1;
    targets.forEach(function(t,n){if(t&&t.getBoundingClientRect().top<=line)idx=n});
    if(window.innerHeight+y>=document.documentElement.scrollHeight-4)idx=targets.length-1;
    setActive(idx);
    bar.classList.toggle('is-stuck',bar.getBoundingClientRect().top<=STICK+0.5);
    var start=content.offsetTop,end=content.offsetTop+content.offsetHeight-window.innerHeight;
    var p=end>start?Math.min(1,Math.max(0,(y-start)/(end-start))):0;
    progress.style.transform='scaleX('+p+')';
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}

  links.forEach(function(a,n){
    a.addEventListener('click',function(e){
      var t=targets[n];if(!t)return;
      e.preventDefault();
      t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
      if(history.replaceState)history.replaceState(null,'',a.getAttribute('href'));
      setActive(n);
    });
  });
  topBtn.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    if(history.replaceState)history.replaceState(null,'',location.pathname);
  });
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',function(){moveIndicator(active);req()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){moveIndicator(active);req()});
  update();
})();
