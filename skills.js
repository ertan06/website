(function(){
  var tabs=[].slice.call(document.querySelectorAll('.skill-tab'));
  var items=[].slice.call(document.querySelectorAll('.skill'));
  var more=document.querySelector('.strip-more');
  var panel=document.getElementById('skills-panel');
  if(more&&panel){
    var label=more.querySelector('.strip-more-label');
    more.addEventListener('click',function(){
      var open=more.getAttribute('aria-expanded')!=='true';
      more.setAttribute('aria-expanded',open?'true':'false');
      label.textContent=open?'Less':'More';
      panel.classList.toggle('is-open',open);
      if(open)panel.removeAttribute('inert');else panel.setAttribute('inert','');
    });
  }
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      var f=t.dataset.filter;
      tabs.forEach(function(x){
        var on=x===t;
        x.classList.toggle('is-active',on);
        x.setAttribute('aria-pressed',on?'true':'false');
      });
      items.forEach(function(it){
        it.classList.toggle('is-dim',f!=='all'&&it.dataset.cat!==f);
      });
    });
  });
})();
