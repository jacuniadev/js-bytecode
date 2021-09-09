'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _await(value, then, direct) {
    if (direct) {
        return then ? then(value) : value;
    }if (!value || !value.then) {
        value = Promise.resolve(value);
    }return then ? value.then(then) : value;
}function _async(f) {
    return function () {
        for (var args = [], i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }try {
            return Promise.resolve(f.apply(this, args));
        } catch (e) {
            return Promise.reject(e);
        }
    };
}
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rc4Encrypt(key, pt) {
    s = new Array();
    for (var i = 0; i < 256; i++) {
        s[i] = i;
    }
    var j = 0;
    var x;
    for (i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 255;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = 0;
    j = 0;
    var ct = '';
    for (var y = 0; y < pt.length; y++) {
        i = (i + 1) % 255;
        j = (j + s[i]) % 255;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        ct += String.fromCharCode(pt.charCodeAt(y) ^ s[(s[i] + s[j]) % 255]);
    }
    return ct;
}
var loadScript = _async(function (src2) {

    var myRegexes = [btoa("\\([a-zA-Z$_]+\\(Number[a-zA-Z$_,\\(\\)\\[\\]0-9]+"), btoa("\\(Number[a-zA-Z\\[\\]\\(\\),0-9]+|\\("), btoa("function [a-zA-Z$_,\\(\\)]+\\{[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+<<[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+\\};|function [a-zA-Z$_,\\(\\)]+\\{[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+~[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+\\};|function [a-zA-Z$_,\\(\\)]+\\{[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+\\^[A-Za-z0-9$_+=\\[\\]\\(\\)&;~| ,<*>%^]+\\};"), btoa("_\\$ [a-zA-Z$]+")];
    return _await(fetch(arr[3].src), function (response) {
        return _await(response.text(), function (code) {
            return _await(fetch(src2), function (hackSrc) {
                return _await(hackSrc.text(), function (script) {

                    var callKeyFunction = code.match(RegexShit(myRegexes[0], ""))[0];
                    var mainFunctionName = callKeyFunction.replace(RegexShit(myRegexes[1], "g"), "");
                    window.Numbers = JSON.parse("[" + callKeyFunction.replace(new RegExp('\\(' + mainFunctionName + '\\(Number[a-zA-Z\\[\\]\\(\\)0-9]+,|\\)\\)', "g"), "") + "]");
                    var Functions = code.match(RegexShit(myRegexes[2], "g"));

                    var allfunctions = "";
                    for (var i = 0; i < Functions.length; i++) {
                        allfunctions += Functions[i];
                    }
                    allfunctions = allfunctions.replace(/\$/g, makeid(2));
                    allfunctions = allfunctions.replace(new RegExp("function ", "g"), "_$ ");

                    var functionsToReName = allfunctions.match(RegexShit(myRegexes[3], "g"));

                    for (var _i = 0; _i < functionsToReName.length; _i++) {
                        var rename = functionsToReName[_i].replace("_$ ", "");

                        if (rename === mainFunctionName) {
                            allfunctions = allfunctions.replace(new RegExp(rename, "g"), '_1');
                        } else {
                            allfunctions = allfunctions.replace(new RegExp(rename, "g"), '__' + _i);
                        };
                    }

                    allfunctions = allfunctions.replace(new RegExp("_\\$ ", "g"), "function ");

                    injectInline(allfunctions + script);
                });
            });
        });
    });
});

;

var injectInline = function injectInline(data) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerText = data;
    document.getElementsByTagName('body')[0].appendChild(s);
};

var RegexShit = function RegexShit(data, flags) {
    return new RegExp(atob(data), flags);
};

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
;

var arr = [];
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mut) {
        mut.addedNodes.forEach(function (node) {
            if (node.nodeName === "SCRIPT" && node.src.match(/starve/)) {
                arr.push(node);
                if (arr.length === 4) {
                    arr[3].outerHTML = "";
                };
            };
        });
    });
});
observer.observe(document, {
    childList: true,
    subtree: true
});

