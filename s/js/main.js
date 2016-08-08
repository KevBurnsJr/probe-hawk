(function(ph) {
  // Logs
  ph.promise(function(fulfill, reject) {
      ph.xhr.get('/data/logs').then(function(xhr) {
      if (xhr.status === 200) {
        fulfill(JSON.parse(xhr.responseText));
      }
    });
  }).then(function(data){
    var html = '';
    for(i in data) {
      html += "<tr>";
      html += "<td><a href='#'>"+data[i][0]+"</a></td>";
      html += "<td>"+data[i][1]+" "+data[i][2]+"</td>";
      html += "<td><a href='#'>"+data[i][3]+"</a></td>";
      html += "<td>"+data[i][4]+"dB</td>";
      html += "</tr>";
    }
    var el = window.document.getElementById('data');
    el.innerHTML = html;
  });

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