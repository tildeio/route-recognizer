/* globals QUnit */

import RouteRecognizer from 'route-recognizer';

var Normalizer = RouteRecognizer.Normalizer;

module("Normalization");

var expectations = [{
  paths: ["/foo/bar"],
  normalized: "/foo/bar"
}, {
  paths: ["/foo%3Abar", "/foo%3abar"],
  normalized: "/foo:bar"
}, {
  paths: ["/foo%2fbar", "/foo%2Fbar"],
  normalized: "/foo%2Fbar"
}, {
  paths: ["/café", "/caf%C3%A9", "/caf%c3%a9"],
  normalized: "/café"
}, {
  paths: ["/abc%25def"],
  normalized: "/abc%25def"
}, {
  paths: ["/" + encodeURIComponent("http://example.com/index.html?foo=100%&baz=boo#hash")],
  normalized: "/http:%2F%2Fexample.com%2Findex.html?foo=100%25&baz=boo#hash"
}, {
  paths: ["/%25%25%25%25"],
  normalized: "/%25%25%25%25"
}, {
  paths: ["/%25%25%25%25%3A%3a%2F%2f%2f"],
  normalized: "/%25%25%25%25::%2F%2F%2F"
}];

expectations.forEach(function(expectation) {
  var paths = expectation.paths;
  var normalized = expectation.normalized;

  paths.forEach(function(path) {
    test("the path '" + path + "' is normalized to '" + normalized + "'", function() {
      equal(Normalizer.normalizePath(path), normalized);
    });
  });
});
