var Aheui = (function (exports) {
    if (typeof exports !== 'object')
        exports = {};
    var choTable = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
        'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
        'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];
    exports.choTable = choTable;
    var jungTable = [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
        'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
        'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
        'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
        'ㅣ'
    ];
    exports.jungTable = jungTable;
    var jongTable = [
        '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
        'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
        'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
        'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
        'ㅌ', 'ㅍ', 'ㅎ'
    ];
    exports.jongTable = jongTable;
    var parameterCounts = [
        // 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
        0, 0, 2, 2, 2,
        // 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        2, 1, 0, 1, 0,
        // 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
        1, 0, 2, 0, 1,
        // 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        0, 2, 2, 0
    ];
    exports.parameterCounts = parameterCounts;
    var xSpeedTable = [
        // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
        1, undefined, 2, undefined, -1,
        // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
        undefined, -2, undefined, 0, undefined,
        // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
        undefined, undefined, 0, 0, undefined,
        // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
        undefined, undefined, 0, undefined, 'reflect',
        // 'ㅣ'
        'reflect'
    ];
    exports.xSpeedTable = xSpeedTable;
    var ySpeedTable = [
        // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
        0, undefined, 0, undefined, 0,
        // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
        undefined, 0, undefined, -1, undefined,
        // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
        undefined, undefined, -2, 1, undefined,
        // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
        undefined, undefined, 2, 'reflect', 'reflect',
        // 'ㅣ'
        undefined
    ];
    exports.ySpeedTable = ySpeedTable;
    var strokeCountTable = [
        // '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
        0, 2, 4, 4, 2,
        // 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
        5, 5, 3, 5, 7,
        // 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
        9, 9, 7, 9, 9,
        // 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
        8, 4, 4, 6, 2,
        // 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
        4, 1, 3, 4, 3,
        // 'ㅌ', 'ㅍ', 'ㅎ'
        4, 4, 3
    ];
    exports.strokeCountTable = strokeCountTable;
    var operationMap = (function () {
        function arithmetic (operator) {
            return (function (machine, jong) {
                var storage = machine.storage;
                var right = storage.pop() | 0;
                var left = storage.pop() | 0;
                storage.push((operator(left, right)) | 0);
                return false;
            });
        };
        return {
            // 'ㅇ' 묶음
            'ㅇ': function (machine, jong) {
                return false;
            },
            'ㅎ': function (machine, jong) {
                return true;
            },
            // 'ㄷ' 묶음
            'ㄷ': arithmetic(function (left, right) { return left + right; }),
            'ㄸ': arithmetic(function (left, right) { return left * right; }),
            'ㅌ': arithmetic(function (left, right) { return left - right; }),
            'ㄴ': arithmetic(function (left, right) { return left / right; }),
            'ㄹ': arithmetic(function (left, right) { return left % right; }),
            // 'ㅁ' 묶음
            'ㅁ': function (machine, jong) {
                var storage = machine.storage;
                var output = machine.output;
                var pop = storage.pop();
                switch (jongTable[jong]) {
                case 'ㅇ':
                    output(pop);
                    break;
                case 'ㅎ':
                    output(String.fromCodePoint(pop));
                    break;
                }
                return false;
            },
            'ㅂ': function (machine, jong) {
                var storage = machine.storage;
                var input = machine.input;
                var push = storage.push;
                switch (jongTable[jong]) {
                case 'ㅇ':
                    push(input('number'));
                    break;
                case 'ㅎ':
                    push(input('character'));
                    break;
                default:
                    push(strokeCountTable[jong]);
                    break;
                }
                return false;
            },
            'ㅃ': function (machine, jong) {
                var storage = machine.storage;
                storage.duplicate();
                return false;
            },
            'ㅍ': function (machine, jong) {
                var storage = machine.storage;
                storage.swap();
                return false;
            },
            // 'ㅅ' 묶음
            'ㅅ': function (machine, jong) {
                machine.selectStorage(jong);
                return false;
            },
            'ㅆ': function (machine, jong) {
                var storage = machine.storage;
                storage.send(machine.getStorage(jong));
                return false;
            },
            'ㅈ': function (machine, jong) {
                var storage = machine.storage;
                storage.push((storage.pop() <= storage.pop()) ? 1 : 0);
                return false;
            },
            'ㅊ': function (machine, jong) {
                var storage = machine.storage;
                if (storage.pop() === 0)
                    machine.cursor.reflect();
                return false;
            }
        };
    })();
    exports.operationMap = operationMap;

    function isAheuiCode(code) {
        return /^[가-힣]$/.test(code.toString());
    }
    exports.isAheuiCode = isAheuiCode;
    function isComment(code) {
        return !isAheuiCode(code.toString());
    }
    exports.isComment = isComment;

    function indexExtractor(table, extractFunction) {
        function extractIndex(code) {
            switch (typeof code) {
            case 'number':
                return code | 0;
            case 'string':
                code = code.charAt();
                if (isAheuiCode(code))
                    return extractFunction(code.charCodeAt() - '가'.charCodeAt());
                else
                    return table.indexOf(code);
                break;
            case 'object':
                return extractIndex(code.toString());
            default:
                return -1;
            }
        }
        return extractIndex;
    }
    var cho = indexExtractor(choTable, function (syllableCode) {
        return (syllableCode / 588) | 0;
    });
    exports.cho = cho;
    var jung = indexExtractor(jungTable, function (syllableCode) {
        return (((syllableCode / 28) | 0) % 21) | 0;
    });
    exports.jung = jung;
    var jong = indexExtractor(jongTable, function (syllableCode) {
        return (syllableCode % 28) | 0;
    });
    exports.jong = jong;

    function code(char) {
        function toString() {
            return char;
        }
        if (isAheuiCode(char)) {
            return {
                char: char,
                cho: cho(char),
                jung: jung(char),
                jong: jong(char),
                toString: toString
            }
        }
        else {
            return {
                char: char,
                cho: -1,
                jung: -1,
                jong: -1,
                toString: toString
            }
        }
    }
    exports.code = code;
    function codeSpace(sourceCode) {
        return sourceCode.split(/\r?\n/g).map(function (line) {
            return line.split('').map(function (char) {
                return code(char);
            });
        });
    }
    exports.codeSpace = codeSpace;

    function Machine(codeSpace) {
        var self = this;
        self.terminated = false;
        self.cursor; var cursor;
        self.storage; var storages;
        self.run;
        self.step;
        self.input;
        self.output;
        self.getStorage;
        self.selectStorage;
        self.dump;
        //
        storages = (function () {
            var storage;
            var storages = [];
            for (var i = 0; i < jongTable.length; ++i) {
                switch (jongTable[i]) {
                case 'ㅇ':
                    storage = new Storage('queue');
                    break;
                case 'ㅎ':
                    storage = new Storage('pipe');
                    break;
                default:
                    storage = new Storage('stack');
                    break;
                }
                storages.push(storage);
            }
            return storages;
        })();
        self.cursor = cursor = new Cursor(0, 0, 0, 1);
        self._selectedStorage = 0;
        self.storage = storages[self._selectedStorage];
        self.run = function (terminateFunction) {
            self.terminated = false;
            while (!self.terminated)
                self.step();
            var result = self.storage.pop() | 0;
            if (typeof terminateFunction !== 'undefined')
                terminateFunction(result);
        };
        self.step = function () {
            var code = cursor.point(codeSpace);
            var cursorTurnResult = null;
            var cursorReflectResult = null;
            var cursorMoveResult = null;
            if (typeof code !== 'undefined') {
                var operation = operationMap[choTable[code.cho]];
                cursorTurnResult = cursor.turn(code.jung);
                if (typeof operation !== 'undefined') {
                    if (self.storage.count() < parameterCounts[code.cho]) {
                        cursorReflectResult = cursor.reflect();
                    } else {
                        self.terminated = operation(self, code.jong);
                    }
                }
            }
            if (!self.terminated) {
                cursorMoveResult = cursor.move(codeSpace);
            }
            return {
                cursorTurnResult: cursorTurnResult,
                cursorReflectResult: cursorReflectResult,
                cursorMoveResult: cursorMoveResult
            };
        };
        self.input = function () {
            return '';
        };
        self.output = function (value) {
            console.log(value);
        };
        self.getStorage = function (code) {
            return storages[jong(code)];
        };
        self.selectStorage = function (code) {
            self._selectedStorage = jong(code);
            self.storage = self.getStorage(self._selectedStorage);
        };
        self.dump = function (format) {
            switch (format) {
            default:
            case 'classic': case 'classic korean':
            case 'jsaheui': case 'jsaheui korean':
                return classicStyleDump('ko');
            case 'classic english': case 'jsaheui english':
                return classicStyleDump('en');
            }
            function classicStyleDump(lang) {
                var coordMsg;
                var charMsg;
                var code = cursor.point(codeSpace);
                switch (lang) {
                default: case 'ko':
                    coordMsg = '위치';
                    charMsg = '명령';
                    break;
                case 'en':
                    coordMsg = 'Coord';
                    charMsg = 'Char';
                    break;
                }
                return [
                    coordMsg + ': (' + cursor.x + ', ' + cursor.y + ')',
                    charMsg + ': ' + (code ? code.toString() : '')
                ].concat(storages.map(function (storage, index) {
                    return [
                        (storage === self.storage) ? '>' : '',
                        String.fromCharCode('아'.charCodeAt() + index),
                        ': ',
                        storage.dump('csv reversed')
                    ].join('');
                })).join('\n') + '\n'; // join by newline and add trailing newline
            }
        };
    }
    exports.Machine = Machine;

    function Cursor(x, y, xSpeed, ySpeed) {
        var self = this;
        self.x = (typeof x === 'undefined') ? 0 : x;
        self.y = (typeof y === 'undefined') ? 0 : y;
        self.xSpeed = (typeof xSpeed === 'undefined') ? 0 : xSpeed;
        self.ySpeed = (typeof ySpeed === 'undefined') ? 0 : ySpeed;
        self.point = function (codeSpace) {
            var line = codeSpace[self.y];
            return (typeof line !== 'undefined') ? line[self.x] : undefined;
        };
        self.reflect = function () {
            self.xSpeed = -self.xSpeed;
            self.ySpeed = -self.ySpeed;
            return {
                xReflected: self.xSpeed !== 0,
                yReflected: self.ySpeed !== 0
            };
        };
        self.turn = function (jung) {
            var xSpeed = xSpeedTable[jung];
            var ySpeed = ySpeedTable[jung];
            var xReflected = false;
            var yReflected = false;
            var xTurned = false;
            var yTurned = false;
            switch (xSpeed) {
            case 'reflect':
                if (self.xSpeed !== 0) xReflected = true;
                self.xSpeed = -self.xSpeed;
                break;
            case undefined:
                break;
            default:
                if (self.xSpeed !== xSpeed) xTurned = true;
                self.xSpeed = xSpeed;
                break;
            }
            switch (ySpeed) {
            case 'reflect':
                if (self.ySpeed !== 0) yReflected = true;
                self.ySpeed = -self.ySpeed;
                break;
            case undefined:
                break;
            default:
                if (self.ySpeed !== ySpeed) yTurned = true;
                self.ySpeed = ySpeed;
                break;
            }
            return {
                xReflected: xReflected,
                yReflected: yReflected,
                xTurned: xTurned,
                yTurned: yTurned
            };
        };
        self.move = function (codeSpace) {
            var xSpeed = self.xSpeed;
            var ySpeed = self.ySpeed;
            var xWrapped = false;
            var yWrapped = false;
            self.x += self.xSpeed;
            self.y += self.ySpeed;
            var line = codeSpace[self.y];
            var width = line ? line.length : 0;
            var height = codeSpace.length;
            if (self.x < 0 && self.xSpeed < 0) {
                xWrapped = true;
                self.x = width - 1;
            }
            if (self.x >= width && self.xSpeed > 0) {
                xWrapped = true;
                self.x = 0;
            }
            if (self.y < 0 && self.ySpeed < 0) {
                yWrapped = true;
                self.y = height - 1;
            }
            if (self.y >= height && self.ySpeed > 0) {
                yWrapped = true;
                self.y = 0;
            }
            return {
                xSpeed: xSpeed,
                ySpeed: ySpeed,
                xWrapped: xWrapped,
                yWrapped: yWrapped
            };
        };
    }
    exports.Cursor = Cursor;

    function Storage(type) { // 'stack', 'queue'
        var self = this;
        self.push; var array = [];
        self.pop;
        self.duplicate;
        self.swap;
        self.send;
        self.count;
        self.dump;
        //
        self._getArray = function () {
            return array;
        };
        self.push = function (v) {
            return array.push(v);
        };
        self.send = function (to) {
            to.push(self.pop() | 0);
        };
        self.count = function () {
            return array.length;
        };
        self.dump = function (format) {
            switch (format) {
            default: case 'csv':
                return array.join(',');
            case 'csv reversed':
                return array.concat().reverse().join(',');
            }
        };
        switch (type) {
        case 'stack':
            self.pop = function () {
                return array.pop();
            };
            self.duplicate = function () {
                return array.push(array[array.length - 1]);
            };
            self.swap = function () {
                var a = array.pop();
                var b = array.pop();
                array.push(a);
                array.push(b);
            };
            break;
        case 'queue':
            self.pop = function () {
                return array.shift();
            };
            self.duplicate = function () {
                return array.unshift(array[0]);
            };
            self.swap = function () {
                var temp = array[0];
                array[0] = array[1];
                array[1] = temp;
            };
            break;
        case 'pipe':
            // undefined behavior
            self.pop = function () {
                return array.shift();
            };
            self.duplicate = function () {
                return array.unshift(a[0]);
            };
            self.swap = function () {
                var temp = array[0];
                array[0] = array[1];
                array[1] = temp;
            };
            break;
        default:
            throw 'undefined stoarage type: ' + type;
        }
    }
    exports.Storage = Storage;
    return exports;
})(typeof module !== 'undefined' ? module.exports : {});
