// @ts-nocheck
import {Op, /*OpcodeString*/} from "./Op";

let globalScope = "object" == typeof globalThis ? globalThis : "object" == typeof window ? window : self;

let construct = "object" == typeof Reflect && "function" == typeof Reflect.construct ? Reflect.construct : function(n, t) {
    var i = [null];
    Array.prototype.push.apply(i, t);
    return new(Function.prototype.bind.apply(n, i));
}

let decode = typeof(atob) === "function" ? function(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
} : function(str){ return new Uint8Array(Buffer.from(str, "base64"))};

function testIsGlobalPropOrFunction(n) {
    n in globalScope || function(n) {
        throw new ReferenceError(n + " is not defined")
    }(n)
}

let __scopes = null;
let __program = null;

let a = [];
a[Op.CreateFunction] = function(block){
    let blockid = block.readI32();
    //block.log("Binding function to: " + blockid);
    block.stack.push(block.runChild(blockid).makeFn());
}

a[Op.Call] = function(block){
    let totalArgs = block.readI8();
    let args = [];
    let fn = block.stack.pop();
    for(let i = 0 ; i < totalArgs; i++) args[ totalArgs - i - 1] = block.stack.pop();
    
    let val = fn.apply(globalThis, args); //becareful
    //block.log("Function returned: " + (typeof(val) === "function" ? "function" : val));
    block.stack.push(val);
}

a[Op.ReturnValue] = function(block){
    let value = block.stack.pop();
    //block.log("Returning: " + (typeof(value) === "function" ? "function" : value));
    block.returnRegister = value;
    block.U++;
    
};

a[Op.RegisterString] = function(block){
    block._loadString();
    
}

a[Op.AssignValueToGlobal] = function(block){
    let prop = block.stack.pop();
    let val = block.stack.pop();
    block.stack.push(block.scope[prop] = val);
    //block.log(`MOV ${typeof(val) === "string" || typeof(val) === "number" ? val : typeof(val)} -> global.${prop}`);
    
}
a[Op.GetGlobalVariableValue] = function(block){
    let prop = block.stack.pop();
    //block.log("property", prop);
    testIsGlobalPropOrFunction(prop);
    block.stack.push(globalScope[prop])
    
}
a[Op.GetArguments] = function(block){
    let index = block.readI8();
    //block.log("Loading value into arguments", block.args[index]);
    block.stack.push(block.args[index]);
    
}
a[Op.ObjectPropertyCall] = function(block){
    let totalArgs = block.readI8();
    let args = [];
    let obj = block.stack.pop();
    let prop = block.stack.pop()
    for(let i = 0; i < totalArgs; i++) args[ totalArgs - i - 1 ] = block.stack.pop();
    let fn = obj[prop];
    let val = fn.apply(obj, args);
    block.stack.push(val);
    
}
a[Op.String] = function(block){
    let str = block.readString();
    block.stack.push(str);
    
}

a[Op.Regex] = function(block){
    let str = block.readString();
    let flags = block.readString();
    block.stack.push(new RegExp(str, flags));
    
}
a[Op.GetObjectProperty] = function(block){
    let prop = block.stack.pop();
    let obj = block.stack.pop();
    //block.log("#", prop, obj);
    block.stack.push(obj[prop]);
    
}
a[Op.MakeArray] = function(block){
    let elements = block.readI32();
    let arr = new Array(elements);
    for(let i = 0 ; i < elements; i++) arr[elements - i - 1 ] = block.stack.pop();
    block.stack.push(arr);
    //block.log("Create Array");
    
}
a[Op.Debugger] = function(block){
    debugger;
    
}

a[Op.Duplicate] = function(block){
    let v = block.stack.pop();
    block.stack.push(v);
    block.stack.push(v);
}

a[Op.MakeObject] = function(block){
    let props = block.readI32();
    let obj = {};
    let values = new Array(props * 2);
    for(let i = 0 ; i < props; i++){
        values[(props - i) * 2 - 1] = block.stack.pop();
        values[(props - i) * 2 - 1 - 1] = block.stack.pop();
    }
    for(let i = 0; i < props * 2; i +=2){
        obj[values[i]] = values[i + 1];
    }
    block.stack.push(obj);
    
}
a[Op.This] = function(block){
    block.stack.push(block.scope);
}

a[Op.SetObjectProperty] = function(block){
    
    let property = block.stack.pop();
    let obj = block.stack.pop();
    let value = block.stack.pop();
    obj[property] = value;
    
}
a[Op.AssignValue] = function(block){
    let index = block.readI32();
    let value = block.stack.pop();
    block.stack.push(block.definitions[index].value = value);
    //block.log(`ASSIGN ${typeof(value) === "string" || typeof(value) === "number" ? value : typeof(value)} -> $${index}`);
    
}

