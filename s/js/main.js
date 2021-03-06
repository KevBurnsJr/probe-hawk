(function(ph) {
  
  var activePrimaryNav = function() {
    var els = window.document.querySelectorAll('#header a');
    var href = '/'+window.location.href.split('/').slice(3).join('/');
    var active = null;
    for(i in els) {
      if(typeof els[i] != 'object' || !'nodeName' in els[i] || els[i].nodeName != 'A') continue;
      var a_href = els[i].getAttribute('href');
      if(href.indexOf(a_href) === 0 && href.length >= a_href.length) {
        active = els[i];
      }
    }
    if(active) {
      active.classList.add('active');
    }
  };
  activePrimaryNav();

})(ProbeHawk);