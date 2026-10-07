(function(){
  var thumbs=[].slice.call(document.querySelectorAll('[data-lightbox]'));
  if(!thumbs.length)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ico=function(d){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'};
  var lb=document.createElement('div');
  lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Screenshot viewer');
  lb.innerHTML='<span class="lb-count" aria-live="polite"></span>'+
    '<button type="button" class="lb-btn lb-close" aria-label="Close">'+ico('<path d="M6 6l12 12M18 6 6 18"/>')+'</button>'+
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous screenshot">'+ico('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>')+'</button>'+
    '<button type="button" class="lb-btn lb-next" aria-label="Next screenshot">'+ico('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>')+'</button>'+
    '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>';
  document.body.appendChild(lb);
  var img=lb.querySelector('.lb-img'),cap=lb.querySelector('.lb-cap'),count=lb.querySelector('.lb-count');
  var prev=lb.querySelector('.lb-prev'),next=lb.querySelector('.lb-next'),close=lb.querySelector('.lb-close');
  var idx=0,isOpen=false,opener=null;
  if(thumbs.length<2){prev.hidden=true;next.hidden=true}

  function fromThumb(){
    var t=thumbs[idx].querySelector('img').getBoundingClientRect();
    var r=img.getBoundingClientRect();
    if(!r.width||!r.height)return '';
    var dx=(t.left+t.width/2)-(r.left+r.width/2),dy=(t.top+t.height/2)-(r.top+r.height/2);
    return 'translate('+dx+'px,'+dy+'px) scale('+(t.width/r.width)+','+(t.height/r.height)+')';
  }
  function show(i,animate){
    idx=(i+thumbs.length)%thumbs.length;
    var t=thumbs[idx];
    img.style.transition='none';img.style.transform='';img.style.opacity=animate?'1':'0';
    img.onload=function(){
      img.onload=null;
      if(animate&&!reduce){
        var f=fromThumb();
        img.style.transform=f;
        void img.offsetWidth;
        img.style.transition='';
        img.style.transform='none';
      }else{
        void img.offsetWidth;img.style.transition='';img.style.opacity='1';img.style.transform='none';
      }
    };
    img.src=t.dataset.src;img.alt=t.dataset.alt||'';
    cap.textContent=t.dataset.caption||'';
    count.textContent=thumbs.length>1?(idx+1)+' / '+thumbs.length:'';
    if(img.complete&&img.onload){img.onload()}
  }
  function open(i){
    opener=document.activeElement;isOpen=true;
    lb.classList.add('open');document.body.style.overflow='hidden';
    show(i,true);close.focus({preventScroll:true});
  }
  function shut(){
    if(!isOpen)return;isOpen=false;
    var f=reduce?'':fromThumb();
    lb.classList.remove('open');
    if(f){img.style.transform=f}
    document.body.style.overflow='';
    if(opener&&opener.focus)opener.focus({preventScroll:true});
  }
  thumbs.forEach(function(t,i){t.addEventListener('click',function(){open(i)})});
  close.addEventListener('click',shut);
  prev.addEventListener('click',function(){show(idx-1,false)});
  next.addEventListener('click',function(){show(idx+1,false)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-fig'))shut()});
  document.addEventListener('keydown',function(e){
    if(!isOpen)return;
    if(e.key==='Escape')shut();
    else if(e.key==='ArrowLeft'&&thumbs.length>1)show(idx-1,false);
    else if(e.key==='ArrowRight'&&thumbs.length>1)show(idx+1,false);
    else if(e.key==='Tab'){
      var f=[close,prev,next].filter(function(b){return !b.hidden});
      var a=document.activeElement,n=f.indexOf(a);
      e.preventDefault();
      f[(n+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  });
})();
