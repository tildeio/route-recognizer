// Matches all percent-encoded values like %3a
var percentEncodedValueRegex = /%[a-fA-F0-9]{2}/g;

// The percent-encoding for the percent "%" character
var percentEncodedPercent = "%25";

function toUpper(str) { return str.toUpperCase(); }

// Turns all percent-encoded values to upper case
// "%3a" -> "%3A"
function percentEncodedValuesToUpper(string) {
  return string.replace(percentEncodedValueRegex, toUpper);
}

function decodeURIWithoutPercents(string) {
  return string.split(percentEncodedPercent)
               .map(decodeURI)
               .join(percentEncodedPercent);
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same path.
function normalizePath(path) {
  return path.split('/')
             .map(normalizePathSegment)
             .join('/');
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same route.
function normalizeRoute(route) {
  return decodeURIWithoutPercents(percentEncodedValuesToUpper(route));
}

function percentEncode(char) {
  return '%' + charToHex(char);
}

function charToHex(char) {
  return char.charCodeAt(0).toString(16).toUpperCase();
}

function decodeURIComponentExcept(string, reservedSet) {
  string = percentEncodedValuesToUpper(string);
  var replacements = {};
  for (var i=0; i < reservedSet.length; i++) {
    var char = reservedSet[i];
    var pChar = percentEncode(char);
    if (string.indexOf(pChar) !== -1) {
      var replacement = "__" + charToHex(char) + "__";
      replacements[pChar] = replacement;
      string = string.replace(new RegExp(pChar, 'g'), replacement);
    }
  }
  string = decodeURIComponent(string);

  Object.keys(replacements).forEach(function(pChar) {
    var replacement = replacements[pChar];
    string = string.replace(new RegExp(replacement, 'g'), pChar);
  });

  return string;
}

function normalizeRouteSegment(segment) {
  return decodeURIComponentExcept(segment, ['%', '/']);
}

function normalizePathSegment(segment) {
  return decodeURIComponentExcept(segment, ['%', '/']);
}

var Normalizer = {
  normalizeRoute: normalizeRoute,
  normalizeRouteSegment: normalizeRouteSegment,
  normalizePath: normalizePath,
  normalizePathSegment: normalizePathSegment
};

export default Normalizer;
