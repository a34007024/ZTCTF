const request = require('request');
const http = require('http');
const app = require('./core');
const fs = require('fs');
const indexPage = fs.readFileSync("index.html", 'utf8');
const adminPage = fs.readFileSync("index-admin.html", 'utf8');
const notFoundPage = fs.readFileSync("404.html", 'utf8');

const userAgent = 'SSRF-CTF-request key:'+require('./randomString')();

const serverPort = 3032;

app.use('/', function(req, res){
  if(req.headers['user-agent']!==userAgent){
    res.end(indexPage);
  }else{
    res.end(adminPage);
  }
});

app.use('/setting', function(req, res){
  res.writeHead(403, {'access': 'false'});
  if(req.headers['user-agent']!==userAgent){
    res.end("no access");
  }else{
    res.end("flag: ZTCTF{2018_06_U_know_Sérvêr_S1dë-Reqùêst-F0rgéry?}");
  }
});

app.use('/view', (req, res)=>{
  var url = req.query.u;
  const check = /^(((ht|f){1}(tp:[/][/]){1})|((www.){1}))[-a-zA-Z0-9@:%_\+.~#?&//=]+$/;
  if(check.test(req.query.u)){
    var options = {
      url:url,
      headers:{
        'User-Agent':userAgent
      }
    }
    request(options, (e,r,d)=>{
      res.end(e||!d?"null":d);
    })
  }else{
    res.end("null");
  }
});

app.use('/hint', (req, res)=>{
  var hid = parseInt(req.query.n);
  var hintMessage = "";
  switch(hid){
    case 1:
      hintMessage = `<b>Server site have some user logged in</b>
      <br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 2:
      hintMessage = `<b>Sometimes administrators can only access from local</b>
      <br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 3:
      hintMessage = `<b>Try to query the page for 127.0.0.1</b>
      <br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 4:
      hintMessage = `<b>This is Server-Side Request Forgery exploit</b><br /><a href="/hint?n=${hid+1}">more</a>`;
    break;
    case 5:
      hintMessage = `<b>try use SSRF on /view?u={local ip}</b><br />`;
    break;
    default: hintMessage = `<b>you need some access</b><br />
    <a href="/hint?n=1">more</a>`;
  }
  res.end(hintMessage);
});

http.createServer(app.route).listen(serverPort);