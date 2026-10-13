(function(){
  var side=document.querySelector('.side-nav');
  if(!side)return;
  var links=[].slice.call(side.querySelectorAll('a'));
  var targets=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var hero=document.querySelector('.portfolio-hero,.teaching-hero,.research-hero');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var active=-1,ticking=false;
  function update(){
    ticking=false;
    var hb=hero?hero.getBoundingClientRect().bottom:200-window.scrollY;
    side.classList.toggle('is-visible',hb<window.innerHeight*0.55);
    var idx=-1;
    targets.forEach(function(t,n){if(t&&t.getBoundingClientRect().top<=180)idx=n});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)idx=targets.length-1;
    if(idx!==active){
      active=idx;
      links.forEach(function(a,n){
        a.classList.toggle('is-active',n===idx);
        if(n===idx)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
      });
    }
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  links.forEach(function(a,n){
    a.addEventListener('click',function(e){
      var t=targets[n];if(!t)return;
      e.preventDefault();
      t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
      if(history.replaceState)history.replaceState(null,'',a.getAttribute('href'));
    });
  });
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',req);
  update();
})();
