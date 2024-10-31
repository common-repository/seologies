jSmart.prototype.registerPlugin(
      'modifier', 
      'intval', 
      function(s)
      {
         return parseInt(s);
      }
 );
jSmart.prototype.registerPlugin(
	      'modifier', 
	      'highlight', 
	      function(s, word)
	      { 
	    	  return str_ireplace(word, '<b>' + word + '</b>', s);
	      }
);

jSmart.prototype.registerPlugin(
	      'modifier', 
	      'highlight2', 
	      function(s, word)
	      { 
	    	  return str_ireplace(word, '<b class="highlight2">' + word + '</b>', s);
	      }
);

jSmart.prototype.registerPlugin(
	      'modifier', 
	      'showhtmlsymbols', 
	      function(s)
	      {  
	    	  return str_replace(['&amp;nbsp;', '&amp;ndash;','&amp;quot;', '&amp;#'], ['&nbsp;', '&ndash;','&quot;', '&#'], s);
	      }
);


function aler(str) {
    alert(str)
}

function checkNotEmptyStr(str) {
    if (typeof(str) == 'undefined' || str == null || str == '')
        return false;
    return true;
    
}
function checkNotEmpty(obj, field) {
 if (typeof(obj[field]) == 'undefined' || obj[field] == null || obj[field] == '') {
	 return false;
 }	 
 
 return true;
}

function nl2br(str, is_xhtml) {
	  //  discuss at: http://phpjs.org/functions/nl2br/
	  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // improved by: Philip Peterson
	  // improved by: Onno Marsman
	  // improved by: Atli Þór
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Maximusya
	  // bugfixed by: Onno Marsman
	  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //    input by: Brett Zamir (http://brett-zamir.me)
	  //   example 1: nl2br('Kevin\nvan\nZonneveld');
	  //   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
	  //   example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
	  //   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
	  //   example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
	  //   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

	  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

	  return (str + '')
	    .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}

 
 
function str_ireplace (search, replace, subject) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Martijn Wieringa
	  // +      input by: penutbutterjelly
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +    tweaked by: Jack
	  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Onno Marsman
	  // +      input by: Brett Zamir (http://brett-zamir.me)
	  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Philipp Lenssen
	  // *     example 1: str_ireplace('l', 'l', 'HeLLo');
	  // *     returns 1: 'Hello'
	  // *     example 2: str_ireplace('$', 'foo', '$bar');
	  // *     returns 2: 'foobar'
	  var i, k = '';
	  var searchl = 0;
	  var reg;

	  var escapeRegex = function (s) {
	    return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
	  };

	  search += '';
	  searchl = search.length;
	  if (Object.prototype.toString.call(replace) !== '[object Array]') {
	    replace = [replace];
	    if (Object.prototype.toString.call(search) === '[object Array]') {
	      // If search is an array and replace is a string,
	      // then this replacement string is used for every value of search
	      while (searchl > replace.length) {
	        replace[replace.length] = replace[0];
	      }
	    }
	  }

	  if (Object.prototype.toString.call(search) !== '[object Array]') {
	    search = [search];
	  }
	  while (search.length > replace.length) {
	    // If replace has fewer values than search,
	    // then an empty string is used for the rest of replacement values
	    replace[replace.length] = '';
	  }

	  if (Object.prototype.toString.call(subject) === '[object Array]') {
	    // If subject is an array, then the search and replace is performed
	    // with every entry of subject , and the return value is an array as well.
	    for (k in subject) {
	      if (subject.hasOwnProperty(k)) {
	        subject[k] = str_ireplace(search, replace, subject[k]);
	      }
	    }
	    return subject;
	  }

	  searchl = search.length;
	  for (i = 0; i < searchl; i++) {
	    reg = new RegExp(escapeRegex(search[i]), 'gi');
	    subject = subject.replace(reg, replace[i]);
	  }

	  return subject;
 }

