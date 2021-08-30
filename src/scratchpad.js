!function(){    var Op;
    (function (Op) {
        Op["Jump"] = 0;
        Op["END"] = 1;
        Op["I8"] = 2;
        Op["I32"] = 3;
        Op["BOOL"] = 4;
        Op["String"] = 5;
        Op["JumpIfFalse"] = 6;
        Op["JumpToBlock"] = 7;
        Op["LessThan"] = 8;
        Op["LessThanOrEqual"] = 9;
        Op["GreaterThan"] = 10;
        Op["GreaterThanOrEqual"] = 11;
        Op["EqualTo"] = 12;
        Op["EqualToStrict"] = 13;
        Op["NotEqualTo"] = 14;
        Op["NotEqualToStrict"] = 15;
        Op["Add"] = 16;
        Op["Sub"] = 17;
        Op["Divide"] = 18;
        Op["Multiply"] = 19;
        Op["Remainder"] = 20;
        Op["BitAnd"] = 21;
        Op["BitOr"] = 22;
        Op["BitXOR"] = 23;
        Op["BitLeftShift"] = 24;
        Op["BitRightShift"] = 25;
        Op["BitZeroFillRightShift"] = 26;
        Op["RaiseExponent"] = 27;
        Op["AssignValue"] = 28;
        Op["AssignValueToGlobal"] = 29;
        Op["GetVariableValue"] = 30;
        Op["GetGlobalVariableValue"] = 31;
        Op["CreateFunction"] = 32;
        Op["Call"] = 33
        Op["ObjectPropertyCall"] = 34;
        Op["ReturnValue"] = 35;
        Op["RegisterString"] = 36;
    })(Op || (Op = {}));

    let globalScope = "object" == typeof globalThis ? globalThis : "object" == typeof window ? window : self;
    function testIsGlobalPropOrFunction(n) {
        n in globalScope || function (n) {
            throw new ReferenceError(n + " is not defined");
        }(n);
    }

    let lmfao = "BwIAAAABBQAAAAAFAQAAAB8hARwAAAAAHgAAAAAFAgAAAAwGMgAAAAcDAAAAADcAAAAHBAAAAAEFAwAAAAUEAAAAHyEBAQUFAAAABQQAAAAfIQEBJApwYXNzd29yZDogJAZwcm9tcHQkCHBhc3N3b3JkJAdDb3JyZWN0JAVhbGVydCQJSW5jb3JyZWN0BwEAAAAB";
    let strings = [];
    function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return new Uint8Array(bytes.buffer);
    }
    let scopes = [[0,-1,0,[],84],[1,0,0,[],0],[2,1,1,[],6],[3,2,1,[[0,0]],56],[4,2,1,[[0,0]],70]];
    let bytes = _base64ToArrayBuffer(lmfao);
    let __F64__ = new Float64Array(1);
    let __U8__ = new Uint8Array(__F64__.buffer);
    function setScopes(_scopes) {
        scopes = _scopes;
    }
    function setStrings(_strings) {
        strings = _strings;
    }
    function setBytes(_bytes) {
        bytes = _bytes;
    }
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
            let block = scopes[blockId];
            let _blockId = block[0];
            block[1];
            let _totalDefinitions = block[2];
            let varsDefinedAboveScope = block[3];
            let _startOffset = block[4];
            this.startOffset = _startOffset;
            this.running = true;
            if (blockId !== _blockId)
                throw ("The block does not match up");
            this.ip = _startOffset;
            for (let i = 0; i < _totalDefinitions; i++) {
                this.definitions[i] = { value: undefined };
            }
            this.parent = parent;
            if (this.parent) {
                
                for (let i = 0; i < varsDefinedAboveScope.length; i++) {
                    let _blockId = varsDefinedAboveScope[i][0];
                    let _varid = varsDefinedAboveScope[i][1];
                    this.inheretedDefinitions.push([_blockId, parent.definitions[_varid]]);
                    this.definitions[_varid] = parent.definitions[_varid];
                }
            }
            this.scope = globalThis;
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
            return (bytes[this.ip++] |
                (bytes[this.ip++] << 8) |
                (bytes[this.ip++] << 16) |
                (bytes[this.ip++] << 24));
        }
        readI8() {
            return bytes[this.ip++];
        }
        _loadString() {
            let length = this.readI8();
            let str = "";
            let start = this.ip;
            for (let i = start; i < start + length; i++) {
                str += String.fromCharCode(bytes[i]);
            }
            this.ip += length;
            strings.push(str);
        }
        runChild(blockId) {
            if (scopes[blockId][1] !== this.blockId)
                throw (`${blockId} is not a child scope of ${this.blockId}`);
            return new Block(blockId, this);
        }
        
        makeFn() {
            var that = this;
            return that.fn || (that.fn = function () {
                if (that.U > 0) {
                    that.U = 0;
                    that.returnRegister = undefined;
                    for (let i = 0; i < that.definitions.length; i++)
                        that.definitions[i] = {
                            value: undefined
                        };
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
                let i = [that.definitions, that.stack, that.startOffset, that.S, that.ip, that.U, that.scope, that.args, that.returnRegister, that.I, that.M];
                that.definitions = [];
                that.stack = [];
                that.M = [];
                that.k = [];
                that.S = [];
                that.U = 0;
                that.returnRegister = undefined;
                let scope = scopes[that.blockId];
                for (let i = 0; i < scope[2]; i++)
                    that.definitions[i] = {
                        value: undefined
                    };
                for (let i = 0; i < that.inheretedDefinitions.length; i++)
                    that.definitions[that.inheretedDefinitions[i][0]] = that.inheretedDefinitions[i][1];
                that.args = arguments;
                that.definitions = [];
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
                
                    switch (header) {
                        case Op.CreateFunction: {
                            let blockid = this.readI32();
                            this.stack.push(this.runChild(blockid).makeFn());
                            break;
                        }
                        case Op.Call: {
                            let totalArgs = this.readI8();
                            let args = [];
                            let fn = this.stack.pop();
                            for (let i = 0; i < totalArgs; i++)
                                args[totalArgs - i - 1] = this.stack.pop();
                            let val = fn.apply(this.scope, args);
                            this.stack.push(val);
                            break;
                        }
                        case Op.ReturnValue: {
                            let value = this.stack.pop();
                            this.returnRegister = value;
                            this.U++;
                            break;
                        }
                        case Op.RegisterString: {
                            this._loadString();
                            break;
                        }
                        case Op.AssignValueToGlobal: {
                            let prop = this.stack.pop();
                            let val = this.stack.pop();
                            this.stack.push(this.scope[prop] = val);
                            break;
                        }
                        case Op.GetGlobalVariableValue: {
                            let prop = this.stack.pop();
                            testIsGlobalPropOrFunction(prop);
                            this.stack.push(globalScope[prop]);
                            break;
                        }
                        case Op.ObjectPropertyCall: {
                            let totalArgs = this.readI8();
                            let args = [];
                            let obj = this.stack.pop();
                            let prop = this.stack.pop();
                            for (let i = 0; i < totalArgs; i++)
                                args[totalArgs - i - 1] = this.stack.pop();
                            let fn = obj[prop];
                            let val = fn.apply(fn, args);
                            break;
                        }
                        case Op.String: {
                            let str = this.readString();
                            this.stack.push(str);
                            break;
                        }
                        case Op.AssignValue: {
                            let index = this.readI32();
                            let value = this.stack.pop();
                            
                            this.definitions[index].value = value;
                            
                            break;
                        }
                        case Op.GetVariableValue: {
                            let index = this.readI32();
                            let value = this.definitions[index].value;
                            this.stack.push(value);
                        break;
                        }
                        case Op.I8: {
                            let num = this.readI8();
                            this.stack.push(num);
                            break;
                        }
                        case Op.I32: {
                            let num = this.readI32();
                            this.stack.push(num);
                        
                            break;
                        }
                        case Op.BOOL: {
                            let bool = !!this.readI8();
                            
                            this.stack.push(bool);
                            break;
                        }
                        case Op.Jump: {
                            let dst = this.readI32();
                            this.ip = dst;
                        
                            break;
                        }
                        case Op.JumpToBlock: {
                            let block = this.readI32();
                        
                            this.runChild(block).makeFn().apply(this.scope);
                            break;
                        }
                        case Op.JumpIfFalse: {
                            let dst = this.readI32();
                            let val = this.stack.pop();
                            if (!val)
                                this.ip = dst;
                            break;
                        }
                        case Op.END: {
                            this.returnRegister = undefined;
                            this.U++;
                            this.ip = -1;
                            this.S = [];
                            break;
                        }
                        case Op.LessThan: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left < right);
                            break;
                        }
                        case Op.LessThanOrEqual: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left <= right);
                            break;
                        }
                        case Op.GreaterThan: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left > right);
                            break;
                        }
                        case Op.GreaterThanOrEqual: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left >= right);
                            break;
                        }
                        case Op.EqualTo: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left == right);
                            break;
                        }
                        case Op.EqualToStrict: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left === right);
                            break;
                        }
                        case Op.NotEqualTo: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left != right);
                            break;
                        }
                        case Op.NotEqualToStrict: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left !== right);
                            break;
                        }
                        case Op.Add: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left + right);
                            break;
                        }
                        case Op.Sub: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left - right);
                            break;
                        }
                        case Op.Multiply: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left * right);
                            break;
                        }
                        case Op.Divide: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left / right);
                            break;
                        }
                        case Op.Remainder: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left % right);
                            break;
                        }
                        case Op.BitAnd: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left & right);
                            break;
                        }
                        case Op.BitOr: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left | right);
                            break;
                        }
                        case Op.BitXOR: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left ^ right);
                            break;
                        }
                        case Op.BitLeftShift: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left << right);
                            break;
                        }
                        case Op.BitRightShift: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left >> right);
                            break;
                        }
                        case Op.BitZeroFillRightShift: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(left >>> right);
                            break;
                        }
                        case Op.RaiseExponent: {
                            let right = this.stack.pop();
                            let left = this.stack.pop();
                            this.stack.push(Math.pow(left, right));
                            break;
                        }
                        default:
                            throw (420);
                    }
                }
                return this.returnRegister;
            }
            catch (err) {
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
    new Block(0).makeFn().apply(this);
}