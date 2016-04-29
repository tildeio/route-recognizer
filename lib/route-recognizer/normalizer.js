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
  return decodeURIWithoutPercents(percentEncodedValuesToUpper(path));
}

// Normalizes percent-encoded values to upper-case and decodes percent-encoded
// values that are not reserved (like unicode characters).
// Safe to call multiple times on the same route.
function normalizeRoute(route) {
  return decodeURIWithoutPercents(percentEncodedValuesToUpper(route));
}

var Normalizer = {
  normalizeRoute: normalizeRoute,
  normalizePath: normalizePath
};

export default Normalizer;
