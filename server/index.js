/*jshint node:true*/
const express = require('express');
const path = require('path');
module.exports = function(app) {
  app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));
  app.get('/', (req, res) => res.redirect('/dist/tests/'));
};
