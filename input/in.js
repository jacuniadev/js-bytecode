"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function fingerprint_browser() {
    "use strict";

    var strOnError, strUserAgent, numVersion, strBrowser, strOut;

    strOnError = "Error";
    strUserAgent = null;
    numVersion = null;
    strBrowser = null;
    strOut = null;

    try {
        strUserAgent = navigator.userAgent.toLowerCase();
        if (/msie (\d+\.\d+);/.test(strUserAgent)) {
            //test for MSIE x.x;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            if (strUserAgent.indexOf("trident/6") > -1) {
                numVersion = 10;
            }
            if (strUserAgent.indexOf("trident/5") > -1) {
                numVersion = 9;
            }
            if (strUserAgent.indexOf("trident/4") > -1) {
                numVersion = 8;
            }
            strBrowser = "Internet Explorer " + numVersion;
        } else if (strUserAgent.indexOf("trident/7") > -1) {
            //IE 11+ gets rid of the legacy 'MSIE' in the user-agent string;
            numVersion = 11;
            strBrowser = "Internet Explorer " + numVersion;
        } else if (/firefox[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Firefox " + numVersion;
        } else if (/opera[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Opera " + numVersion;
        } else if (/chrome[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Chrome/x.x or Chrome x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Chrome " + numVersion;
        } else if (/version[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Version/x.x or Version x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Safari " + numVersion;
        } else if (/rv[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for rv/x.x or rv x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla " + numVersion;
        } else if (/mozilla[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Mozilla/x.x or Mozilla x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Mozilla " + numVersion;
        } else if (/binget[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for BinGet/x.x or BinGet x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (BinGet) " + numVersion;
        } else if (/curl[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Curl/x.x or Curl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (cURL) " + numVersion;
        } else if (/java[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Java/x.x or Java x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Java) " + numVersion;
        } else if (/libwww-perl[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for libwww-perl/x.x or libwww-perl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (libwww-perl) " + numVersion;
        } else if (/microsoft url control -[\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Microsoft URL Control - x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Microsoft URL Control) " + numVersion;
        } else if (/peach[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for Peach/x.x or Peach x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Peach) " + numVersion;
        } else if (/php[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for PHP/x.x or PHP x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (PHP) " + numVersion;
        } else if (/pxyscand[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for pxyscand/x.x or pxyscand x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (pxyscand) " + numVersion;
        } else if (/pycurl[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for pycurl/x.x or pycurl x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (PycURL) " + numVersion;
        } else if (/python-urllib[\/\s](\d+\.\d+)/.test(strUserAgent)) {
            //test for python-urllib/x.x or python-urllib x.x (ignoring remaining digits);
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Library (Python URLlib) " + numVersion;
        } else if (/appengine-google/.test(strUserAgent)) {
            //test for AppEngine-Google;
            numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
            strBrowser = "Cloud (Google AppEngine) " + numVersion;
        } else {
            strBrowser = "Unknown";
        }
        strOut = strBrowser;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_canvas() {
    "use strict";

    var strOnError, canvas, strCText, strText, strOut;

    strOnError = "Error";
    canvas = null;
    strCText = null;
    strText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?";
    strOut = null;

    try {
        canvas = document.createElement('canvas');
        strCText = canvas.getContext('2d');
        strCText.textBaseline = "top";
        strCText.font = "14px 'Arial'";
        strCText.textBaseline = "alphabetic";
        strCText.fillStyle = "#f60";
        strCText.fillRect(125, 1, 62, 20);
        strCText.fillStyle = "#069";
        strCText.fillText(strText, 2, 15);
        strCText.fillStyle = "rgba(102, 204, 0, 0.7)";
        strCText.fillText(strText, 4, 17);
        strOut = hashCode(canvas.toDataURL());
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_cookie() {
    "use strict";

    var strOnError, bolCookieEnabled, bolOut;

    strOnError = "Error";
    bolCookieEnabled = null;
    bolOut = null;

    try {
        bolCookieEnabled = navigator.cookieEnabled ? true : false;

        //if not IE4+ nor NS6+
        if (typeof navigator.cookieEnabled === "undefined" && !bolCookieEnabled) {
            document.cookie = "testcookie";
            bolCookieEnabled = document.cookie.indexOf("testcookie") !== -1 ? true : false;
        }
        bolOut = bolCookieEnabled;
        return bolOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_display() {
    "use strict";

    var strSep, strPair, strOnError, strScreen, strDisplay, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strScreen = null;
    strDisplay = null;
    strOut = null;

    try {
        strScreen = window.screen;
        if (strScreen) {
            strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
        }
        strOut = strDisplay;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_language() {
    "use strict";

    var strSep, strPair, strOnError, strLang, strTypeLng, strTypeBrLng, strTypeSysLng, strTypeUsrLng, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strLang = null;
    strTypeLng = null;
    strTypeBrLng = null;
    strTypeSysLng = null;
    strTypeUsrLng = null;
    strOut = null;

    try {
        strTypeLng = _typeof(navigator.language);
        strTypeBrLng = _typeof(navigator.browserLanguage);
        strTypeSysLng = _typeof(navigator.systemLanguage);
        strTypeUsrLng = _typeof(navigator.userLanguage);

        if (strTypeLng !== "undefined") {
            strLang = "lang" + strPair + navigator.language + strSep;
        } else if (strTypeBrLng !== "undefined") {
            strLang = "lang" + strPair + navigator.browserLanguage + strSep;
        } else {
            strLang = "lang" + strPair + strSep;
        }
        if (strTypeSysLng !== "undefined") {
            strLang += "syslang" + strPair + navigator.systemLanguage + strSep;
        } else {
            strLang += "syslang" + strPair + strSep;
        }
        if (strTypeUsrLng !== "undefined") {
            strLang += "userlang" + strPair + navigator.userLanguage;
        } else {
            strLang += "userlang" + strPair;
        }
        strOut = strLang;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_useragent() {
    "use strict";

    var strSep, strTmp, strUserAgent, strOut;

    strSep = "|";
    strTmp = null;
    strUserAgent = null;
    strOut = null;

    /* navigator.userAgent is supported by all major browsers */
    strUserAgent = navigator.userAgent.toLowerCase();
    /* navigator.platform is supported by all major browsers */
    strTmp = strUserAgent + strSep + navigator.platform;
    /* navigator.cpuClass only supported in IE */
    if (navigator.cpuClass) {
        strTmp += strSep + navigator.cpuClass;
    }
    /* navigator.browserLanguage only supported in IE, Safari and Chrome */
    if (navigator.browserLanguage) {
        strTmp += strSep + navigator.browserLanguage;
    } else {
        strTmp += strSep + navigator.language;
    }
    strOut = strTmp;
    return strOut;
}

function fingerprint_timezone() {
    "use strict";

    var strOnError, dtDate, numOffset, numGMTHours, numOut;

    strOnError = "Error";
    dtDate = null;
    numOffset = null;
    numGMTHours = null;
    numOut = null;

    try {
        dtDate = new Date();
        numOffset = dtDate.getTimezoneOffset();
        numGMTHours = numOffset / 60 * -1;
        numOut = numGMTHours;
        return numOut;
    } catch (err) {
        return strOnError;
    }
}

var glbOnError = 'N/A';
var glbSep = '|';

function activeXDetect(componentClassID) {
    "use strict";

    var strComponentVersion, strOut;

    strComponentVersion = "";
    strOut = "";

    try {
        strComponentVersion = document.body.getComponentVersion('{' + componentClassID + '}', 'ComponentID');
        if (strComponentVersion !== null) {
            strOut = strComponentVersion;
        } else {
            strOut = false;
        }
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

function stripIllegalChars(strValue) {
    "use strict";

    var iCounter, strOriginal, strOut;

    iCounter = 0;
    strOriginal = "";
    strOut = "";

    try {
        strOriginal = strValue.toLowerCase();
        for (iCounter = 0; iCounter < strOriginal.length; iCounter = iCounter + 1) {
            if (strOriginal.charAt(iCounter) !== '\n' && strOriginal.charAt(iCounter) !== '/' && strOriginal.charAt(iCounter) !== "\\") {
                strOut = strOut + strOriginal.charAt(iCounter);
            } else if (strOriginal.charAt(iCounter) === '\n') {
                strOut = strOut + "n";
            }
        }
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

function hashtable_containsKey(key) {
    "use strict";

    var bolExists, iCounter;

    bolExists = false;
    iCounter = 0;

    for (iCounter = 0; iCounter < this.hashtable.length; iCounter = iCounter + 1) {
        if (iCounter === key && this.hashtable[iCounter] !== null) {
            bolExists = true;
            break;
        }
    }
    return bolExists;
}

function hashtable_get(key) {
    "use strict";

    return this.hashtable[key];
}

function hashtable_keys() {
    "use strict";

    var keys, iCounter;

    keys = [];
    iCounter = 0;

    for (var i = 0; i < this.hashtable.length; i++) {
        iCounter = i;
        if (this.hashtable[iCounter] !== null) {
            keys.push(iCounter);
        }
    }
    return keys;
}

function hashtable_put(key, value) {
    "use strict";

    if (key === null || value === null) {
        throw "NullPointerException {" + key + "},{" + value + "}";
    }
    this.hashtable[key] = value;
}

function hashtable_size() {
    "use strict";

    var iSize, iCounter, iOut;

    iSize = 0;
    iCounter = 0;
    iOut = 0;

    for (var i = 0; i < this.hashtable.length; i++) {
        iCounter = i;
        if (this.hashtable[iCounter] !== null) {
            iSize = iSize + 1;
        }
    }
    iOut = iSize;
    return iOut;
}

function Hashtable() {
    "use strict";

    this.containsKey = hashtable_containsKey;
    this.get = hashtable_get;
    this.keys = hashtable_keys;
    this.put = hashtable_put;
    this.size = hashtable_size;
    this.hashtable = [];
}

/* Detect Plugins */
function fingerprint_plugins() {
    "use strict";

    var htIEComponents, strKey, strName, strVersion, strTemp, bolFirst, iCount, strMimeType, strOut;

    try {
        /* Create hashtable of IE components */
        htIEComponents = new Hashtable();
        htIEComponents.put('7790769C-0471-11D2-AF11-00C04FA35D02', 'AddressBook'); // Address Book
        htIEComponents.put('47F67D00-9E55-11D1-BAEF-00C04FC2D130', 'AolArtFormat'); // AOL ART Image Format Support
        htIEComponents.put('76C19B38-F0C8-11CF-87CC-0020AFEECF20', 'ArabicDS'); // Arabic Text Display Support
        htIEComponents.put('76C19B34-F0C8-11CF-87CC-0020AFEECF20', 'ChineseSDS'); // Chinese (Simplified) Text Display Support
        htIEComponents.put('76C19B33-F0C8-11CF-87CC-0020AFEECF20', 'ChineseTDS'); // Chinese (traditional) Text Display Support
        htIEComponents.put('238F6F83-B8B4-11CF-8771-00A024541EE3', 'CitrixICA'); // Citrix ICA Client
        htIEComponents.put('283807B5-2C60-11D0-A31D-00AA00B92C03', 'DirectAnim'); // DirectAnimation
        htIEComponents.put('44BBA848-CC51-11CF-AAFA-00AA00B6015C', 'DirectShow'); // DirectShow
        htIEComponents.put('9381D8F2-0288-11D0-9501-00AA00B911A5', 'DynHTML'); // Dynamic HTML Data Binding
        htIEComponents.put('4F216970-C90C-11D1-B5C7-0000F8051515', 'DynHTML4Java'); // Dynamic HTML Data Binding for Java
        htIEComponents.put('D27CDB6E-AE6D-11CF-96B8-444553540000', 'Flash'); // Macromedia Flash
        htIEComponents.put('76C19B36-F0C8-11CF-87CC-0020AFEECF20', 'HebrewDS'); // Hebrew Text Display Support
        htIEComponents.put('630B1DA0-B465-11D1-9948-00C04F98BBC9', 'IEBrwEnh'); // Internet Explorer Browsing Enhancements
        htIEComponents.put('08B0E5C0-4FCB-11CF-AAA5-00401C608555', 'IEClass4Java'); // Internet Explorer Classes for Java
        htIEComponents.put('45EA75A0-A269-11D1-B5BF-0000F8051515', 'IEHelp'); // Internet Explorer Help
        htIEComponents.put('DE5AED00-A4BF-11D1-9948-00C04F98BBC9', 'IEHelpEng'); // Internet Explorer Help Engine
        htIEComponents.put('89820200-ECBD-11CF-8B85-00AA005B4383', 'IE5WebBrw'); // Internet Explorer 5/6 Web Browser
        htIEComponents.put('5A8D6EE0-3E18-11D0-821E-444553540000', 'InetConnectionWiz'); // Internet Connection Wizard
        htIEComponents.put('76C19B30-F0C8-11CF-87CC-0020AFEECF20', 'JapaneseDS'); // Japanese Text Display Support
        htIEComponents.put('76C19B31-F0C8-11CF-87CC-0020AFEECF20', 'KoreanDS'); // Korean Text Display Support
        htIEComponents.put('76C19B50-F0C8-11CF-87CC-0020AFEECF20', 'LanguageAS'); // Language Auto-Selection
        htIEComponents.put('08B0E5C0-4FCB-11CF-AAA5-00401C608500', 'MsftVM'); // Microsoft virtual machine
        htIEComponents.put('5945C046-LE7D-LLDL-BC44-00C04FD912BE', 'MSNMessengerSrv'); // MSN Messenger Service
        htIEComponents.put('44BBA842-CC51-11CF-AAFA-00AA00B6015B', 'NetMeetingNT'); // NetMeeting NT
        htIEComponents.put('3AF36230-A269-11D1-B5BF-0000F8051515', 'OfflineBrwPack'); // Offline Browsing Pack
        htIEComponents.put('44BBA840-CC51-11CF-AAFA-00AA00B6015C', 'OutlookExpress'); // Outlook Express
        htIEComponents.put('76C19B32-F0C8-11CF-87CC-0020AFEECF20', 'PanEuropeanDS'); // Pan-European Text Display Support
        htIEComponents.put('4063BE15-3B08-470D-A0D5-B37161CFFD69', 'QuickTime'); // Apple Quick Time
        htIEComponents.put('DE4AF3B0-F4D4-11D3-B41A-0050DA2E6C21', 'QuickTimeCheck'); // Apple Quick Time Check
        htIEComponents.put('3049C3E9-B461-4BC5-8870-4C09146192CA', 'RealPlayer'); // RealPlayer Download and Record Plugin for IE
        htIEComponents.put('2A202491-F00D-11CF-87CC-0020AFEECF20', 'ShockwaveDir'); // Macromedia Shockwave Director
        htIEComponents.put('3E01D8E0-A72B-4C9F-99BD-8A6E7B97A48D', 'Skype'); // Skype
        htIEComponents.put('CC2A9BA0-3BDD-11D0-821E-444553540000', 'TaskScheduler'); // Task Scheduler
        htIEComponents.put('76C19B35-F0C8-11CF-87CC-0020AFEECF20', 'ThaiDS'); // Thai Text Display Support
        htIEComponents.put('3BF42070-B3B1-11D1-B5C5-0000F8051515', 'Uniscribe'); // Uniscribe
        htIEComponents.put('4F645220-306D-11D2-995D-00C04F98BBC9', 'VBScripting'); // Visual Basic Scripting Support v5.6
        htIEComponents.put('76C19B37-F0C8-11CF-87CC-0020AFEECF20', 'VietnameseDS'); // Vietnamese Text Display Support
        htIEComponents.put('10072CEC-8CC1-11D1-986E-00A0C955B42F', 'VML'); // Vector Graphics Rendering (VML)
        htIEComponents.put('90E2BA2E-DD1B-4CDE-9134-7A8B86D33CA7', 'WebEx'); // WebEx Productivity Tools
        htIEComponents.put('73FA19D0-2D75-11D2-995D-00C04F98BBC9', 'WebFolders'); // Web Folders
        htIEComponents.put('89820200-ECBD-11CF-8B85-00AA005B4340', 'WinDesktopUpdateNT'); // Windows Desktop Update NT
        htIEComponents.put('9030D464-4C02-4ABF-8ECC-5164760863C6', 'WinLive'); // Windows Live ID Sign-in Helper
        htIEComponents.put('6BF52A52-394A-11D3-B153-00C04F79FAA6', 'WinMediaPlayer'); // Windows Media Player (Versions 7, 8 or 9)
        htIEComponents.put('22D6F312-B0F6-11D0-94AB-0080C74C7E95', 'WinMediaPlayerTrad'); // Windows Media Player (Traditional Versions)

        strTemp = "";
        bolFirst = true;

        /* strOpera gives full path of the file, extract the filenames, ignoring description and length */
        if (navigator.plugins.length > 0) {
            for (iCount = 0; iCount < navigator.plugins.length; iCount = iCount + 1) {
                if (bolFirst === true) {
                    strTemp += navigator.plugins[iCount].name;
                    bolFirst = false;
                } else {
                    strTemp += glbSep + navigator.plugins[iCount].name;
                }
            }
        } else if (navigator.mimeTypes.length > 0) {
            strMimeType = navigator.mimeTypes;
            for (iCount = 0; iCount < strMimeType.length; iCount = iCount + 1) {
                if (bolFirst === true) {
                    strTemp += strMimeType[iCount].description;
                    bolFirst = false;
                } else {
                    strTemp += glbSep + strMimeType[iCount].description;
                }
            }
        } else {
            document.body.addBehavior("#default#clientCaps");
            strKey = htIEComponents.keys();
            for (iCount = 0; iCount < htIEComponents.size(); iCount = iCount + 1) {
                strVersion = activeXDetect(strKey[iCount]);
                strName = htIEComponents.get(strKey[iCount]);
                if (strVersion) {
                    if (bolFirst === true) {
                        strTemp = strName + glbPair + strVersion;
                        bolFirst = false;
                    } else {
                        strTemp += glbSep + strName + glbPair + strVersion;
                    }
                }
            }
            strTemp = strTemp.replace(/,/g, ".");
        }
        strTemp = stripIllegalChars(strTemp);
        if (strTemp === "") {
            strTemp = "None";
        }
        strOut = strTemp;
        return strOut;
    } catch (err) {
        return glbOnError;
    }
}

/*console.log("Browser:", fingerprint_browser());
console.log("Canvas:", fingerprint_canvas());
console.log("Cookie:", fingerprint_cookie());
console.log("display:", fingerprint_display());
console.log("Language:", fingerprint_language());
console.log("Timezone:", fingerprint_timezone());
console.log("Plugins:", fingerprint_plugins());
console.log("useragent:", fingerprint_useragent());*/

var component = {
    browser: 0,
    canvas: 1,
    cookie: 2,
    display: 3,
    language: 4,
    timezone: 5,
    plugins: 6,
    useragent: 7
};

var data = [];
data[component.browser] = fingerprint_browser();
data[component.canvas] = fingerprint_canvas();
data[component.cookie] = fingerprint_cookie();
data[component.display] = fingerprint_display();
data[component.language] = fingerprint_language();
data[component.timezone] = fingerprint_timezone();
data[component.plugins] = fingerprint_plugins();
data[component.useragent] = fingerprint_useragent();

function encode_str(str, key) {

    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        bytes[i] = (str.charCodeAt(i) ^ key) & 0xff;
    }
    var decoder = new TextDecoder('utf8');
    return btoa(decoder.decode(bytes));
}

function decode_str(str, key) {
    str = atob(str);
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        bytes[i] = (str.charCodeAt(i) ^ key) & 0xff;
    }
    var decoder = new TextDecoder('utf8');
    return decoder.decode(bytes);
}

var data_string = JSON.stringify(data);
var data_hash = hashCode(data_string);
var packet = btoa(JSON.stringify([encode_str(data_string, data_hash), data_hash]));
console.log(packet);

//let _packet = JSON.parse(atob(packet));
//let _data_hash = _packet[1];
//let _data_string = decode_str(_packet[0], _data_hash);
//console.log(_data_string)
