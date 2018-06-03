const crypto = require('crypto');
const http = require('http');

const qs = require('querystring');
const url = require('url');

const fs = require('fs');

var routeRequest = [];
var notFoundPage = fs.readFileSync("404.html", 'utf8');

var log;

fs.exists(__dirname+'/log', function (exists) {
  if(!exists){
    fs.mkdir(__dirname+'/log',0644, function(err){
      if(err)throw err;
    });
    log = fs.createWriteStream(`${__dirname}/log/log_${Number(new Date())}`,{
      encoding: 'utf8'
    });
  }else{
    log = fs.createWriteStream(`${__dirname}/log/log_${Number(new Date())}`,{
      encoding: 'utf8'
    });
  }
});

function route(req, res){
  log.write(`${req.method} ${req.url} "${req.headers['user-agent']}"\r\n`);
  // console.log(req);
	console.log(`${req.method} ${req.url}`);
  switch(req.method){
    case 'GET':
      return getMiddleware(req, res);
    break;
    case 'POST':
      return postMiddleware(req, res);
    break;
  }
}

function getMiddleware(req, res){
  var q = url.parse(req.url, true);
  req.query = q.query;
  req.pathname = q.pathname;
  request(req, res);
}

function postMiddleware(req, res){
  var body = '';
  req.on('data', function (data) {
    body += data;
    if(body.length>1e6)
      req.connection.destroy();
  });
  req.on('end', function(){
    req.post = qs.parse(body);
    getMiddleware(req, res);
  });
}

function request(req, res){
  var routeFunc = routeRequest[req.pathname];
  if(routeFunc===undefined){
    return res.end("Opps...");
  }else
    return routeFunc(req, res);
}

function use(dir, func){
  return routeRequest[dir] = func;
}


exports.use = use;
exports.route = route;
