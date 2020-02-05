/* eslint-env node */
var RouteRecognizer = require("../../dist/route-recognizer");
var Normalizer = RouteRecognizer.Normalizer;

var paths = {
  complex:
    "/foo/" +
    encodeURIComponent("http://example.com/index.html?foo=bar&baz=faz#hashtag"),
  simple: "/post/123",
  medium: "/abc%3Adef"
};

module.exports = [
  {
    name: "Normalize Complex",
    fn: function() {
      Normalizer.normalizePath(paths.complex);
    }
  },
  {
    name: "Normalize Simple",
    fn: function() {
      Normalizer.normalizePath(paths.simple);
    }
  },
  {
    name: "Normalize Medium",
    fn: function() {
      Normalizer.normalizePath(paths.medium);
    }
  }
];
