//for exporting anything we need module.exports or exports
exports.getDate = function() {
  const today = new Date();

  //formatting Date
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  return today.toLocaleDateString("en-US", options);
};



//for exporting getDay function as getDay
exports.getDay = function() {
  const today = new Date();

  //formatting Date
  const options = {
    weekday: 'long',
  }

  return today.toLocaleDateString("en-US", options);

};