a[Op.Or] = function(block){
    let r = block.stack.pop();
    let l = block.stack.pop();
    block.stack.push(r || l);
    //block.log("||")
}

a[Op.And] = function(block){
    let r = block.stack.pop();
    let l = block.stack.pop();
    block.stack.push(r && l);
    //block.log("&&")
}

a[Op.NotSymbol] = function(block){
    let val = block.stack.pop();
    block.stack.push(!val);
    //block.log("!")
}

a[Op.NegateSymbol] = function(block){
    let val = block.stack.pop();
    block.stack.push(~val);
    //block.log("~")
}

a[Op.TypeOf] = function(block){
    let val = block.stack.pop();
    block.stack.push(typeof(val));
    //block.log("typeof")
}

a[Op.GetVariableValue] = function(block){
    let index = block.readI32();
    let value = block.definitions[index].value;
    block.stack.push(value);
    //block.log(`MOV ${block.blockId}-$${index} ${typeof(value) === "string" || typeof(value) === "number" ? value : typeof(value)} -> stack`);
    
}
a[Op.I8] = function(block){
    let num = block.readI8();
    block.stack.push(num);
    //block.log(`MOV ${num} -> stack`);
    
}
a[Op.I32] = function(block){
    let num = block.readI32();
    block.stack.push(num);
    //block.log(`MOV ${num} -> stack`);
    
}
a[Op.BOOL] = function(block){
    let bool = !!block.readI8();
    //block.log(`MOV ${bool.toString()} -> stack`);
    block.stack.push(bool);
    
}
a[Op.Jump] = function(block){
    let dst = block.readI32();
    block.ip = dst;
    //block.log(`JMP @${dst}`);
    
}
a[Op.JumpToBlock] = function(block){
    let blockid = block.readI32();
    //block.log(`JMP to Block ->${blockid}`);
    block.runChild(blockid).makeFn().apply(block.scope);
}
a[Op.JumpIfFalse] = function(block){
    let dst = block.readI32();
    let val = block.stack.pop();
    //block.log(`[JMP] From: ${block.ip} to @${dst}`);
    if(!val) block.ip = dst;
}

a[Op.New] = function(block){
    let totalArgs = block.readI32();
    let args = new Array(totalArgs);
    for(let i = 0 ; i < totalArgs; i++) args[totalArgs - i - 1] = block.stack.pop();
    let obj = block.stack.pop();
    let instace = construct(obj, args)
    block.stack.push(instace);
    
}
a[Op.END] = function(block){
    block.returnRegister = undefined;
    block.U++;
    block.ip = -1;
    block.S = [];
    
}
a[Op.LessThan] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left < right);
    
}
a[Op.LessThanOrEqual] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left <= right);
    
}
a[Op.GreaterThan] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left > right);
    
}
a[Op.GreaterThanOrEqual] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >= right);
    
}
a[Op.EqualTo] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left == right);
    
}
a[Op.EqualToStrict] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left === right);
    
}
a[Op.NotEqualTo] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    //block.log(`Comparing ${right} ${left}`);
    block.stack.push(left != right);
}
a[Op.NotEqualToStrict] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left !== right);
}
a[Op.Add] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left + right);
    
}
a[Op.Sub] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left - right);
    
}
a[Op.Multiply] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left * right);
}

a[Op.Divide] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left / right);
    
}
a[Op.Remainder] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left % right);
    
}
a[Op.InstanceOf] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left instanceof right);
    
}
a[Op.MinusOutFront] = function(block){
    let val = block.stack.pop();
    block.stack.push(-val);
    
}
a[Op.PlusOutFront] = function(block){
    let val = block.stack.pop();
    block.stack.push(+val);
    
}
a[Op.Void] = function(block){
    let val = block.stack.pop();
    block.stack.push(void val);
}
a[Op.Delete] = function(block){
    let prop = block.stack.pop();
    let obj = block.stack.pop();
    block.stack.push(delete obj[prop]);
}
a[Op.In] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left in right);
    
}
a[Op.Throw] = function(block){
    let arg = block.stack.pop();
    throw(arg);
}
a[Op.Null] = function(block){
    block.stack.push(null);
}
a[Op.BitAnd] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left & right);
}
a[Op.BitOr] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left | right);
    
}
a[Op.BitXOR] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left ^ right);
    
}
a[Op.BitLeftShift] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left << right);
    
}

a[Op.BitRightShift] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >> right);
    
}

a[Op.BitZeroFillRightShift] = function(block) {
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >>> right);   
}

a[Op.PlusPlus] = function(block){
    let varid = block.readI32();
    block.stack.push(block.definitions[varid].value++);
}

a[Op.RaiseExponent] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left ** right);
}

a[Op.GetArgs] = function(block: Block){
    block.stack.push(block.args);
}

a[Op.JumpToStart] = function(block){
    block.ip = 0;
}

