(function(){
  var stack=document.getElementById('hbStack');
  if(!stack)return;
  var viewport=stack.querySelector('.hb-viewport');
  var pages=[].slice.call(stack.querySelectorAll('.hb-page'));
  var prev=stack.querySelector('[data-dir="-1"]');
  var next=stack.querySelector('[data-dir="1"]');
  var count=stack.querySelector('.stack-count');
  var idx=0,startX=null,swiped=false;

  function render(){
    pages.forEach(function(p,i){
      var off=i-idx,c=Math.max(-2,Math.min(2,off));
      p.style.setProperty('--o',c);
      p.style.setProperty('--a',Math.abs(c));
      p.style.zIndex=10-Math.abs(off);
      p.classList.toggle('is-active',off===0);
      p.classList.toggle('is-far',Math.abs(off)>2);
      p.tabIndex=off===0?0:-1;
      p.setAttribute('aria-hidden',off===0?'false':'true');
    });
    count.textContent=(idx+1)+' / '+pages.length;
    prev.disabled=idx===0;
    next.disabled=idx===pages.length-1;
  }
  function go(n){idx=Math.min(Math.max(n,0),pages.length-1);render()}

  prev.addEventListener('click',function(){go(idx-1)});
  next.addEventListener('click',function(){go(idx+1)});
  // runs before the lightbox handler: only the front page opens the viewer
  stack.addEventListener('click',function(e){
    var p=e.target.closest('.hb-page');
    if(!p)return;
    var i=pages.indexOf(p);
    if(swiped){swiped=false;e.stopPropagation();return}
    if(i!==idx){e.stopPropagation();go(i)}
  },true);
  stack.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){go(idx-1);e.preventDefault()}
    if(e.key==='ArrowRight'){go(idx+1);e.preventDefault()}
  });
  viewport.addEventListener('pointerdown',function(e){startX=e.clientX});
  viewport.addEventListener('pointerup',function(e){
    if(startX===null)return;
    var dx=e.clientX-startX;startX=null;
    if(Math.abs(dx)>40){swiped=true;go(idx+(dx<0?1:-1))}
  });
  viewport.addEventListener('pointercancel',function(){startX=null});
  render();
})();
