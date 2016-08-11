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

var q = 'UPDATE devices as d '+
  'LEFT JOIN companies as c ON ( ' +
  '	   c.oui = left(d.mac,8) ' +
  '	OR c.oui = left(d.mac,10) ' +
  '	OR c.oui = left(d.mac,11) ' +
  '	OR c.oui = left(d.mac,13) ' +
  ') SET d.company_id = c.id;';

connection.query(q, [], function(err, res) {
  if(err) {
    console.log(err);
  }
  console.log('done');
  process.exit();
});