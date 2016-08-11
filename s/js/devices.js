(function(ph) {
  
  // Devices
  if(window.document.getElementById('devices')) {
    var uri = new Uri(window.location.href);
    var param = uri.getQueryParamValue('page');
    var page = param ? parseInt(param) : 1;
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/devices?page='+page).then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var html = '';
      for(i in data) {
        var networks = [];
        for(j in data[i][2]) {
          networks.push('<a href="/networks/'+encodeURIComponent(data[i][2][j])+'">'+data[i][2][j]+'</a>');
        }
        var isLocal = parseInt(data[i][1].slice(0,2), 16) & 0x00000010 ? 'is-local' : '';
        var isLocalTitle = isLocal ? " title='This is a locally administered mac address'" : "";
        html += "<tr>";
        html += "<td class='id'>"+data[i][0]+"</td>";
        html += "<td class='mac'><a href='#' class='"+isLocal+"'"+isLocalTitle+">"+data[i][1]+"</a></td>";
        html += "<td class='company'>"+(data[i][3] ? data[i][3] : '')+"</td>";
        html += "<td class='networks'>"+networks.join("<br/>")+"</td>";
        html += "</tr>";
      }
      window.document.getElementById('devices').innerHTML = html;
      var html = '';
      html += "<p>Page "+page;
      html += "<a class='prev' href='?page="+Math.max(page-1, 1)+"'>Previous Page</a>";
      html += "<a class='next' href='?page="+(page+1)+"'>Next Page</a>";
      html += "</p>";
      window.document.getElementById('pagination').innerHTML = html;
      window.document.getElementById('pagination-top').innerHTML = html;
    });
  }

  // Common Devices
  if(window.document.getElementById('most-common-devices')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/devices/common').then(function(xhr) {
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
        var isLocal = parseInt(data[i][1].slice(0,2), 16) & 0x00000010 ? 'is-local' : '';
        var isLocalTitle = isLocal ? " title='This is a locally administered mac address'" : "";
        html += "<tr>";
        html += "<td class='mac date'><a href='#' class='"+isLocal+"'"+isLocalTitle+">"+data[i][1]+"</a></td>";
        html += "<td><a href='#' class='bar'><span style='width: "+(data[i][2]/max)*100+"%;'></span></a></td>";
        html += "<td class='count'><a href='#'>"+data[i][2]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('most-common-devices').innerHTML = html;
    });
  }

  // Last Seen Devices
  if(window.document.getElementById('last-seen-devices')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/devices/last-seen').then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var max = data.reduce(function(prev, cur) {
        return Math.max(cur[2], prev);
      }, 0);
      var html = '';
      var date = '';
      for(i in data) {
        var isLocal = parseInt(data[i][1].slice(0,2), 16) & 0x00000010 ? 'is-local' : '';
        var isLocalTitle = isLocal ? " title='This is a locally administered mac address'" : "";
        if(date != data[i][2]) {
          html += "<tr><th colspan='2'>"+data[i][2]+"</th></tr>";
          date = data[i][2];
        }
        html += "<tr>";
        html += "<td class='mac'><a href='#' class='"+isLocal+"'"+isLocalTitle+">"+data[i][1]+"</a></td>";
        html += "<td><a href='#'>"+data[i][3]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('last-seen-devices').innerHTML = html;
    });
  }

})(ProbeHawk);