// Match percent-encoded values (e.g. %3a, %3A, %25)
var PERCENT_ENCODED_VALUES = /%[a-fA-F0-9]{2}/g;

function toUpper(str) { return str.toUpperCase(); }

// Turn percent-encoded values to upper case ("%3a" -> "%3A")
function percentEncodedValuesToUpper(string) {
  return string.replace(PERCENT_ENCODED_VALUES, toUpper);
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same path.
function normalizePath(path) {
  return path.split('/')
             .map(normalizePathSegment)
             .join('/');
}

function percentEncode(char) {
  return '%' + charToHex(char);
}

function charToHex(char) {
  return char.charCodeAt(0).toString(16).toUpperCase();
}

// Decodes percent-encoded values in the string except those
// characters in `reservedSet`
function decodeURIComponentExcept(string, reservedSet) {
  string = percentEncodedValuesToUpper(string);
  var replacements = {};

  for (var i=0; i < reservedSet.length; i++) {
    var char = reservedSet[i];
    var pChar = percentEncode(char);
    if (string.indexOf(pChar) !== -1) {
      var replacement = "__" + charToHex(char) + "__";
      replacements[pChar] = replacement;

      var pCharRegex = new RegExp(pChar, 'g');
      string = string.replace(pCharRegex, replacement);
    }
  }
  string = decodeURIComponent(string);

  Object.keys(replacements).forEach(function(pChar) {
    var replacement = replacements[pChar];
    var replacementRegex = new RegExp(replacement, 'g');

    string = string.replace(replacementRegex, pChar);
  });

  return string;
}

// Leave these characters in encoded state in segments
var reservedRouteSegmentChars = ['%', '/'];
var reservedPathSegmentChars = ['%', '/'];

function normalizeRouteSegment(segment) {
  return decodeURIComponentExcept(segment, reservedRouteSegmentChars);
}

function normalizePathSegment(segment) {
  return decodeURIComponentExcept(segment, reservedPathSegmentChars);
}

var Normalizer = {
  normalizeRouteSegment: normalizeRouteSegment,
  normalizePath: normalizePath
};

export default Normalizer;
