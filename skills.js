(function(){
  var tabs=[].slice.call(document.querySelectorAll('.skill-tab'));
  var items=[].slice.call(document.querySelectorAll('.skill'));
  if(!tabs.length)return;
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
