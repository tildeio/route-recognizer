
// Matches all percent-encoded values like %25
var percentEncodedValueRegex = /%[a-fA-F0-9]{2}/g;

// The percent-encoding for the percent "%" character
var percentEncodedPercent = "%25";

var percentRegex = new RegExp(percentEncodedPercent, "g");

function toUpper(str) { return str.toUpperCase(); }

// Turns all percent-encoded values to upper case
// "%3a" -> "%3A"
function percentEncodedValuesToUpper(string) {
  return string.replace(percentEncodedValueRegex, toUpper);
}

function generateRandomString() {
  return "_" + Math.floor(Math.random() * 1028).toString(16) + "_";
}

// Returns a sub string that does not occur in `string`
function uniqueString(string) {
  var random = generateRandomString();
  while (string.indexOf(random) !== -1) {
    random = generateRandomString();
  }
  return random;
}

// Replaces encoded percents ("%25") in string with a unique replacement value,
// yields the string to the callback, and then replaces the replacement value
// with encoded percents again before returning.
// This is to work around the fact that `decodeURI` decodes "%25" -> "%" and is
// therefore not safe to call multiple times on the same string.
function replaceEncodedPercents(string, callback) {
  var hasPercent = percentRegex.test(string);
  var replacer;
  if (hasPercent) {
    replacer = uniqueString(string);
    string = string.replace(percentRegex, replacer);
  }
  string = callback(string);
  if (hasPercent) {
    string = string.replace(new RegExp(replacer, "g"), percentEncodedPercent);
  }

  return string;
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same path.
function normalizePath(path) {
  return replaceEncodedPercents(path, function(path) {
    return percentEncodedValuesToUpper(decodeURI(path));
  });
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same route.
function normalizeRoute(route) {
  return replaceEncodedPercents(route, function(route) {
    return percentEncodedValuesToUpper(decodeURI(route));
  });
}

var Normalizer = {
  normalizeRoute: normalizeRoute,
  normalizePath: normalizePath
};

export default Normalizer;
