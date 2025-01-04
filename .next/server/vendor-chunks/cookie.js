"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/cookie";
exports.ids = ["vendor-chunks/cookie"];
exports.modules = {

/***/ "(rsc)/./node_modules/cookie/index.js":
/*!**************************************!*\
  !*** ./node_modules/cookie/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("/*!\n * cookie\n * Copyright(c) 2012-2014 Roman Shtylman\n * Copyright(c) 2015 Douglas Christopher Wilson\n * MIT Licensed\n */\n\n\n\n/**\n * Module exports.\n * @public\n */\n\nexports.parse = parse;\nexports.serialize = serialize;\n\n/**\n * Module variables.\n * @private\n */\n\nvar __toString = Object.prototype.toString\n\n/**\n * RegExp to match cookie-name in RFC 6265 sec 4.1.1\n * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2\n * which has been replaced by the token definition in RFC 7230 appendix B.\n *\n * cookie-name       = token\n * token             = 1*tchar\n * tchar             = \"!\" / \"#\" / \"$\" / \"%\" / \"&\" / \"'\" /\n *                     \"*\" / \"+\" / \"-\" / \".\" / \"^\" / \"_\" /\n *                     \"`\" / \"|\" / \"~\" / DIGIT / ALPHA\n */\n\nvar cookieNameRegExp = /^[!#$%&'*+\\-.^_`|~0-9A-Za-z]+$/;\n\n/**\n * RegExp to match cookie-value in RFC 6265 sec 4.1.1\n *\n * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )\n * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E\n *                     ; US-ASCII characters excluding CTLs,\n *                     ; whitespace DQUOTE, comma, semicolon,\n *                     ; and backslash\n */\n\nvar cookieValueRegExp = /^(\"?)[\\u0021\\u0023-\\u002B\\u002D-\\u003A\\u003C-\\u005B\\u005D-\\u007E]*\\1$/;\n\n/**\n * RegExp to match domain-value in RFC 6265 sec 4.1.1\n *\n * domain-value      = <subdomain>\n *                     ; defined in [RFC1034], Section 3.5, as\n *                     ; enhanced by [RFC1123], Section 2.1\n * <subdomain>       = <label> | <subdomain> \".\" <label>\n * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]\n *                     Labels must be 63 characters or less.\n *                     'let-dig' not 'letter' in the first char, per RFC1123\n * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>\n * <let-dig-hyp>     = <let-dig> | \"-\"\n * <let-dig>         = <letter> | <digit>\n * <letter>          = any one of the 52 alphabetic characters A through Z in\n *                     upper case and a through z in lower case\n * <digit>           = any one of the ten digits 0 through 9\n *\n * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173\n *\n * > (Note that a leading %x2E (\".\"), if present, is ignored even though that\n * character is not permitted, but a trailing %x2E (\".\"), if present, will\n * cause the user agent to ignore the attribute.)\n */\n\nvar domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;\n\n/**\n * RegExp to match path-value in RFC 6265 sec 4.1.1\n *\n * path-value        = <any CHAR except CTLs or \";\">\n * CHAR              = %x01-7F\n *                     ; defined in RFC 5234 appendix B.1\n */\n\nvar pathValueRegExp = /^[\\u0020-\\u003A\\u003D-\\u007E]*$/;\n\n/**\n * Parse a cookie header.\n *\n * Parse the given cookie header string into an object\n * The object has the various cookies as keys(names) => values\n *\n * @param {string} str\n * @param {object} [opt]\n * @return {object}\n * @public\n */\n\nfunction parse(str, opt) {\n  if (typeof str !== 'string') {\n    throw new TypeError('argument str must be a string');\n  }\n\n  var obj = {};\n  var len = str.length;\n  // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.\n  if (len < 2) return obj;\n\n  var dec = (opt && opt.decode) || decode;\n  var index = 0;\n  var eqIdx = 0;\n  var endIdx = 0;\n\n  do {\n    eqIdx = str.indexOf('=', index);\n    if (eqIdx === -1) break; // No more cookie pairs.\n\n    endIdx = str.indexOf(';', index);\n\n    if (endIdx === -1) {\n      endIdx = len;\n    } else if (eqIdx > endIdx) {\n      // backtrack on prior semicolon\n      index = str.lastIndexOf(';', eqIdx - 1) + 1;\n      continue;\n    }\n\n    var keyStartIdx = startIndex(str, index, eqIdx);\n    var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);\n    var key = str.slice(keyStartIdx, keyEndIdx);\n\n    // only assign once\n    if (!obj.hasOwnProperty(key)) {\n      var valStartIdx = startIndex(str, eqIdx + 1, endIdx);\n      var valEndIdx = endIndex(str, endIdx, valStartIdx);\n\n      if (str.charCodeAt(valStartIdx) === 0x22 /* \" */ && str.charCodeAt(valEndIdx - 1) === 0x22 /* \" */) {\n        valStartIdx++;\n        valEndIdx--;\n      }\n\n      var val = str.slice(valStartIdx, valEndIdx);\n      obj[key] = tryDecode(val, dec);\n    }\n\n    index = endIdx + 1\n  } while (index < len);\n\n  return obj;\n}\n\nfunction startIndex(str, index, max) {\n  do {\n    var code = str.charCodeAt(index);\n    if (code !== 0x20 /*   */ && code !== 0x09 /* \\t */) return index;\n  } while (++index < max);\n  return max;\n}\n\nfunction endIndex(str, index, min) {\n  while (index > min) {\n    var code = str.charCodeAt(--index);\n    if (code !== 0x20 /*   */ && code !== 0x09 /* \\t */) return index + 1;\n  }\n  return min;\n}\n\n/**\n * Serialize data into a cookie header.\n *\n * Serialize a name value pair into a cookie string suitable for\n * http headers. An optional options object specifies cookie parameters.\n *\n * serialize('foo', 'bar', { httpOnly: true })\n *   => \"foo=bar; httpOnly\"\n *\n * @param {string} name\n * @param {string} val\n * @param {object} [opt]\n * @return {string}\n * @public\n */\n\nfunction serialize(name, val, opt) {\n  var enc = (opt && opt.encode) || encodeURIComponent;\n\n  if (typeof enc !== 'function') {\n    throw new TypeError('option encode is invalid');\n  }\n\n  if (!cookieNameRegExp.test(name)) {\n    throw new TypeError('argument name is invalid');\n  }\n\n  var value = enc(val);\n\n  if (!cookieValueRegExp.test(value)) {\n    throw new TypeError('argument val is invalid');\n  }\n\n  var str = name + '=' + value;\n  if (!opt) return str;\n\n  if (null != opt.maxAge) {\n    var maxAge = Math.floor(opt.maxAge);\n\n    if (!isFinite(maxAge)) {\n      throw new TypeError('option maxAge is invalid')\n    }\n\n    str += '; Max-Age=' + maxAge;\n  }\n\n  if (opt.domain) {\n    if (!domainValueRegExp.test(opt.domain)) {\n      throw new TypeError('option domain is invalid');\n    }\n\n    str += '; Domain=' + opt.domain;\n  }\n\n  if (opt.path) {\n    if (!pathValueRegExp.test(opt.path)) {\n      throw new TypeError('option path is invalid');\n    }\n\n    str += '; Path=' + opt.path;\n  }\n\n  if (opt.expires) {\n    var expires = opt.expires\n\n    if (!isDate(expires) || isNaN(expires.valueOf())) {\n      throw new TypeError('option expires is invalid');\n    }\n\n    str += '; Expires=' + expires.toUTCString()\n  }\n\n  if (opt.httpOnly) {\n    str += '; HttpOnly';\n  }\n\n  if (opt.secure) {\n    str += '; Secure';\n  }\n\n  if (opt.partitioned) {\n    str += '; Partitioned'\n  }\n\n  if (opt.priority) {\n    var priority = typeof opt.priority === 'string'\n      ? opt.priority.toLowerCase() : opt.priority;\n\n    switch (priority) {\n      case 'low':\n        str += '; Priority=Low'\n        break\n      case 'medium':\n        str += '; Priority=Medium'\n        break\n      case 'high':\n        str += '; Priority=High'\n        break\n      default:\n        throw new TypeError('option priority is invalid')\n    }\n  }\n\n  if (opt.sameSite) {\n    var sameSite = typeof opt.sameSite === 'string'\n      ? opt.sameSite.toLowerCase() : opt.sameSite;\n\n    switch (sameSite) {\n      case true:\n        str += '; SameSite=Strict';\n        break;\n      case 'lax':\n        str += '; SameSite=Lax';\n        break;\n      case 'strict':\n        str += '; SameSite=Strict';\n        break;\n      case 'none':\n        str += '; SameSite=None';\n        break;\n      default:\n        throw new TypeError('option sameSite is invalid');\n    }\n  }\n\n  return str;\n}\n\n/**\n * URL-decode string value. Optimized to skip native call when no %.\n *\n * @param {string} str\n * @returns {string}\n */\n\nfunction decode (str) {\n  return str.indexOf('%') !== -1\n    ? decodeURIComponent(str)\n    : str\n}\n\n/**\n * Determine if value is a Date.\n *\n * @param {*} val\n * @private\n */\n\nfunction isDate (val) {\n  return __toString.call(val) === '[object Date]';\n}\n\n/**\n * Try decoding a string using a decoding function.\n *\n * @param {string} str\n * @param {function} decode\n * @private\n */\n\nfunction tryDecode(str, decode) {\n  try {\n    return decode(str);\n  } catch (e) {\n    return str;\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvY29va2llL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2IsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBa0QsS0FBSyxrQ0FBa0MsS0FBSzs7QUFFOUY7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2Qjs7QUFFN0IsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7O0FBRUo7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixnQkFBZ0I7QUFDN0Msa0JBQWtCO0FBQ2xCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYztBQUNkOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZDs7QUFFQTtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHN1c2hhXFxPbmVEcml2ZVxcRGVza3RvcFxcV2ViIERldmVsb3BtZW50XFxjcmVhdG9yLXN5bmNcXG5vZGVfbW9kdWxlc1xcY29va2llXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGNvb2tpZVxuICogQ29weXJpZ2h0KGMpIDIwMTItMjAxNCBSb21hbiBTaHR5bG1hblxuICogQ29weXJpZ2h0KGMpIDIwMTUgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcblxuLyoqXG4gKiBNb2R1bGUgdmFyaWFibGVzLlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgX190b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggY29va2llLW5hbWUgaW4gUkZDIDYyNjUgc2VjIDQuMS4xXG4gKiBUaGlzIHJlZmVycyBvdXQgdG8gdGhlIG9ic29sZXRlZCBkZWZpbml0aW9uIG9mIHRva2VuIGluIFJGQyAyNjE2IHNlYyAyLjJcbiAqIHdoaWNoIGhhcyBiZWVuIHJlcGxhY2VkIGJ5IHRoZSB0b2tlbiBkZWZpbml0aW9uIGluIFJGQyA3MjMwIGFwcGVuZGl4IEIuXG4gKlxuICogY29va2llLW5hbWUgICAgICAgPSB0b2tlblxuICogdG9rZW4gICAgICAgICAgICAgPSAxKnRjaGFyXG4gKiB0Y2hhciAgICAgICAgICAgICA9IFwiIVwiIC8gXCIjXCIgLyBcIiRcIiAvIFwiJVwiIC8gXCImXCIgLyBcIidcIiAvXG4gKiAgICAgICAgICAgICAgICAgICAgIFwiKlwiIC8gXCIrXCIgLyBcIi1cIiAvIFwiLlwiIC8gXCJeXCIgLyBcIl9cIiAvXG4gKiAgICAgICAgICAgICAgICAgICAgIFwiYFwiIC8gXCJ8XCIgLyBcIn5cIiAvIERJR0lUIC8gQUxQSEFcbiAqL1xuXG52YXIgY29va2llTmFtZVJlZ0V4cCA9IC9eWyEjJCUmJyorXFwtLl5fYHx+MC05QS1aYS16XSskLztcblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggY29va2llLXZhbHVlIGluIFJGQyA2MjY1IHNlYyA0LjEuMVxuICpcbiAqIGNvb2tpZS12YWx1ZSAgICAgID0gKmNvb2tpZS1vY3RldCAvICggRFFVT1RFICpjb29raWUtb2N0ZXQgRFFVT1RFIClcbiAqIGNvb2tpZS1vY3RldCAgICAgID0gJXgyMSAvICV4MjMtMkIgLyAleDJELTNBIC8gJXgzQy01QiAvICV4NUQtN0VcbiAqICAgICAgICAgICAgICAgICAgICAgOyBVUy1BU0NJSSBjaGFyYWN0ZXJzIGV4Y2x1ZGluZyBDVExzLFxuICogICAgICAgICAgICAgICAgICAgICA7IHdoaXRlc3BhY2UgRFFVT1RFLCBjb21tYSwgc2VtaWNvbG9uLFxuICogICAgICAgICAgICAgICAgICAgICA7IGFuZCBiYWNrc2xhc2hcbiAqL1xuXG52YXIgY29va2llVmFsdWVSZWdFeHAgPSAvXihcIj8pW1xcdTAwMjFcXHUwMDIzLVxcdTAwMkJcXHUwMDJELVxcdTAwM0FcXHUwMDNDLVxcdTAwNUJcXHUwMDVELVxcdTAwN0VdKlxcMSQvO1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCBkb21haW4tdmFsdWUgaW4gUkZDIDYyNjUgc2VjIDQuMS4xXG4gKlxuICogZG9tYWluLXZhbHVlICAgICAgPSA8c3ViZG9tYWluPlxuICogICAgICAgICAgICAgICAgICAgICA7IGRlZmluZWQgaW4gW1JGQzEwMzRdLCBTZWN0aW9uIDMuNSwgYXNcbiAqICAgICAgICAgICAgICAgICAgICAgOyBlbmhhbmNlZCBieSBbUkZDMTEyM10sIFNlY3Rpb24gMi4xXG4gKiA8c3ViZG9tYWluPiAgICAgICA9IDxsYWJlbD4gfCA8c3ViZG9tYWluPiBcIi5cIiA8bGFiZWw+XG4gKiA8bGFiZWw+ICAgICAgICAgICA9IDxsZXQtZGlnPiBbIFsgPGxkaC1zdHI+IF0gPGxldC1kaWc+IF1cbiAqICAgICAgICAgICAgICAgICAgICAgTGFiZWxzIG11c3QgYmUgNjMgY2hhcmFjdGVycyBvciBsZXNzLlxuICogICAgICAgICAgICAgICAgICAgICAnbGV0LWRpZycgbm90ICdsZXR0ZXInIGluIHRoZSBmaXJzdCBjaGFyLCBwZXIgUkZDMTEyM1xuICogPGxkaC1zdHI+ICAgICAgICAgPSA8bGV0LWRpZy1oeXA+IHwgPGxldC1kaWctaHlwPiA8bGRoLXN0cj5cbiAqIDxsZXQtZGlnLWh5cD4gICAgID0gPGxldC1kaWc+IHwgXCItXCJcbiAqIDxsZXQtZGlnPiAgICAgICAgID0gPGxldHRlcj4gfCA8ZGlnaXQ+XG4gKiA8bGV0dGVyPiAgICAgICAgICA9IGFueSBvbmUgb2YgdGhlIDUyIGFscGhhYmV0aWMgY2hhcmFjdGVycyBBIHRocm91Z2ggWiBpblxuICogICAgICAgICAgICAgICAgICAgICB1cHBlciBjYXNlIGFuZCBhIHRocm91Z2ggeiBpbiBsb3dlciBjYXNlXG4gKiA8ZGlnaXQ+ICAgICAgICAgICA9IGFueSBvbmUgb2YgdGhlIHRlbiBkaWdpdHMgMCB0aHJvdWdoIDlcbiAqXG4gKiBLZWVwIHN1cHBvcnQgZm9yIGxlYWRpbmcgZG90OiBodHRwczovL2dpdGh1Yi5jb20vanNodHRwL2Nvb2tpZS9pc3N1ZXMvMTczXG4gKlxuICogPiAoTm90ZSB0aGF0IGEgbGVhZGluZyAleDJFIChcIi5cIiksIGlmIHByZXNlbnQsIGlzIGlnbm9yZWQgZXZlbiB0aG91Z2ggdGhhdFxuICogY2hhcmFjdGVyIGlzIG5vdCBwZXJtaXR0ZWQsIGJ1dCBhIHRyYWlsaW5nICV4MkUgKFwiLlwiKSwgaWYgcHJlc2VudCwgd2lsbFxuICogY2F1c2UgdGhlIHVzZXIgYWdlbnQgdG8gaWdub3JlIHRoZSBhdHRyaWJ1dGUuKVxuICovXG5cbnZhciBkb21haW5WYWx1ZVJlZ0V4cCA9IC9eKFsuXT9bYS16MC05XShbYS16MC05LV17MCw2MX1bYS16MC05XSk/KShbLl1bYS16MC05XShbYS16MC05LV17MCw2MX1bYS16MC05XSk/KSokL2k7XG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoIHBhdGgtdmFsdWUgaW4gUkZDIDYyNjUgc2VjIDQuMS4xXG4gKlxuICogcGF0aC12YWx1ZSAgICAgICAgPSA8YW55IENIQVIgZXhjZXB0IENUTHMgb3IgXCI7XCI+XG4gKiBDSEFSICAgICAgICAgICAgICA9ICV4MDEtN0ZcbiAqICAgICAgICAgICAgICAgICAgICAgOyBkZWZpbmVkIGluIFJGQyA1MjM0IGFwcGVuZGl4IEIuMVxuICovXG5cbnZhciBwYXRoVmFsdWVSZWdFeHAgPSAvXltcXHUwMDIwLVxcdTAwM0FcXHUwMDNELVxcdTAwN0VdKiQvO1xuXG4vKipcbiAqIFBhcnNlIGEgY29va2llIGhlYWRlci5cbiAqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gY29va2llIGhlYWRlciBzdHJpbmcgaW50byBhbiBvYmplY3RcbiAqIFRoZSBvYmplY3QgaGFzIHRoZSB2YXJpb3VzIGNvb2tpZXMgYXMga2V5cyhuYW1lcykgPT4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRdXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyLCBvcHQpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XG4gIC8vIFJGQyA2MjY1IHNlYyA0LjEuMSwgUkZDIDI2MTYgMi4yIGRlZmluZXMgYSBjb29raWUgbmFtZSBjb25zaXN0cyBvZiBvbmUgY2hhciBtaW5pbXVtLCBwbHVzICc9Jy5cbiAgaWYgKGxlbiA8IDIpIHJldHVybiBvYmo7XG5cbiAgdmFyIGRlYyA9IChvcHQgJiYgb3B0LmRlY29kZSkgfHwgZGVjb2RlO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgZXFJZHggPSAwO1xuICB2YXIgZW5kSWR4ID0gMDtcblxuICBkbyB7XG4gICAgZXFJZHggPSBzdHIuaW5kZXhPZignPScsIGluZGV4KTtcbiAgICBpZiAoZXFJZHggPT09IC0xKSBicmVhazsgLy8gTm8gbW9yZSBjb29raWUgcGFpcnMuXG5cbiAgICBlbmRJZHggPSBzdHIuaW5kZXhPZignOycsIGluZGV4KTtcblxuICAgIGlmIChlbmRJZHggPT09IC0xKSB7XG4gICAgICBlbmRJZHggPSBsZW47XG4gICAgfSBlbHNlIGlmIChlcUlkeCA+IGVuZElkeCkge1xuICAgICAgLy8gYmFja3RyYWNrIG9uIHByaW9yIHNlbWljb2xvblxuICAgICAgaW5kZXggPSBzdHIubGFzdEluZGV4T2YoJzsnLCBlcUlkeCAtIDEpICsgMTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBrZXlTdGFydElkeCA9IHN0YXJ0SW5kZXgoc3RyLCBpbmRleCwgZXFJZHgpO1xuICAgIHZhciBrZXlFbmRJZHggPSBlbmRJbmRleChzdHIsIGVxSWR4LCBrZXlTdGFydElkeCk7XG4gICAgdmFyIGtleSA9IHN0ci5zbGljZShrZXlTdGFydElkeCwga2V5RW5kSWR4KTtcblxuICAgIC8vIG9ubHkgYXNzaWduIG9uY2VcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB2YXIgdmFsU3RhcnRJZHggPSBzdGFydEluZGV4KHN0ciwgZXFJZHggKyAxLCBlbmRJZHgpO1xuICAgICAgdmFyIHZhbEVuZElkeCA9IGVuZEluZGV4KHN0ciwgZW5kSWR4LCB2YWxTdGFydElkeCk7XG5cbiAgICAgIGlmIChzdHIuY2hhckNvZGVBdCh2YWxTdGFydElkeCkgPT09IDB4MjIgLyogXCIgKi8gJiYgc3RyLmNoYXJDb2RlQXQodmFsRW5kSWR4IC0gMSkgPT09IDB4MjIgLyogXCIgKi8pIHtcbiAgICAgICAgdmFsU3RhcnRJZHgrKztcbiAgICAgICAgdmFsRW5kSWR4LS07XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWwgPSBzdHIuc2xpY2UodmFsU3RhcnRJZHgsIHZhbEVuZElkeCk7XG4gICAgICBvYmpba2V5XSA9IHRyeURlY29kZSh2YWwsIGRlYyk7XG4gICAgfVxuXG4gICAgaW5kZXggPSBlbmRJZHggKyAxXG4gIH0gd2hpbGUgKGluZGV4IDwgbGVuKTtcblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBzdGFydEluZGV4KHN0ciwgaW5kZXgsIG1heCkge1xuICBkbyB7XG4gICAgdmFyIGNvZGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCk7XG4gICAgaWYgKGNvZGUgIT09IDB4MjAgLyogICAqLyAmJiBjb2RlICE9PSAweDA5IC8qIFxcdCAqLykgcmV0dXJuIGluZGV4O1xuICB9IHdoaWxlICgrK2luZGV4IDwgbWF4KTtcbiAgcmV0dXJuIG1heDtcbn1cblxuZnVuY3Rpb24gZW5kSW5kZXgoc3RyLCBpbmRleCwgbWluKSB7XG4gIHdoaWxlIChpbmRleCA+IG1pbikge1xuICAgIHZhciBjb2RlID0gc3RyLmNoYXJDb2RlQXQoLS1pbmRleCk7XG4gICAgaWYgKGNvZGUgIT09IDB4MjAgLyogICAqLyAmJiBjb2RlICE9PSAweDA5IC8qIFxcdCAqLykgcmV0dXJuIGluZGV4ICsgMTtcbiAgfVxuICByZXR1cm4gbWluO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSBkYXRhIGludG8gYSBjb29raWUgaGVhZGVyLlxuICpcbiAqIFNlcmlhbGl6ZSBhIG5hbWUgdmFsdWUgcGFpciBpbnRvIGEgY29va2llIHN0cmluZyBzdWl0YWJsZSBmb3JcbiAqIGh0dHAgaGVhZGVycy4gQW4gb3B0aW9uYWwgb3B0aW9ucyBvYmplY3Qgc3BlY2lmaWVzIGNvb2tpZSBwYXJhbWV0ZXJzLlxuICpcbiAqIHNlcmlhbGl6ZSgnZm9vJywgJ2JhcicsIHsgaHR0cE9ubHk6IHRydWUgfSlcbiAqICAgPT4gXCJmb289YmFyOyBodHRwT25seVwiXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0XVxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShuYW1lLCB2YWwsIG9wdCkge1xuICB2YXIgZW5jID0gKG9wdCAmJiBvcHQuZW5jb2RlKSB8fCBlbmNvZGVVUklDb21wb25lbnQ7XG5cbiAgaWYgKHR5cGVvZiBlbmMgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gZW5jb2RlIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIGlmICghY29va2llTmFtZVJlZ0V4cC50ZXN0KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgbmFtZSBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBlbmModmFsKTtcblxuICBpZiAoIWNvb2tpZVZhbHVlUmVnRXhwLnRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgdmFsIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHZhciBzdHIgPSBuYW1lICsgJz0nICsgdmFsdWU7XG4gIGlmICghb3B0KSByZXR1cm4gc3RyO1xuXG4gIGlmIChudWxsICE9IG9wdC5tYXhBZ2UpIHtcbiAgICB2YXIgbWF4QWdlID0gTWF0aC5mbG9vcihvcHQubWF4QWdlKTtcblxuICAgIGlmICghaXNGaW5pdGUobWF4QWdlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIG1heEFnZSBpcyBpbnZhbGlkJylcbiAgICB9XG5cbiAgICBzdHIgKz0gJzsgTWF4LUFnZT0nICsgbWF4QWdlO1xuICB9XG5cbiAgaWYgKG9wdC5kb21haW4pIHtcbiAgICBpZiAoIWRvbWFpblZhbHVlUmVnRXhwLnRlc3Qob3B0LmRvbWFpbikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBkb21haW4gaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIHN0ciArPSAnOyBEb21haW49JyArIG9wdC5kb21haW47XG4gIH1cblxuICBpZiAob3B0LnBhdGgpIHtcbiAgICBpZiAoIXBhdGhWYWx1ZVJlZ0V4cC50ZXN0KG9wdC5wYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIHBhdGggaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIHN0ciArPSAnOyBQYXRoPScgKyBvcHQucGF0aDtcbiAgfVxuXG4gIGlmIChvcHQuZXhwaXJlcykge1xuICAgIHZhciBleHBpcmVzID0gb3B0LmV4cGlyZXNcblxuICAgIGlmICghaXNEYXRlKGV4cGlyZXMpIHx8IGlzTmFOKGV4cGlyZXMudmFsdWVPZigpKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIGV4cGlyZXMgaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIHN0ciArPSAnOyBFeHBpcmVzPScgKyBleHBpcmVzLnRvVVRDU3RyaW5nKClcbiAgfVxuXG4gIGlmIChvcHQuaHR0cE9ubHkpIHtcbiAgICBzdHIgKz0gJzsgSHR0cE9ubHknO1xuICB9XG5cbiAgaWYgKG9wdC5zZWN1cmUpIHtcbiAgICBzdHIgKz0gJzsgU2VjdXJlJztcbiAgfVxuXG4gIGlmIChvcHQucGFydGl0aW9uZWQpIHtcbiAgICBzdHIgKz0gJzsgUGFydGl0aW9uZWQnXG4gIH1cblxuICBpZiAob3B0LnByaW9yaXR5KSB7XG4gICAgdmFyIHByaW9yaXR5ID0gdHlwZW9mIG9wdC5wcmlvcml0eSA9PT0gJ3N0cmluZydcbiAgICAgID8gb3B0LnByaW9yaXR5LnRvTG93ZXJDYXNlKCkgOiBvcHQucHJpb3JpdHk7XG5cbiAgICBzd2l0Y2ggKHByaW9yaXR5KSB7XG4gICAgICBjYXNlICdsb3cnOlxuICAgICAgICBzdHIgKz0gJzsgUHJpb3JpdHk9TG93J1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgc3RyICs9ICc7IFByaW9yaXR5PU1lZGl1bSdcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICBzdHIgKz0gJzsgUHJpb3JpdHk9SGlnaCdcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBwcmlvcml0eSBpcyBpbnZhbGlkJylcbiAgICB9XG4gIH1cblxuICBpZiAob3B0LnNhbWVTaXRlKSB7XG4gICAgdmFyIHNhbWVTaXRlID0gdHlwZW9mIG9wdC5zYW1lU2l0ZSA9PT0gJ3N0cmluZydcbiAgICAgID8gb3B0LnNhbWVTaXRlLnRvTG93ZXJDYXNlKCkgOiBvcHQuc2FtZVNpdGU7XG5cbiAgICBzd2l0Y2ggKHNhbWVTaXRlKSB7XG4gICAgICBjYXNlIHRydWU6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1TdHJpY3QnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xheCc6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1MYXgnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmljdCc6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1TdHJpY3QnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBzdHIgKz0gJzsgU2FtZVNpdGU9Tm9uZSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIHNhbWVTaXRlIGlzIGludmFsaWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFVSTC1kZWNvZGUgc3RyaW5nIHZhbHVlLiBPcHRpbWl6ZWQgdG8gc2tpcCBuYXRpdmUgY2FsbCB3aGVuIG5vICUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBkZWNvZGUgKHN0cikge1xuICByZXR1cm4gc3RyLmluZGV4T2YoJyUnKSAhPT0gLTFcbiAgICA/IGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gICAgOiBzdHJcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdmFsdWUgaXMgYSBEYXRlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzRGF0ZSAodmFsKSB7XG4gIHJldHVybiBfX3RvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIFRyeSBkZWNvZGluZyBhIHN0cmluZyB1c2luZyBhIGRlY29kaW5nIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlY29kZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0cnlEZWNvZGUoc3RyLCBkZWNvZGUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlKHN0cik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/cookie/index.js\n");

/***/ })

};
;