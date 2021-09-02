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
            throw new ReferenceError(n + ' is not defined');
        }(n);
    }
    let __scopes =     [
        [
            0,
            -1,
            0,
            [],
            571
        ],
        [
            1,
            0,
            8,
            [],
            0
        ],
        [
            2,
            1,
            5,
            [
                [
                    3,
                    0
                ],
                [
                    4,
                    7
                ]
            ],
            74
        ],
        [
            3,
            2,
            4,
            [
                [
                    1,
                    2
                ],
                [
                    0,
                    1
                ],
                [
                    2,
                    0
                ],
                [
                    3,
                    4
                ]
            ],
            88
        ],
        [
            4,
            1,
            4,
            [[
                    3,
                    1
                ]],
            184
        ],
        [
            5,
            1,
            2,
            [
                [
                    1,
                    1
                ],
                [
                    0,
                    3
                ]
            ],
            344
        ],
        [
            6,
            5,
            2,
            [
                [
                    0,
                    0
                ],
                [
                    1,
                    1
                ]
            ],
            371
        ],
        [
            7,
            1,
            1,
            [[
                    0,
                    7
                ]],
            450
        ],
        [
            8,
            1,
            3,
            [
                [
                    0,
                    4
                ],
                [
                    2,
                    6
                ],
                [
                    1,
                    5
                ]
            ],
            477
        ]
    ];;
    let __program = 'JAIAAAAeAAAAACQEAAAAHgEAAAAFAAAAACQFAAAAIAAAAAAlAR4CAAAAJAcAAAAFDQAAACQIAAAABQYAAAAgAgAAACUAJgEmAQEJAB4AAAAAJAMAAAAnASkAAAAAHgAAAAACAB4BAAAAIAEAAAAsBRsAAAAhCgaXAAAALCABAAAAISAAAAAAIAEAAAAiLgEAAAAAaQAAACsgAAAAAAUdAAAAIAIAAAAmAgUcAAAABSIAAAAjJgEnAQkAHgAAAAAJAR4BAAAACQIeAgAAACACAAAABv0AAAAgAQAAAAbyAAAAIAAAAAAgAQAAACUBAPcAAAAgAAAAACcA/QAAACAAAAAANiAAAAAABQYAAAAhNjQGMQEAACAAAAAABRwAAAAFIgAAACMmAR4AAAAAADEBAAAgAQAAAAZRAQAAIAEAAAAFBgAAACAAAAAAJgEAVgEAACAAAAAAJwEFAQAAAAURAAAAIyUBJAYAAAAgAQAAACUCJwEJAB4AAAAAIAAAAAAFAgAAACE2Bq0BAAAFEwAAACMFAwAAACAAAAAABQQAAAAhEjMBAAAAOgCtAQAABQUAAAAgAAAAACYAIAEAAAAlAScBCQAeAAAAACAAAAAABQ4AAAAFGQAAACMmAScBCQAeAAAAACAAAAAABQcAAAAFFQAAACMmAR4BAAAABQkAAAAFCAAAAAUWAAAAIyYBHgIAAAAgAQAAACACAAAABQoAAAAiIAIAAAAFDAAAAAUWAAAAIwULAAAAISYBASgKdXNlIHN0cmljdCglaHR0cHM6Ly9zcGxvb3AuaW8vaW1nL2VudGl0eS93YWxsLnBuZygCb2soFEhUVFAgZXJyb3IhIHN0YXR1czogKAZzdGF0dXMoBGJsb2IoBHRoZW4oD2NyZWF0ZU9iamVjdFVSTCgNY3JlYXRlRWxlbWVudCgDaW1nKANzcmMoBGJvZHkoC2FwcGVuZENoaWxkKAVjYXRjaCgDbG9nKAZfYXN5bmMoBl9hd2FpdCgFZmV0Y2goCHJlc3BvbnNlKAVFcnJvcigHbXlGZXRjaCgDVVJMKAhkb2N1bWVudCgFaW1hZ2UoCW9iamVjdFVSTCgHY29uc29sZSgBZSgGbGVuZ3RoKAdyZXNvbHZlKAVhcHBseSgGcmVqZWN0KAFpKAlhcmd1bWVudHMoBGFyZ3MoB1Byb21pc2UoAWYoBmRpcmVjdCgFdmFsdWUHAQAAAAE=';
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
        block.log('Function returned: ' + val);
        block.stack.push(val);
    };
    a[Op.ReturnValue] = function (block) {
        let value = block.stack.pop();
        block.log('Returning: ' + value);
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
        block.log(`MOV ${ typeof val === 'string' || typeof val === 'number' ? val : typeof val } -> global.${ prop }`);
    };
    a[Op.GetGlobalVariableValue] = function (block) {
        let prop = block.stack.pop();
        block.log('property', prop);
        testIsGlobalPropOrFunction(prop);
        block.stack.push(globalScope[prop]);
    };
    a[Op.GetArguments] = function (block) {
        let index = block.readI8();
        block.log('Loading value into arguments', block.args[index]);
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
        block.log('#', prop, obj);
        block.stack.push(obj[prop]);
    };
    a[Op.MakeArray] = function (block) {
        let elements = block.readI32();
        let arr = new Array(elements);
        for (let i = 0; i < elements; i++)
            arr[elements - i - 1] = block.stack.pop();
        block.stack.push(arr);
        block.log('Create Array');
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
        block.log(`ASSIGN ${ typeof value === 'string' || typeof value === 'number' ? value : typeof value } -> $${ index }`);
    };
    a[Op.Or] = function (block) {
        let r = block.stack.pop();
        let l = block.stack.pop();
        block.stack.push(r || l);
        block.log('||');
    };
    a[Op.And] = function (block) {
        let r = block.stack.pop();
        let l = block.stack.pop();
        block.stack.push(r && l);
        block.log('&&');
    };
    a[Op.NotSymbol] = function (block) {
        let val = block.stack.pop();
        block.stack.push(!val);
        block.log('!');
    };
    a[Op.NegateSymbol] = function (block) {
        let val = block.stack.pop();
        block.stack.push(~val);
        block.log('~');
    };
    a[Op.TypeOf] = function (block) {
        let val = block.stack.pop();
        block.stack.push(typeof val);
        block.log('typeof');
    };
    a[Op.GetVariableValue] = function (block) {
        let index = block.readI32();
        let value = block.definitions[index].value;
        block.stack.push(value);
        block.log(`MOV ${ block.blockId }-$${ index } ${ typeof value === 'string' || typeof value === 'number' ? value : typeof value } -> stack`);
    };
    a[Op.I8] = function (block) {
        let num = block.readI8();
        block.stack.push(num);
        block.log(`MOV ${ num } -> stack`);
    };
    a[Op.I32] = function (block) {
        let num = block.readI32();
        block.stack.push(num);
        block.log(`MOV ${ num } -> stack`);
    };
    a[Op.BOOL] = function (block) {
        let bool = !!block.readI8();
        block.log(`MOV ${ bool.toString() } -> stack`);
        block.stack.push(bool);
    };
    a[Op.Jump] = function (block) {
        let dst = block.readI32();
        block.ip = dst;
        block.log(`JMP @${ dst }`);
    };
    a[Op.JumpToBlock] = function (block) {
        let blockid = block.readI32();
        block.log(`JMP to Block ->${ blockid }`);
        block.runChild(blockid).makeFn().apply(block.scope);
    };
    a[Op.JumpIfFalse] = function (block) {
        let dst = block.readI32();
        let val = block.stack.pop();
        block.log(`[JMP] From: ${ block.ip } to @${ dst }`);
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
        block.log(`Comparing ${ right } ${ left }`);
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
        throw arg;
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
                throw 'The block does not match up';
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
                throw `${ blockId } is not a child scope of ${ this.blockId }`;
            return new Block(blockId, this);
        }
        log(...args) {
            let space = new Array(this.blockId * 4).join(' ');
            console.log(space, ...args);
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
                    let op = this.ip;
                    let header = bytes[this.ip++];
                    this.log('[' + op + '] ' + Op[header], header);
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
                throw err;
            }
        }
    }
    new Block(0).makeFn().apply(globalScope);
}());