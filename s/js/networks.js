(function(ph) {
  
  // Networks
  if(window.document.getElementById('networks')) {
    var uri = new Uri(window.location.href);
    var param = uri.getQueryParamValue('page');
    var page = param ? parseInt(param) : 1;
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/networks?page='+page).then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var html = '';
      for(i in data) {
        html += "<tr>";
        html += "<td class='id'>"+data[i][0]+"</td>";
        html += "<td class='ssid'><a href='#'>"+data[i][1]+"</a></td>";
        html += "<td class='devices'><a href='#'>"+(data[i][2] ? data[i][2] + " Device" + (data[i][2] == 1 ? "" : "s") : "")+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('networks').innerHTML = html;
      var html = '';
      html += "<p>Page "+page;
      html += "<a class='prev' href='?page="+Math.max(page-1, 1)+"'>Previous Page</a>";
      html += "<a class='next' href='?page="+(page+1)+"'>Next Page</a>";
      html += "</p>";
      window.document.getElementById('pagination').innerHTML = html;
      window.document.getElementById('pagination-top').innerHTML = html;
    });
  }

  // Common Networks
  if(window.document.getElementById('most-requested-networks')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/networks/common').then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var max = data.reduce(function(prev, cur) {
        return Math.max(cur[2], prev);
      }, 0);
      var html = '';
      for(i in data) {
        html += "<tr>";
        html += "<td class='ssid'><a href='#'>"+data[i][1]+"</a></td>";
        html += "<td><a href='#' class='bar'><span style='width: "+(data[i][2]/max)*100+"%;'></span></a></td>";
        html += "<td class='count'><a href='#'>"+data[i][2]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('most-requested-networks').innerHTML = html;
    });
  }

})(ProbeHawk);