let strings = [];
var bytes = decode(__program);
let __F64__ = new Float64Array(1);
let __U8__ = new Uint8Array(__F64__.buffer);

interface Bind {
    value: any,
}

class Block{
    public blockId: number;
    public definitions: Array<Bind> = [];
    public ip: number = 0;
    public startOffset: number;
    public running = false;
    public parent: Block;
    public fn;
    public args: IArguments;
    public stack: Array<any> = [];
    public scope: any;

    public S: Array<any> = [];
    public inheretedDefinitions: Array<any> = [];
    public M: Array<any> = [];
    public returnRegister: undefined = undefined;
    public k: Array<any> = [];
    public U: number = 1;
    public I: Array<any> = [];

    constructor(blockId: number, parent: (Block | null) = null){
        
        this.blockId = blockId;
        let block = __scopes[blockId];
        let _blockId = block[0];
        let _parentBlockId = block[1];
        let _totalDefinitions = block[2];
        let varsDefinedAboveScope = block[3]; //[where the local var id will set, where the value sits in the parent]
        let _startOffset = block[4];

        this.startOffset = _startOffset;

        this.running = true;
        if(blockId !== _blockId) throw("The block does not match up");
        this.ip = _startOffset;

        for(let i = 0 ; i < _totalDefinitions; i++){
            this.definitions[i] = {value: undefined};
        }

        this.parent = parent;
        if(this.parent){
            for (let i = 0; i < varsDefinedAboveScope.length; i++) {
                let _localID = varsDefinedAboveScope[i][0]; //this is like some sort of index
                let _foreignId = varsDefinedAboveScope[i][1]; //i assume this is the index of the {vale: undefined} of each on the parent
                this.inheretedDefinitions.push([_localID, parent.definitions[_foreignId]]);
                this.definitions[_localID] = parent.definitions[_foreignId];
            }
        }
        //change this
        this.scope = globalScope;
    }

    readF64(){
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

    readString(): string{
        let idx = this.readI32();
        return strings[idx];
    }

    readI32() {
        return (
          bytes[this.ip++] |
          (bytes[this.ip++] << 8) |
          (bytes[this.ip++] << 16) |
          (bytes[this.ip++] << 24)
        );
    }

    readI8(){
        return bytes[this.ip++];
    }

    _loadString(): void{
        let length = this.readI8();
       
        if(length === 0xff){
            length = this.readI32()
        }
        
        let str = "";
        let start = this.ip;
        for(let i = start; i < start + length; i++){
            str += String.fromCharCode(bytes[i]);
        }
        this.ip += length;
        strings.push(str);
    }

    runChild(blockId){
        if(__scopes[blockId][1] !== this.blockId) throw(`${blockId} is not a child scope of ${this.blockId}`);
        return new Block(blockId, this);
    }

   /* log(...args){
        let space = new Array(this.blockId * 4).join(" ");
        console.log(space, ...args);
    }*/

    makeFn(){
        var that = this;
        return that.fn || (that.fn = function() {
            //if its the first scope that is running...
            if (that.U > 0) {

                that.U = 0;
                that.returnRegister = undefined;

                for (let i = 0; i < that.definitions.length; i++) that.definitions[i] = {
                    value: undefined
                };

                
                for (let i = 0; i < that.inheretedDefinitions.length; i++) that.definitions[that.inheretedDefinitions[i][0]] = that.inheretedDefinitions[i][1];

                //copy arguments onto the stack first on, last off style
                that.args = arguments;
                that.stack = [];

                for (let i = 0; i < that.args.length; i++) that.stack[that.args.length - i - 1] = that.args[i];

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
            let scope = __scopes[that.blockId];

            //reset the definitions
            for (let i = 0; i < scope[2]; i++) that.definitions[i] = {
                value: undefined
            };

            for (let i = 0; i < that.inheretedDefinitions.length; i++) that.definitions[that.inheretedDefinitions[i][0]] = that.inheretedDefinitions[i][1];

            that.args = arguments;
            that.stack = []; //this seems to be a problem statement
            for (let i = 0; i < that.args.length; i++) that.stack[that.args.length - i - 1] = that.args[i];

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

    run(){
        try{
            for (; this.U < 1;) {
                //this.log("[" + this.ip + "] " + OpcodeString[bytes[this.ip]], bytes[this.ip]);
                a[bytes[this.ip++]](this);
            }
            return this.returnRegister;
        }catch(err){
            if(this.k.length){
                //get the last value of k
                let n = this.k[this.k.length - 1];
                //roll back the offset to someplace
                this.ip = n[0];
                //set to -1
                n[0] = -1;
                //package the stack back up WTF?
                this.stack = [this.stack];
                return this.run();
            }
            throw err;
        }
    }
}

new Block(0).makeFn().apply(globalScope);