var http = require('http');
var fs = require('fs');
var express = require('express');
var fileUpload = require('express-fileupload');
var mysql      = require('mysql');
var Promise = require('promise');

var app = express();

app.use(fileUpload());
app.use('/s', express.static(__dirname + '/s'));

var port = process.env.PORT || 1337;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'probe_hawk',
  password : 'dOimOvGUpk98n0kv',
  charset  : 'utf8_general_ci',
  database : "probe_hawk"
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html');
});

app.post('/load', function (req, res) {
  if (!req.files || !req.files.file) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.send('No file was uploaded.');
    return;
  }
  var file = req.files.file;
  if (!req.body.agent) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.send('Please select an agent.');
    return;
  }
  var agent_id = req.body.agent;
  file.mv('uploads/'+file.name, function(err) {
    var lineReader = require('readline').createInterface({
      terminal: false,
      input: fs.createReadStream('uploads/'+file.name)
    });
    processLog(lineReader, agent_id).then(function(){
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('ok');
      fs.unlink('uploads/'+file.name);
    });
  });
});

app.post('/load-direct', function (req, res) {
  if (!req.query.agent) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.send('Please select an agent.');
    return;
  }
  var agent_id = req.query.agent;
  var filename = 'tmp'+Math.random();
  fs.writeFile('uploads/'+filename, req.body, function(err) {
    var lineReader = require('readline').createInterface({
      terminal: false,
      input: fs.createReadStream('uploads/'+filename)
    });
    processLog(lineReader, agent_id).then(function(){
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('ok');
      fs.unlink('uploads/'+filename);
    });
  });
});

app.get('/data/logs', function(req, res){
  var q = 'SELECT date, time, agents.name, devices.mac, signal_strength from logs ' +
    'LEFT JOIN devices on logs.device_id = devices.id ' +
    'LEFT JOIN agents on logs.agent_id = agents.id ' + 
    'ORDER BY date desc, time desc ' + 
    'LIMIT 100';
  connection.query(q, function(err, result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    for(i in result) {
      result[i].date = result[i].date.toISOString().substr(0,10);
    }
    res.end(JSON.stringify(result.map(function(o){return[o.name,o.date,o.time,o.mac,o.signal_strength];})));
  });
});

app.get('/data/daily-unique', function(req, res){
  var q = 'SELECT date, count(DISTINCT device_id) as count from logs ' +
    'LEFT JOIN agents on logs.agent_id = agents.id ' + 
    'GROUP BY date ' + 
    'ORDER BY date desc ' + 
    'LIMIT 100';
  connection.query(q, function(err, result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    for(i in result) {
      result[i].date = result[i].date.toISOString().substr(0,10);
    }
    res.end(JSON.stringify(result.map(function(o){return[o.date, o.count];})));
  });
});

app.get('/data/hourly-unique', function(req, res){
  var q = 'SELECT TIME_FORMAT(time, "%H:00:00") as time, count(DISTINCT device_id) as count from logs ' +
    'LEFT JOIN agents on logs.agent_id = agents.id ' + 
    'GROUP BY TIME_FORMAT(time, "%H") ' + 
    'ORDER BY time asc ' + 
    'LIMIT 24';
  connection.query(q, function(err, result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.map(function(o){return[o.time, o.count];})));
  });
});

app.get('/data/weekday-unique', function(req, res){
  var q = 'SELECT WEEKDAY(date) as weekday, count(DISTINCT device_id) as count from logs ' +
    'LEFT JOIN agents on logs.agent_id = agents.id ' + 
    'GROUP BY WEEKDAY(date) ' + 
    'ORDER BY WEEKDAY(date) asc ' + 
    'LIMIT 7';
  connection.query(q, function(err, result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.map(function(o){return[o.weekday, o.count];})));
  });
});

app.listen(port, function () {
  console.log('App listening on port '+port+'!');
});

