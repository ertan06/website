(function(){
  var more=document.querySelector('.nav-more');
  if(!more)return;
  var btn=more.querySelector('.nav-more-btn');
  btn.addEventListener('click',function(e){e.stopPropagation();btn.setAttribute('aria-expanded',more.classList.toggle('open'))});
  document.addEventListener('click',function(e){if(!more.contains(e.target)){more.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){more.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
})();
