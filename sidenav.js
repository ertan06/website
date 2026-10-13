(function(){
  var side=document.querySelector('.side-nav');
  var bar=document.querySelector('.subnav');
  if(!side||!bar)return;
  var sideLinks=[].slice.call(side.querySelectorAll('a'));
  var barLinks=[].slice.call(bar.querySelectorAll('.subnav-links a'));
  var sideExtra=[side.querySelector('.side-label')];
  var barLabel=bar.querySelector('.subnav-label');
  var targets=sideLinks.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var hero=document.querySelector('.portfolio-hero,.teaching-hero,.research-hero');
  var wide=window.matchMedia('(min-width: 901px)');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mode='h',active=-1,ticking=false;
  var EASE='cubic-bezier(.65,0,.25,1)',DUR=650;

  function rects(list){return list.map(function(el){return el.getBoundingClientRect()})}
  // FLIP: make each element in `to` appear at the matching rect in `from`, then glide home
  function flip(to,from){
    if(reduce)return;
    to.forEach(function(el,i){
      var f=from[i];if(!f)return;
      var t=el.getBoundingClientRect();
      var dx=f.left-t.left,dy=(f.top+f.height/2)-(t.top+t.height/2);
      el.style.transition='none';
      el.style.transform='translate('+dx+'px,'+dy+'px)';
    });
    void side.offsetWidth;
    to.forEach(function(el,i){
      el.style.transition='transform '+DUR+'ms '+EASE+' '+(i*35)+'ms';
      el.style.transform='';
    });
    setTimeout(function(){to.forEach(function(el){el.style.transition='';el.style.transform=''})},DUR+to.length*35+50);
  }
  function toVertical(){
    var from=rects([barLabel].concat(barLinks));
    side.classList.add('is-visible');
    bar.classList.add('is-morphed');
    flip(sideExtra.concat(sideLinks),from);
    mode='v';
  }
  function toHorizontal(){
    var from=rects(sideExtra.concat(sideLinks));
    bar.classList.remove('is-morphed');
    side.classList.remove('is-visible');
    bar.classList.add('is-flipping');
    flip([barLabel].concat(barLinks),from);
    clearTimeout(bar._ft);
    bar._ft=setTimeout(function(){bar.classList.remove('is-flipping')},DUR+barLinks.length*35+80);
    mode='h';
  }
  function update(){
    ticking=false;
    if(!wide.matches){
      if(mode==='v'){bar.classList.remove('is-morphed');side.classList.remove('is-visible');mode='h'}
      return;
    }
    var hb=hero?hero.getBoundingClientRect().bottom:200-window.scrollY;
    var wantV=hb<-60;
    if(wantV&&mode==='h')toVertical();
    else if(!wantV&&mode==='v')toHorizontal();
    var idx=-1;
    targets.forEach(function(t,n){if(t&&t.getBoundingClientRect().top<=180)idx=n});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)idx=targets.length-1;
    if(idx!==active){
      active=idx;
      sideLinks.forEach(function(a,n){
        a.classList.toggle('is-active',n===idx);
        if(n===idx)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
      });
    }
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  sideLinks.forEach(function(a,n){
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
