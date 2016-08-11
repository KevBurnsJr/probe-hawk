var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'probe_hawk',
  password : 'dOimOvGUpk98n0kv',
  charset  : 'utf8_general_ci',
  database : "probe_hawk"
});

var createParser = function(done) {
  return parse({delimiter: ','}, function (err, data) {
      var first = true;
      async.eachSeries(data, function (line, callback) {
        if(first) {
          first = false;
          return callback();
        }
        line[1] = line[1].match(/.{1,2}/g).join(':');
        connection.query('INSERT IGNORE INTO companies (registry, oui, name, address) VALUES (?, ?, ?, ?)', line, function(err, res) {
          if(err) {
            console.log(err);
          }
          callback();
        });
      }, done);
    });
};
fs.createReadStream('oui.csv').pipe(createParser(function(){
  fs.createReadStream('mam.csv').pipe(createParser(function(){
    fs.createReadStream('oui36.csv').pipe(createParser(function(){
      console.log('done');
      process.exit();
    }));
  }));
}));
