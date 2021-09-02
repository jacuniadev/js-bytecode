(function () {
    'use strict';
    var Op;
    (function (Op) {
        Op[Op['Jump'] = 0] = 'Jump';
        Op[Op['END'] = 1] = 'END';
        Op[Op['I8'] = 2] = 'I8';
        Op[Op['I32'] = 3] = 'I32';
        Op[Op['BOOL'] = 4] = 'BOOL';
        Op[Op['String'] = 5] = 'String';
        Op[Op['JumpIfFalse'] = 6] = 'JumpIfFalse';
        Op[Op['JumpToBlock'] = 7] = 'JumpToBlock';
        Op[Op['JumpToStart'] = 8] = 'JumpToStart';
        Op[Op['GetArguments'] = 9] = 'GetArguments';
        Op[Op['LessThan'] = 10] = 'LessThan';
        Op[Op['LessThanOrEqual'] = 11] = 'LessThanOrEqual';
        Op[Op['GreaterThan'] = 12] = 'GreaterThan';
        Op[Op['GreaterThanOrEqual'] = 13] = 'GreaterThanOrEqual';
        Op[Op['EqualTo'] = 14] = 'EqualTo';
        Op[Op['EqualToStrict'] = 15] = 'EqualToStrict';
        Op[Op['NotEqualTo'] = 16] = 'NotEqualTo';
        Op[Op['NotEqualToStrict'] = 17] = 'NotEqualToStrict';
        Op[Op['Add'] = 18] = 'Add';
        Op[Op['Sub'] = 19] = 'Sub';
        Op[Op['Divide'] = 20] = 'Divide';
        Op[Op['Multiply'] = 21] = 'Multiply';
        Op[Op['Remainder'] = 22] = 'Remainder';
        Op[Op['BitAnd'] = 23] = 'BitAnd';
        Op[Op['BitOr'] = 24] = 'BitOr';
        Op[Op['BitXOR'] = 25] = 'BitXOR';
        Op[Op['BitLeftShift'] = 26] = 'BitLeftShift';
        Op[Op['BitRightShift'] = 27] = 'BitRightShift';
        Op[Op['BitZeroFillRightShift'] = 28] = 'BitZeroFillRightShift';
        Op[Op['RaiseExponent'] = 29] = 'RaiseExponent';
        Op[Op['AssignValue'] = 30] = 'AssignValue';
        Op[Op['AssignValueToGlobal'] = 31] = 'AssignValueToGlobal';
        Op[Op['GetVariableValue'] = 32] = 'GetVariableValue';
        Op[Op['GetObjectProperty'] = 33] = 'GetObjectProperty';
        Op[Op['SetObjectProperty'] = 34] = 'SetObjectProperty';
        Op[Op['GetGlobalVariableValue'] = 35] = 'GetGlobalVariableValue';
        Op[Op['CreateFunction'] = 36] = 'CreateFunction';
        Op[Op['Call'] = 37] = 'Call';
        Op[Op['ObjectPropertyCall'] = 38] = 'ObjectPropertyCall';
        Op[Op['ReturnValue'] = 39] = 'ReturnValue';
        Op[Op['RegisterString'] = 40] = 'RegisterString';
        Op[Op['MakeArray'] = 41] = 'MakeArray';
        Op[Op['MakeObject'] = 42] = 'MakeObject';
        Op[Op['This'] = 43] = 'This';
        Op[Op['GetArgs'] = 44] = 'GetArgs';
        Op[Op['Debugger'] = 45] = 'Debugger';
        Op[Op['PlusPlus'] = 46] = 'PlusPlus';
        Op[Op['MinusMinus'] = 47] = 'MinusMinus';
        Op[Op['PropertyPlusPlus'] = 48] = 'PropertyPlusPlus';
        Op[Op['PropertyMinusMinus'] = 49] = 'PropertyMinusMinus';
        Op[Op['GlobalScope'] = 50] = 'GlobalScope';
        Op[Op['New'] = 51] = 'New';
        Op[Op['Or'] = 52] = 'Or';
        Op[Op['And'] = 53] = 'And';
        Op[Op['NotSymbol'] = 54] = 'NotSymbol';
        Op[Op['TypeOf'] = 55] = 'TypeOf';
        Op[Op['NegateSymbol'] = 56] = 'NegateSymbol';
        Op[Op['InstanceOf'] = 57] = 'InstanceOf';
        Op[Op['Throw'] = 58] = 'Throw';
        Op[Op['Null'] = 59] = 'Null';
        Op[Op['In'] = 60] = 'In';
        Op[Op['Delete'] = 61] = 'Delete';
        Op[Op['MinusOutFront'] = 62] = 'MinusOutFront';
        Op[Op['PlusOutFront'] = 63] = 'PlusOutFront';
        Op[Op['Void'] = 64] = 'Void';
    }(Op || (Op = {})));
    let globalScope = 'object' == typeof globalThis ? globalThis : 'object' == typeof window ? window : self;
    let construct = 'object' == typeof Reflect && 'function' == typeof Reflect.construct ? Reflect.construct : function (n, t) {
        var i = [null];
        Array.prototype.push.apply(i, t);
        return new (Function.prototype.bind.apply(n, i))();
    };
    let decode = typeof atob === 'function' ? function (base64) {
        var binary_string = atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    } : function (str) {
        return new Uint8Array(Buffer.from(str, 'base64'));
    };
    function testIsGlobalPropOrFunction(n) {
        n in globalScope || function (n) {
            throw 0;
        }(n);
    }
    let __scopes =     [
        [
            0,
            -1,
            0,
            [],
            111
        ],
        [
            1,
            0,
            1,
            [],
            0
        ],
        [
            2,
            1,
            1,
            [[
                    0,
                    0
                ]],
            87
        ]
    ];;
    let __program = 'BQgAAAAjBQEAAAAhBQIAAAAFAAAAAAUHAAAAIyYCBQMAAAAhHgAAAAAFCAAAACMFAQAAACEFAgAAAAUDAAAAJAIAAAAqAQAAAAUEAAAABQcAAAAjJgMBKwUGAAAAKQEAAAAFBQAAACAAAAAAJgIBKBhnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoCXByb3RvdHlwZSgDc3JjKANzZXQoDmRlZmluZVByb3BlcnR5KAVhcHBseSieaHR0cHM6Ly9pbWFnZXMudGhlY29udmVyc2F0aW9uLmNvbS9maWxlcy8zNTA4NjUvb3JpZ2luYWwvZmlsZS0yMDIwMDgwMy0yNC01MHU5MXUuanBnP2l4bGliPXJiLTEuMS4wJnJlY3Q9MzclMkMyOSUyQzQ5NTUlMkMzMjkzJnE9NDUmYXV0bz1mb3JtYXQmdz05MjYmZml0PWNsaXAoBk9iamVjdCgFSW1hZ2UoBnNldFNyYwcBAAAAAQ==';
    let a = [];
    a[Op.CreateFunction] = function (block) {
        let blockid = block.readI32();
        block.stack.push(block.runChild(blockid).makeFn());
    };
    a[Op.Call] = function (block) {
        let totalArgs = block.readI8();
        let args = [];
        let fn = block.stack.pop();
        for (let i = 0; i < totalArgs; i++)
            args[totalArgs - i - 1] = block.stack.pop();
        let val = fn.apply(block.scope, args);
        block.stack.push(val);
    };
    a[Op.ReturnValue] = function (block) {
        let value = block.stack.pop();
        block.returnRegister = value;
        block.U++;
    };
    a[Op.RegisterString] = function (block) {
        block._loadString();
    };
    a[Op.AssignValueToGlobal] = function (block) {
        let prop = block.stack.pop();
        let val = block.stack.pop();
        block.stack.push(block.scope[prop] = val);
    };
    a[Op.GetGlobalVariableValue] = function (block) {
        let prop = block.stack.pop();
        testIsGlobalPropOrFunction(prop);
        block.stack.push(globalScope[prop]);
    };
    a[Op.GetArguments] = function (block) {
        let index = block.readI8();
        block.stack.push(block.args[index]);
    };
    a[Op.ObjectPropertyCall] = function (block) {
        let totalArgs = block.readI8();
        let args = [];
        let obj = block.stack.pop();
        let prop = block.stack.pop();
        for (let i = 0; i < totalArgs; i++)
            args[totalArgs - i - 1] = block.stack.pop();
        let fn = obj[prop];
        let val = fn.apply(obj, args);
        block.stack.push(val);
    };
    a[Op.String] = function (block) {
        let str = block.readString();
        block.stack.push(str);
    };
    a[Op.GetObjectProperty] = function (block) {
        let prop = block.stack.pop();
        let obj = block.stack.pop();
        block.stack.push(obj[prop]);
    };
    a[Op.MakeArray] = function (block) {
        let elements = block.readI32();
        let arr = new Array(elements);
        for (let i = 0; i < elements; i++)
            arr[elements - i - 1] = block.stack.pop();
        block.stack.push(arr);
    };
    a[Op.Debugger] = function (block) {
        debugger;
    };
    a[Op.MakeObject] = function (block) {
        let props = block.readI32();
        let obj = {};
        let values = new Array(props * 2);
        for (let i = 0; i < props; i++) {
            values[(props - i) * 2 - 1] = block.stack.pop();
            values[(props - i) * 2 - 1 - 1] = block.stack.pop();
        }
        for (let i = 0; i < props * 2; i += 2) {
            obj[values[i]] = values[i + 1];
        }
        block.stack.push(obj);
    };
    a[Op.This] = function (block) {
        block.stack.push(block.scope);
    };
    a[Op.SetObjectProperty] = function (block) {
        let property = block.stack.pop();
        let obj = block.stack.pop();
        let value = block.stack.pop();
        obj[property] = value;
    };
    a[Op.AssignValue] = function (block) {
        let index = block.readI32();
        let value = block.stack.pop();
        block.stack.push(block.definitions[index].value = value);
    };
    a[Op.Or] = function (block) {
        let r = block.stack.pop();
        let l = block.stack.pop();
        block.stack.push(r || l);
    };
    a[Op.And] = function (block) {
        let r = block.stack.pop();
        let l = block.stack.pop();
        block.stack.push(r && l);
    };
    a[Op.NotSymbol] = function (block) {
        let val = block.stack.pop();
        block.stack.push(!val);
    };
    a[Op.NegateSymbol] = function (block) {
        let val = block.stack.pop();
        block.stack.push(~val);
    };
    a[Op.TypeOf] = function (block) {
        let val = block.stack.pop();
        block.stack.push(typeof val);
    };
    a[Op.GetVariableValue] = function (block) {
        let index = block.readI32();
        let value = block.definitions[index].value;
        block.stack.push(value);
    };
    a[Op.I8] = function (block) {
        let num = block.readI8();
        block.stack.push(num);
    };
    a[Op.I32] = function (block) {
        let num = block.readI32();
        block.stack.push(num);
    };
    a[Op.BOOL] = function (block) {
        let bool = !!block.readI8();
        block.stack.push(bool);
    };
    a[Op.Jump] = function (block) {
        let dst = block.readI32();
        block.ip = dst;
    };
    a[Op.JumpToBlock] = function (block) {
        let blockid = block.readI32();
        block.runChild(blockid).makeFn().apply(block.scope);
    };
    a[Op.JumpIfFalse] = function (block) {
        let dst = block.readI32();
        let val = block.stack.pop();
        if (!val)
            block.ip = dst;
    };
    a[Op.New] = function (block) {
        let totalArgs = block.readI32();
        let args = new Array(totalArgs);
        for (let i = 0; i < totalArgs; i++)
            args[totalArgs - i - 1] = block.stack.pop();
        let obj = block.stack.pop();
        let instace = construct(obj, args);
        block.stack.push(instace);
    };
    a[Op.END] = function (block) {
        block.returnRegister = undefined;
        block.U++;
        block.ip = -1;
        block.S = [];
    };
    a[Op.LessThan] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left < right);
    };
    a[Op.LessThanOrEqual] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left <= right);
    };
    a[Op.GreaterThan] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left > right);
    };
    a[Op.GreaterThanOrEqual] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left >= right);
    };
    a[Op.EqualTo] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left == right);
    };
    a[Op.EqualToStrict] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left === right);
    };
    a[Op.NotEqualTo] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left != right);
    };
    a[Op.NotEqualToStrict] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left !== right);
    };
    a[Op.Add] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left + right);
    };
    a[Op.Sub] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left - right);
    };
    a[Op.Multiply] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left * right);
    };
    a[Op.Divide] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left / right);
    };
    a[Op.Remainder] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left % right);
    };
    a[Op.InstanceOf] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left instanceof right);
    };
    a[Op.MinusOutFront] = function (block) {
        let val = block.stack.pop();
        block.stack.push(-val);
    };
    a[Op.PlusOutFront] = function (block) {
        let val = block.stack.pop();
        block.stack.push(+val);
    };
    a[Op.Void] = function (block) {
        let val = block.stack.pop();
        block.stack.push(void val);
    };
    a[Op.Delete] = function (block) {
        let prop = block.stack.pop();
        let obj = block.stack.pop();
        block.stack.push(delete obj[prop]);
    };
    a[Op.In] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left in right);
    };
    a[Op.Throw] = function (block) {
        let arg = block.stack.pop();
        throw 1;
    };
    a[Op.Null] = function (block) {
        block.stack.push(null);
    };
    a[Op.BitAnd] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left & right);
    };
    a[Op.BitOr] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left | right);
    };
    a[Op.BitXOR] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left ^ right);
    };
    a[Op.BitLeftShift] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left << right);
    };
    a[Op.BitRightShift] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left >> right);
    };
    a[Op.BitZeroFillRightShift] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(left >>> right);
    };
    a[Op.PlusPlus] = function (block) {
        let varid = block.readI32();
        block.stack.push(block.definitions[varid].value++);
    };
    a[Op.RaiseExponent] = function (block) {
        let right = block.stack.pop();
        let left = block.stack.pop();
        block.stack.push(Math.pow(left, right));
    };
    a[Op.GetArgs] = function (block) {
        block.stack.push(block.args);
    };
    a[Op.JumpToStart] = function (block) {
        block.ip = 0;
    };
    let strings = [];
    var bytes = decode(__program);
    let __F64__ = new Float64Array(1);
    let __U8__ = new Uint8Array(__F64__.buffer);
    class Block {
        constructor(blockId, parent = null) {
            this.definitions = [];
            this.ip = 0;
            this.running = false;
            this.stack = [];
            this.S = [];
            this.inheretedDefinitions = [];
            this.M = [];
            this.returnRegister = undefined;
            this.k = [];
            this.U = 1;
            this.I = [];
            this.blockId = blockId;
            let block = __scopes[blockId];
            let _blockId = block[0];
            block[1];
            let _totalDefinitions = block[2];
            let varsDefinedAboveScope = block[3];
            let _startOffset = block[4];
            this.startOffset = _startOffset;
            this.running = true;
            if (blockId !== _blockId)
                throw 2;
            this.ip = _startOffset;
            for (let i = 0; i < _totalDefinitions; i++) {
                this.definitions[i] = { value: undefined };
            }
            this.parent = parent;
            if (this.parent) {
                for (let i = 0; i < varsDefinedAboveScope.length; i++) {
                    let _blockId = varsDefinedAboveScope[i][0];
                    let _varid = varsDefinedAboveScope[i][1];
                    this.inheretedDefinitions.push([
                        _blockId,
                        parent.definitions[_varid]
                    ]);
                    this.definitions[_varid] = parent.definitions[_varid];
                }
            }
            this.scope = globalScope;
        }
        readF64() {
            __U8__[0] = bytes[this.ip++];
            __U8__[1] = bytes[this.ip++];
            __U8__[2] = bytes[this.ip++];
            __U8__[3] = bytes[this.ip++];
            __U8__[4] = bytes[this.ip++];
            __U8__[5] = bytes[this.ip++];
            __U8__[6] = bytes[this.ip++];
            __U8__[7] = bytes[this.ip++];
            return __F64__[0];
        }
        readString() {
            let idx = this.readI32();
            return strings[idx];
        }
        readI32() {
            return bytes[this.ip++] | bytes[this.ip++] << 8 | bytes[this.ip++] << 16 | bytes[this.ip++] << 24;
        }
        readI8() {
            return bytes[this.ip++];
        }
        _loadString() {
            let length = this.readI8();
            let str = '';
            let start = this.ip;
            for (let i = start; i < start + length; i++) {
                str += String.fromCharCode(bytes[i]);
            }
            this.ip += length;
            strings.push(str);
        }
        runChild(blockId) {
            if (__scopes[blockId][1] !== this.blockId)
                throw 3;
            return new Block(blockId, this);
        }
        makeFn() {
            var that = this;
            return that.fn || (that.fn = function () {
                if (that.U > 0) {
                    that.U = 0;
                    that.returnRegister = undefined;
                    for (let i = 0; i < that.definitions.length; i++)
                        that.definitions[i] = { value: undefined };
                    for (let i = 0; i < that.inheretedDefinitions.length; i++)
                        that.definitions[that.inheretedDefinitions[i][0]] = that.inheretedDefinitions[i][1];
                    that.args = arguments;
                    that.stack = [];
                    for (let i = 0; i < that.args.length; i++)
                        that.stack[that.args.length - i - 1] = that.args[i];
                    that.scope = this;
                    that.ip = that.startOffset;
                    return that.run();
                }
                let i = [
                    that.definitions,
                    that.stack,
                    that.startOffset,
                    that.S,
                    that.ip,
                    that.U,
                    that.scope,
                    that.args,
                    that.returnRegister,
                    that.I,
                    that.M
                ];
                that.definitions = [];
                that.stack = [];
                that.M = [];
                that.k = [];
                that.S = [];
                that.U = 0;
                that.returnRegister = undefined;
                let scope = __scopes[that.blockId];
                for (let i = 0; i < scope[2]; i++)
                    that.definitions[i] = { value: undefined };
                for (let i = 0; i < that.inheretedDefinitions.length; i++)
                    that.definitions[that.inheretedDefinitions[i][0]] = that.inheretedDefinitions[i][1];
                that.args = arguments;
                that.stack = [];
                for (let i = 0; i < that.args.length; i++)
                    that.stack[that.args.length - i - 1] = that.args[i];
                that.scope = this;
                that.ip = scope[4];
                var f = that.run();
                that.definitions = i[0];
                that.stack = i[1];
                that.k = i[2];
                that.S = i[3];
                that.ip = i[4];
                that.U = i[5];
                that.scope = i[6];
                that.args = i[7];
                that.returnRegister = i[8];
                that.I = i[9];
                that.M = i[10];
                return f;
            });
        }
        run() {
            try {
                for (; this.U < 1;) {
                    let header = bytes[this.ip++];
                    a[header](this);
                }
                return this.returnRegister;
            } catch (err) {
                if (this.k.length) {
                    let n = this.k[this.k.length - 1];
                    this.ip = n[0];
                    n[0] = -1;
                    this.stack = [this.stack];
                    return this.run();
                }
                throw 4;
            }
        }
    }
    new Block(0).makeFn().apply(globalScope);
}());