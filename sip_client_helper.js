module.exports.replace_values = function (string,hash) {

  var replacement_string = string;
  var regex;

  Object.keys(hash).forEach( function (key) {
    regex = new RegExp( '\\$' + key.toUpperCase(), 'g' );
    replacement_string = replacement_string.replace( regex, hash[key] );
  });

  return replacement_string;

}
  
module.exports.random_number = function () {
  return Math.floor( Math.random() * Date.now() ).toString(10);
}

module.exports.md5_sum = function (input) {
  return require('crypto').createHash('md5').update(input).digest('hex') + "";
}
