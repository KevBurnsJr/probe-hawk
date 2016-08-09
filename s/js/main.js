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
        html += "<tr>";
        html += "<td>"+data[i][0]+"</td>";
        html += "<td><a href='#'>"+data[i][1]+"</a></td>";
        html += "<td class='date'>"+data[i][2]+" "+data[i][3]+"</td>";
        html += "<td class='mac'><a href='#'>"+data[i][4]+"</a></td>";
        html += "<td class='db'>"+data[i][5]+"dB</td>";
        html += "</tr>";
      }
      var el = window.document.getElementById('log-data');
      el.innerHTML = html;
      var html = '';
      html += "<p>Page "+page;
      html += "<a class='prev' href='?page="+Math.max(page-1, 1)+"'>Previous Page</a>";
      html += "<a class='next' href='?page="+(page+1)+"'>Next Page</a>";
      html += "</p>";
      window.document.getElementById('pagination').innerHTML = html;
      window.document.getElementById('pagination-top').innerHTML = html;
    });
  }
  
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
        html += "<tr>";
        html += "<td class='id'>"+data[i][0]+"</td>";
        html += "<td class='mac'><a href='#'>"+data[i][1]+"</a></td>";
        html += "<td>"+networks.join("<br/>")+"</td>";
        html += "</tr>";
      }
      var el = window.document.getElementById('devices');
      el.innerHTML = html;
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
    var el = window.document.getElementById('daily-data');
    el.innerHTML = html;
  });

  // Hourly Uniques
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
      html += "<td class='time'><a href='#'>"+data[i][0]+"</a></td>";
      html += "<td><a href='#' class='bar'><span style='width: "+(data[i][1]/max)*100+"%;'></span></a></td>";
      html += "<td class='count'><a href='#'>"+data[i][1]+"</a></td>";
      html += "</tr>";
    }
    var el = window.document.getElementById('timely-data');
    el.innerHTML = html;
  });

  // Weekday Uniques
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
    var el = window.document.getElementById('day-week-data');
    el.innerHTML = html;
  });

})(ProbeHawk);