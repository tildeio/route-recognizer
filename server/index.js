/*jshint node:true*/

module.exports = function(app) {
  app.get('/', (req, res) => res.redirect('/tests/'));
};