function str_replace (search, replace, subject, count) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Gabriel Paderni
  // +   improved by: Philip Peterson
  // +   improved by: Simon Willison (http://simonwillison.net)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   bugfixed by: Anton Ongson
  // +      input by: Onno Marsman
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +    tweaked by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   input by: Oleg Eremeev
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Oleg Eremeev
  // %          note 1: The count parameter must be passed as a string in order
  // %          note 1:  to find a global variable in which the result will be given
  // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
  // *     returns 1: 'Kevin.van.Zonneveld'
  // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
  // *     returns 2: 'hemmo, mars'
 	
  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}


function rawurlencode (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +      input by: travc
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Michael Grier
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Joris
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: This reflects PHP 5.3/6.0+ behavior
  // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
  // %        note 2: pages served as UTF-8
  // *     example 1: rawurlencode('Kevin van Zonneveld!');
  // *     returns 1: 'Kevin%20van%20Zonneveld%21'
  // *     example 2: rawurlencode('http://kevin.vanzonneveld.net/');
  // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
  // *     example 3: rawurlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
  // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A');
}


function htmlentities (string, quote_style, charset, double_encode) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   improved by: nobbler
	  // +    tweaked by: Jack
	  // +   bugfixed by: Onno Marsman
	  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // +      input by: Ratheous
	  // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
	  // +   improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
	  // -    depends on: get_html_translation_table
	  // *     example 1: htmlentities('Kevin & van Zonneveld');
	  // *     returns 1: 'Kevin &amp; van Zonneveld'
	  // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
	  // *     returns 2: 'foo&#039;bar'
	  var hash_map = get_html_translation_table('HTML_ENTITIES', quote_style),
	    symbol = '';
	  string = string == null ? '' : string + '';

	  if (!hash_map) {
	    return false;
	  }

	  if (quote_style && quote_style === 'ENT_QUOTES') {
	    hash_map["'"] = '&#039;';
	  }

	  if (!!double_encode || double_encode == null) {
	    for (symbol in hash_map) {
	      if (hash_map.hasOwnProperty(symbol)) {
	        string = string.split(symbol).join(hash_map[symbol]);
	      }
	    }
	  } else {
	    string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function (ignore, text, entity) {
	      for (symbol in hash_map) {
	        if (hash_map.hasOwnProperty(symbol)) {
	          text = text.split(symbol).join(hash_map[symbol]);
	        }
	      }

	      return text + entity;
	    });
	  }

	  return string;
	}


