var ProbeHawk = (function(ph){
  "use strict";

  var debug = true;

  ph.debug = function(){
    return debug;
  };

  ph.extend = function(target, obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  };

  ph.promise = function(f) {
    var p = new Promise(f);
    if(ph.debug()) {
      p.catch(function(e){
        ph.trace(e);
      });
    }
    return p;
  };

  ph.trace = function(e) {
    if('console' in window && ph.debug()) {
      window.console.trace(e);
    }
  };

  return ph;

})(ProbeHawk || {});