function processLog(lineReader, agent_id) {
  return new Promise(function(fulfill, reject) {
    var last_seen = {};
    var m;
    var logs = [];
    var devices_networks = [];
    lineReader.on('line', function (line) {
      if(m = line.match(/^([0-9-]+) ([0-9:]+)(\.[0-9]+) .* ([0-9-]+dB) .* SA:([0-9a-f:]+) .* Probe Request \(([^\)]+)?\).*/)) {
        var date    = m[1];
        var time    = m[2];
        var micro   = m[3];
        var sig     = m[4];
        var mac     = m[5];
        var network = typeof m[6] == 'undefined' ? null : m[6];
        var ts      = (new Date(date + ' ' + time + micro)).getTime();
        if(network) {
          devices_networks.push([mac, network]);
        }
        if(!(mac in last_seen) || ts > last_seen[mac] + 1000) {
          last_seen[mac] = ts;
          logs.push([date, time, sig, mac]);
        }
      }
    });
    var uniq = function(arr) {
      return arr.filter(function(elem, pos) {
        return arr.indexOf(elem) === pos;
      });
    };
    var check_exists = function(table, clauses) {
      var vals = [];
      var keys = Object.keys(clauses);
      for(i in keys) {
        vals.push(clauses[keys[i]]);
      };
      return new Promise(function(fulfill, reject) {
        connection.query('SELECT id FROM '+table+' WHERE '+keys.join(' = ? AND ')+' = ?',vals, function(err, result) {
          fulfill(result.length ? result[0].id : null);
        });
      });
    };
    lineReader.on('close', function () {
      
      var devices = [];
      for(i in devices_networks) {
        devices.push(devices_networks[i][0]);
      }
      devices = uniq(devices);
      
      var networks = [];
      for(i in devices_networks) {
        networks.push(devices_networks[i][1]);
      }
      networks = uniq(networks);
      
      var device_ids = {};
      var network_ids = {};
      
      // Write devices to db
      var insert_devices = function(devices, done) {
        if(!devices.length) {
          return done();
        }
        var mac = devices.splice(0,1)[0];
        var proceed = function(id) {
          device_ids[mac] = id;
          insert_devices(devices, done);
        };
        check_exists('devices', {mac: mac})
          .then(function(id){
            if(id) {
              proceed(id);
            } else {
              connection.query('INSERT INTO devices (mac, created) VALUES (?, NOW())', [mac], function(err, res) {
                proceed(res.insertId);
              });
            }
          });
      };
      
      // Write networks to db
      var insert_networks = function(networks, done) {
        if(!networks.length) {
          return done();
        }
        var ssid = networks.splice(0,1)[0];
        var proceed = function(id) {
          network_ids[ssid] = id;
          insert_networks(networks, done);
        };
        check_exists('networks', {ssid: ssid})
          .then(function(id){
            if(id) {
              proceed(id);
            } else {
              connection.query('INSERT INTO networks (ssid, created) VALUES (?, NOW())', [ssid], function(err, res) {
                proceed(res.insertId);
              });
            }
          });
      };
      
      // Write device network relationship to db
      var insert_devices_networks = function(devices_networks, done) {
        if(!devices_networks.length) {
          return done();
        }
        var device_network = devices_networks.splice(0,1)[0];
        var mac = device_network[0];
        var ssid = device_network[1];
        check_exists('devices_networks', {device_id: device_ids[mac], network_id: network_ids[ssid]})
          .then(function(id){
            if(!id) {
              connection.query('INSERT INTO devices_networks (device_id, network_id, created) VALUES (?, ?, NOW())', [device_ids[mac], network_ids[ssid]]);
            }
          })
          .done(function(){
            insert_devices_networks(devices_networks, done);
          });
      };
      
      // Write logs to db
      var insert_logs = function(logs, done) {
        if(!logs.length) {
          return done();
        }
        var log = logs.splice(0,1)[0];
        var mac = log[3];
        connection.query('INSERT INTO logs (agent_id, device_id, signal_strength, date, time) VALUES (?, ?, ?, ?, ?)', [agent_id, device_ids[mac], log[2], log[0], log[1]], function(err, result) {
          insert_logs(logs, done);
        });
      };
      
      insert_devices(devices, function(){
        insert_networks(networks, function(){
          insert_devices_networks(devices_networks, function(){
            insert_logs(logs, fulfill);
          });
        });
      });
    });
  });
}