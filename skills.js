(function(){
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
  var tiles=[].slice.call(document.querySelectorAll('.cat-tile'));
  tiles.forEach(function(t){
    t.addEventListener('click',function(){
      var wasOpen=t.getAttribute('aria-expanded')==='true';
      tiles.forEach(function(x){
        var on=x===t&&!wasOpen;
        x.setAttribute('aria-expanded',on?'true':'false');
        var d=document.getElementById(x.getAttribute('aria-controls'));
        if(d)d.hidden=!on;
      });
    });
  });
})();