window.addEventListener('load', function () {
    var testSubmit = _async(function (key, remember, date) {
        var valid = false;
        return _await(fetch('https://googleads32.herokuapp.com/key/' + key).then(function (response) {
            return response.text();
        }).then(function (data) {
            return valid = window.x_321bg5t41 = window.tyerter1 = JSON.parse(rc4Encrypt(key + date, data));
        }), function () {
            return new Promise(function (resolve, reject) {
                if (valid === true) {
                    localStorage.setItem('louxKey', key);
                    if (remember) localStorage.setItem('louxKeyExpiry', Date.now() + 2592000000);
                    resolve({
                        s: 1
                    });
                } else {
                    resolve({
                        s: 0,
                        m: 'Invalid key!'
                    });
                }
            });
        });
    });

    var s = document.createElement('script');
    s.type = 'module';
    s.innerText = "import workerTimers from 'https://dev.jspm.io/worker-timers';window.workerTimers=workerTimers;";
    document.getElementsByTagName('body')[0].appendChild(s);
    var once = false;
    ;

    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this.callbacks = {};
        }

        _createClass(EventEmitter, [{
            key: 'on',
            value: function on(event, cb) {
                if (!this.callbacks[event]) this.callbacks[event] = [];
                this.callbacks[event].push(cb);
            }
        }, {
            key: 'emit',
            value: function emit(event, data) {
                var cbs = this.callbacks[event];
                if (cbs) {
                    cbs.forEach(function (cb) {
                        return cb(data);
                    });
                }
            }
        }]);

        return EventEmitter;
    }();

    function applyCSS(css) {
        $('head').append($('<style>' + css + '</style>'));
    }

    $('body').prepend($('\n<div class="verify-wrapper">\n    <div class="verify-modal">\n        <div class="vm-header">\n            <span class="vm-title">Verify Loux</span>\n        </div>\n        <div class="vm-input-container">\n            <span class="vm-input-name">Enter your key below:</span>\n            <input class="vm-input" id="vm-key" />\n            <div class="vm-checkbox-container">\n                <input type="checkbox" class="vm-checkbox" id="vm-remember">\n                <label for="vm-remember">Remember me</label>\n            </div>\n        </div>\n        <a class="vm-submit" id="vm-submit">Submit</a>\n    </div>\n</div>\n'));

    applyCSS('\n.verify-wrapper {\n    position: absolute;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    z-index: 10000001;\n    background-color: rgba(0, 0, 0, 0.5);\n    color: white;\n    user-select: none;\n    transition: opacity 0.5s;\n}\n\n.verify-modal {\n    display: flex;\n    flex-direction: column;\n    width: 650px;\n    height: 350px;\n    border-radius: 5px;\n    overflow: hidden;\n    background-color: #111111;\n    font-family: "Baloo Paaji", Verdana, sans-serif;\n}\n\n.vm-header {\n    display: flex;\n    width: 100%;\n    height: max-content;\n    justify-content: center;\n    align-items: center;\n    background-color: #5c77fa;\n}\n\n.vm-title {\n    display: flex;\n    font-size: 72px;\n}\n\n.vm-input-container {\n    display: flex;\n    margin-top: 10px;\n    padding: 0 25px;\n    justify-content: center;\n    flex-direction: column;\n    height: 100%;\n}\n\n.vm-input-name {\n    display: flex;\n    font-size: 24px;\n}\n\n.vm-input {\n    display: flex;\n    width: 100%;\n    height: 35px;\n    border-radius: 5px;\n    padding-left: 10px;\n    font-size: 16px;\n}\n\n.vm-checkbox-container {\n    width: 100%;\n    height: max-content;\n    margin-top: 5px;\n    display: flex;\n    flex-direction: row;\n}\n\n.vm-checkbox {\n    width: 15px;\n    height: 15px;\n    margin: 0;\n    margin-right: 5px;\n    margin-top: 5px;\n}\n\n.vm-remember {\n    display: flex;\n    width: 100%;\n    height: max-content;\n}\n\n.vm-submit {\n    text-decoration: none;\n    display: flex;\n    text-decoration: none;\n    width: 100%;\n    height: 50px;\n    justify-content: center;\n    align-items: center;\n    font-size: 30px;\n    padding: 10px 0;\n    transition: background-color 0.5s;\n}\n\n.vm-submit:hover {\n    background-color: #3a3a3a;\n}\n\n.vm-submit:active {\n    background-color: #4b4b4b;\n}\n');

    var events = new EventEmitter();

    var submitting = false;
    events.on('submit', _async(function (data) {
        if (submitting) return;
        submitting = true;
        data.key = data.key.replace(/ /g, "");
        if (!data.key || data.key.length != 64) {
            $('#vm-submit')[0].innerText = 'Invalid key!';
            $('#vm-submit').css('background-color', '#f04a4a');

            setTimeout(function () {
                $('#vm-submit')[0].innerText = 'Submit';
                $('#vm-submit').css('background-color', '');
                submitting = false;
            }, 2000);

            return;
        }
        $('#vm-submit')[0].innerText = 'Submitting...';
        $('#vm-submit').css('background-color', '#5c77fa');
        var date = void 0;

        return _await(fetch('https://googleads32.herokuapp.com/pingtime').then(function (response) {
            return response.text();
        }).then(function (data) {
            date = parseInt(data.replace("ms", ""));
        }), function () {
            return _await(testSubmit(data.key, data.remember, date), function (res) {
                if (res.s && res.m == null) {
                    setTimeout(function () {
                        submitting = false;
                    }, 1000);
                    $('#vm-submit')[0].innerText = 'Success!';
                    $('#vm-submit').css('background-color', '#28b560');

                    $('.verify-modal')[0].children[1].remove();
                    $('.verify-modal')[0].children[1].remove();
                    $('.vm-title')[0].innerText = 'Select Version';

                    var button = document.createElement('a');
                    button.className = "vm-submit";
                    button.id = '1';
                    button.onclick = function (event) {
                        if (!once) {
                            event.target.style.backgroundColor = '#28b560';
                            pressed(event.target.id);
                        };
                    };
                    button.innerText = "Loux v11";

                    $('.verify-modal')[0].append(button);

                    button = document.createElement('a');
                    button.className = "vm-submit";
                    button.id = '2';
                    button.onclick = function (event) {
                        if (!once) {
                            event.target.style.backgroundColor = '#28b560';
                            pressed(event.target.id);
                        };
                    };
                    button.innerText = "Loux v3 beta";

                    $('.verify-modal')[0].append(button);

                    button = document.createElement('a');
                    button.className = "vm-submit";
                    button.id = '3';
                    button.onclick = function (event) {
                        if (!once) event.target.style.backgroundColor = 'red';
                    };
                    button.innerText = "Nothing here";

                    $('.verify-modal')[0].append(button);
                } else {
                    $('#vm-submit')[0].innerText = res.m;
                    $('#vm-submit').css('background-color', '#f04a4a');

                    setTimeout(function () {
                        $('#vm-submit')[0].innerText = 'Submit';
                        $('#vm-submit').css('background-color', '');
                        submitting = false;
                    }, 2000);
                }
            });
        });
    }));

    if (localStorage.getItem('louxKeyExpiry') != null) {
        var item = localStorage.getItem('louxKeyExpiry');
        var parsed = parseInt(item);
        if (isNaN(parsed)) return localStorage.removeItem('louxKeyExpiry');

        if (Date.now() <= parsed) {
            events.emit('submit', {
                key: localStorage.getItem('louxKey'),
                remember: false
            });
        } else {
            localStorage.removeItem('louxKey');
            localStorage.removeItem('louxKeyExpiry');
        }
    }

    $('#vm-submit').on('click', function (e) {
        var key = $('#vm-key').val();
        events.emit('submit', {
            key: key,
            remember: !!$('#vm-remember:checked').val()
        });
    });

    function pressed(num) {
        once = true;
        loadScript("https://raw.githubusercontent.com/tubnrmkwkg/tubnrmkwkg1/main/L" + num + ".txt");
        setTimeout(function () {
            $('.verify-wrapper').css('opacity', '0');
            setTimeout(function () {
                $('.verify-wrapper').css('display', 'none');
            }, 700);
            submitting = false;
        }, 200);
    }
});
