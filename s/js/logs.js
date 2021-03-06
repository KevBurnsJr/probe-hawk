(function(ph) {
  
  // Logs
  if(window.document.getElementById('log-data')) {
    var uri = new Uri(window.location.href);
    var param = uri.getQueryParamValue('page');
    var page = param ? parseInt(param) : 1;
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/logs?page='+page).then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var html = '';
      for(i in data) {
        var isLocal = parseInt(data[i][4].slice(0,2), 16) & 0x00000010 ? 'is-local' : '';
        var isLocalTitle = isLocal ? " title='This is a locally administered mac address'" : "";
        html += "<tr>";
        html += "<td class='id'>"+data[i][0]+"</td>";
        html += "<td><a href='#'>"+data[i][1]+"</a></td>";
        html += "<td class='date' title='"+data[i][2]+"T"+data[i][3]+"+00:00'>"+moment(data[i][2]+"T"+data[i][3]+"+00:00").fromNow()+"</td>";
        html += "<td class='mac'><a href='#' class='"+isLocal+"'"+isLocalTitle+">"+data[i][4]+"</a></td>";
        html += "<td class='company'>"+(data[i][7] ? data[i][7] : '')+"</td>";
        html += "<td class='db'><a href='#'>"+(data[i][6] ? data[i][6] + " Network" + (data[i][6] == 1 ? "" : "s") : "")+"</a></td>";
        html += "<td class='db'>"+data[i][5]+"dB</td>";
        html += "</tr>";
      }
      window.document.getElementById('log-data').innerHTML = html;
      var html = '';
      html += "<p>Page "+page;
      html += "<a class='prev' href='?page="+Math.max(page-1, 1)+"'>Previous Page</a>";
      html += "<a class='next' href='?page="+(page+1)+"'>Next Page</a>";
      html += "</p>";
      window.document.getElementById('pagination').innerHTML = html;
      window.document.getElementById('pagination-top').innerHTML = html;
    });
  }

  // Daily Uniques
  if(window.document.getElementById('daily-data')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/daily-unique').then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var max = data.reduce(function(prev, cur) {
        return Math.max(cur[1], prev);
      }, 0);
      var html = '';
      for(i in data) {
        html += "<tr>";
        html += "<td class='date'><a href='#'>"+data[i][0]+"</a></td>";
        html += "<td><a href='#' class='bar'><span style='width: "+(data[i][1]/max)*100+"%;'></span></a></td>";
        html += "<td class='count'><a href='#'>"+data[i][1]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('daily-data').innerHTML = html;
    });
  }

  // Hourly Uniques
  if(window.document.getElementById('timely-data')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/hourly-unique').then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var max = data.reduce(function(prev, cur) {
        return Math.max(cur[1], prev);
      }, 0);
      var html = '';
      for(i in data) {
        html += "<tr>";
        html += "<td class='time'><a href='#' title='"+data[i][0]+"+00:00'>"+moment((new Date()).toISOString().substr(0,10)+"T"+data[i][0]+"+00:00").format("h A")+"</a></td>";
        html += "<td><a href='#' class='bar'><span style='width: "+(data[i][1]/max)*100+"%;'></span></a></td>";
        html += "<td class='count'><a href='#'>"+data[i][1]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('timely-data').innerHTML = html;
    });
  }

  // Weekday Uniques
  if(window.document.getElementById('weekday-data')) {
    ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/weekday-unique').then(function(xhr) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText));
        }
      });
    }).then(function(data){
      var max = data.reduce(function(prev, cur) {
        return Math.max(cur[1], prev);
      }, 0);
      var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      var html = '';
      for(i in data) {
        html += "<tr>";
        html += "<td class='day'><a href='#'>"+days[data[i][0]]+"</a></td>";
        html += "<td><a href='#' class='bar'><span style='width: "+(data[i][1]/max)*100+"%;'></span></a></td>";
        html += "<td class='count'><a href='#'>"+data[i][1]+"</a></td>";
        html += "</tr>";
      }
      window.document.getElementById('weekday-data').innerHTML = html;
    });
  }

})(ProbeHawk);