function get_html_translation_table (table, quote_style) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Philip Peterson
	  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: noname
	  // +   bugfixed by: Alex
	  // +   bugfixed by: Marco
	  // +   bugfixed by: madipta
	  // +   improved by: KELAN
	  // +   improved by: Brett Zamir (http://brett-zamir.me)
	  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // +      input by: Frank Forte
	  // +   bugfixed by: T.Wild
	  // +      input by: Ratheous
	  // %          note: It has been decided that we're not going to add global
	  // %          note: dependencies to php.js, meaning the constants are not
	  // %          note: real constants, but strings instead. Integers are also supported if someone
	  // %          note: chooses to create the constants themselves.
	  // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
	  // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
	  var entities = {},
	    hash_map = {},
	    decimal;
	  var constMappingTable = {},
	    constMappingQuoteStyle = {};
	  var useTable = {},
	    useQuoteStyle = {};

	  // Translate arguments
	  constMappingTable[0] = 'HTML_SPECIALCHARS';
	  constMappingTable[1] = 'HTML_ENTITIES';
	  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
	  constMappingQuoteStyle[2] = 'ENT_COMPAT';
	  constMappingQuoteStyle[3] = 'ENT_QUOTES';

	  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
	  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

	  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
	    throw new Error("Table: " + useTable + ' not supported');
	    // return false;
	  }

	  entities['38'] = '&amp;';
	  if (useTable === 'HTML_ENTITIES') {
	    entities['160'] = '&nbsp;';
	    entities['161'] = '&iexcl;';
	    entities['162'] = '&cent;';
	    entities['163'] = '&pound;';
	    entities['164'] = '&curren;';
	    entities['165'] = '&yen;';
	    entities['166'] = '&brvbar;';
	    entities['167'] = '&sect;';
	    entities['168'] = '&uml;';
	    entities['169'] = '&copy;';
	    entities['170'] = '&ordf;';
	    entities['171'] = '&laquo;';
	    entities['172'] = '&not;';
	    entities['173'] = '&shy;';
	    entities['174'] = '&reg;';
	    entities['175'] = '&macr;';
	    entities['176'] = '&deg;';
	    entities['177'] = '&plusmn;';
	    entities['178'] = '&sup2;';
	    entities['179'] = '&sup3;';
	    entities['180'] = '&acute;';
	    entities['181'] = '&micro;';
	    entities['182'] = '&para;';
	    entities['183'] = '&middot;';
	    entities['184'] = '&cedil;';
	    entities['185'] = '&sup1;';
	    entities['186'] = '&ordm;';
	    entities['187'] = '&raquo;';
	    entities['188'] = '&frac14;';
	    entities['189'] = '&frac12;';
	    entities['190'] = '&frac34;';
	    entities['191'] = '&iquest;';
	    entities['192'] = '&Agrave;';
	    entities['193'] = '&Aacute;';
	    entities['194'] = '&Acirc;';
	    entities['195'] = '&Atilde;';
	    entities['196'] = '&Auml;';
	    entities['197'] = '&Aring;';
	    entities['198'] = '&AElig;';
	    entities['199'] = '&Ccedil;';
	    entities['200'] = '&Egrave;';
	    entities['201'] = '&Eacute;';
	    entities['202'] = '&Ecirc;';
	    entities['203'] = '&Euml;';
	    entities['204'] = '&Igrave;';
	    entities['205'] = '&Iacute;';
	    entities['206'] = '&Icirc;';
	    entities['207'] = '&Iuml;';
	    entities['208'] = '&ETH;';
	    entities['209'] = '&Ntilde;';
	    entities['210'] = '&Ograve;';
	    entities['211'] = '&Oacute;';
	    entities['212'] = '&Ocirc;';
	    entities['213'] = '&Otilde;';
	    entities['214'] = '&Ouml;';
	    entities['215'] = '&times;';
	    entities['216'] = '&Oslash;';
	    entities['217'] = '&Ugrave;';
	    entities['218'] = '&Uacute;';
	    entities['219'] = '&Ucirc;';
	    entities['220'] = '&Uuml;';
	    entities['221'] = '&Yacute;';
	    entities['222'] = '&THORN;';
	    entities['223'] = '&szlig;';
	    entities['224'] = '&agrave;';
	    entities['225'] = '&aacute;';
	    entities['226'] = '&acirc;';
	    entities['227'] = '&atilde;';
	    entities['228'] = '&auml;';
	    entities['229'] = '&aring;';
	    entities['230'] = '&aelig;';
	    entities['231'] = '&ccedil;';
	    entities['232'] = '&egrave;';
	    entities['233'] = '&eacute;';
	    entities['234'] = '&ecirc;';
	    entities['235'] = '&euml;';
	    entities['236'] = '&igrave;';
	    entities['237'] = '&iacute;';
	    entities['238'] = '&icirc;';
	    entities['239'] = '&iuml;';
	    entities['240'] = '&eth;';
	    entities['241'] = '&ntilde;';
	    entities['242'] = '&ograve;';
	    entities['243'] = '&oacute;';
	    entities['244'] = '&ocirc;';
	    entities['245'] = '&otilde;';
	    entities['246'] = '&ouml;';
	    entities['247'] = '&divide;';
	    entities['248'] = '&oslash;';
	    entities['249'] = '&ugrave;';
	    entities['250'] = '&uacute;';
	    entities['251'] = '&ucirc;';
	    entities['252'] = '&uuml;';
	    entities['253'] = '&yacute;';
	    entities['254'] = '&thorn;';
	    entities['255'] = '&yuml;';
	  }

	  if (useQuoteStyle !== 'ENT_NOQUOTES') {
	    entities['34'] = '&quot;';
	  }
	  if (useQuoteStyle === 'ENT_QUOTES') {
	    entities['39'] = '&#39;';
	  }
	  entities['60'] = '&lt;';
	  entities['62'] = '&gt;';


	  // ascii decimals to real symbols
	  for (decimal in entities) {
	    if (entities.hasOwnProperty(decimal)) {
	      hash_map[String.fromCharCode(decimal)] = entities[decimal];
	    }
	  }

	  return hash_map;
	}
