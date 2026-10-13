[].slice.call(document.querySelectorAll('.app-slider')).forEach(function(box){
  var track=box.querySelector('.app-slides');
  var n=track.children.length;
  var prev=box.querySelector('[data-dir="-1"]');
  var next=box.querySelector('[data-dir="1"]');
  var count=box.querySelector('.slider-count');
  var idx=0,startX=null;
  function render(){
    track.style.transform='translateX(-'+idx*100+'%)';
    count.textContent=(idx+1)+' / '+n;
    prev.disabled=idx===0;
    next.disabled=idx===n-1;
    [].slice.call(track.children).forEach(function(s,i){s.setAttribute('aria-hidden',i===idx?'false':'true')});
  }
  function go(i){idx=Math.min(Math.max(i,0),n-1);render()}
  prev.addEventListener('click',function(){go(idx-1)});
  next.addEventListener('click',function(){go(idx+1)});
  box.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){go(idx-1);e.preventDefault()}
    if(e.key==='ArrowRight'){go(idx+1);e.preventDefault()}
  });
  track.addEventListener('pointerdown',function(e){startX=e.clientX});
  track.addEventListener('pointerup',function(e){
    if(startX===null)return;
    var dx=e.clientX-startX;startX=null;
    if(Math.abs(dx)>40)go(idx+(dx<0?1:-1));
  });
  track.addEventListener('pointercancel',function(){startX=null});
  render();
});
