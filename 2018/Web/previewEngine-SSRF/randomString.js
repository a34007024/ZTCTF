function index(len = 10, text = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"){
  var result = "";
  for(var i=0;i<len;i++){
    var random = ~~(Math.random()*text.length);
    result+=text[random];
  }
  return result;
}
module.exports = index;