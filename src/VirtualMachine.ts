import { OP } from "./Constants";
import { compiledProgram, scopeInfo, bind } from "./types";

let bytes: Uint8Array;
let strings: string[] = [];
let scopes: scopeInfo;

let constructObj = 
"object" == typeof Reflect && "function" == typeof Reflect.construct
  ? Reflect.construct
  : function (n, t) {
      var i = [null];
      return (
        Array.prototype.push.apply(i, t),
        new (Function.prototype.bind.apply(n, i))()
      );
    };

export class VM {
    private variables: Array<bind>;
    private stack: Array<any>;
    private ip: number;
    private callstack: number[];
    private verbose = false;
    private __F64__ = new Float64Array(1);
    private __U8__ = new Uint8Array(this.__F64__.buffer);
    private parent: VM;

    get global(){
        return "object" == typeof globalThis
        ? globalThis
        : "object" == typeof window
        ? window
        : self;
    }

    getGlobalProp(propname: string){
        (propname in this.global) || (function(n) {
            throw new ReferenceError(n + " is not defined")
        })(propname);
    }

    constructor(scopeId, verbose: boolean = true, parent = null){
        this.verbose = verbose;

        this.variables = [];
        this.stack = [];
        this.ip = 0;
        this.callstack = [];
        this.parent = parent;

        //init all variables
        let scope = scopes[scopeId];

        if(scope[0] !== scopeId) throw("Scope ID mismatch")

        for(let i = 0 ; i < scope[1]; i++){
            this.variables[i] = {
                value: undefined,
            }
        }

    }

    getRegString(): string{
        let length = this.getI8();
        let str = "";
        let start = this.ip;
        for(let i = start; i < start + length; i++){
            str += String.fromCharCode(bytes[i]);
        }
        this.ip += length;
        return str;
    }

    getString(): string{
        let idx = this.get_uint32();
        let str = strings[idx];
        if(!str) throw("Not a string");
        return str;
    }

    getI8(){
        return bytes[this.ip++];
    }

    get_f64(){
        this.__U8__[0] = bytes[this.ip++];
        this.__U8__[1] = bytes[this.ip++];
        this.__U8__[2] = bytes[this.ip++];
        this.__U8__[3] = bytes[this.ip++];
        this.__U8__[4] = bytes[this.ip++];
        this.__U8__[5] = bytes[this.ip++];
        this.__U8__[6] = bytes[this.ip++];
        this.__U8__[7] = bytes[this.ip++];
        return this.__F64__[0];
    }

    get_uint32() {
        return (
          bytes[this.ip++] |
          (bytes[this.ip++] << 8) |
          (bytes[this.ip++] << 16) |
          (bytes[this.ip++] << 24)
        );
    }

    debug(){
        //console.log(bytes);
        //console.log();
        //console.log("----=====callstack=====-----");
        //this.callstack.forEach(code => console.log(OP[code]));

        console.log();
        console.log("-----======Diagnostics=====-------");
        console.log("****************")
        console.log("vars: ");
        console.log(this.variables);

        console.log("strings: ");
        console.log(strings);
        
        console.log("stack: ");
        console.log(this.stack);
    }

    run(){
        
        if(this.verbose) console.log();

        let id = 0;
        while(this.ip < bytes.length){

            let header = bytes[this.ip++];

            //add OPCODE to callstack for debugging
            this.callstack.push(header);
            let type = OP[header];

            switch(header){
                case OP.REGISTER_STRING: {
                    let str = this.getRegString();
                    strings.push(str);
                    if(this.verbose) console.log(`[${type}]: "${str}"`);
                    break;
                }
                case OP.LOAD_I8: {
                    let u8 = this.getI8();
                    this.stack.push(u8);
                    if(this.verbose) console.log(`[${type}]: ${u8}`);
                    break;
                }
                case OP.LOAD_I32: {
                    let u8 = this.get_uint32();
                    this.stack.push(u8);
                    if(this.verbose) console.log(`[${type}]: ${u8}`);
                    break;
                }
                case OP.LOAD_F64: {
                    let u8 = this.get_f64();
                    this.stack.push(u8);
                    if(this.verbose) console.log(`[${type}]: ${u8}`);
                    break;
                }
                case OP.ASSIGN_OBJECT: {
                    let val = this.stack.pop();
                    let prop = this.stack.pop();
                    let obj = this.stack.pop();
                    
                    obj[prop] = val;

                    if(this.verbose) console.log(`[${type}]: Assign [${val}] to ${JSON.stringify(obj)}.[${prop}]`);
                    break;
                }
                case OP.ASSIGN: {
                    let varIndex = this.getI8();
                    if(this.stack.length === 0) throw("No variables on stack: " + varIndex);
                    let bind = this.variables[varIndex];
                    bind.value = this.stack.pop();
                    if(this.verbose) console.log(`[${type}]: ${JSON.stringify(bind.value)} to VARID: $${varIndex}`);
                    break;
                }
                case OP.ADD: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l + r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} + ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.SUB: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l - r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} - ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.MUL: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l * r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} * ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.BIT_SHIFT_LEFT: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l << r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} << ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.BIT_SHIFT_RIGHT: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l >> r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} >> ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.XOR: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l ^ r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} ^ ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.BITWISE_AND: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l & r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} & ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.BITWISE_OR: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l | r
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} | ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.UNSIGNED_RIGHT_SHIFT: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l >>> r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} >>> ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.REMAINDER: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l % r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} % ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.EXPONENT: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l ** r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} ** ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.DIV: {
                    let r = this.stack.pop();
                    let l = this.stack.pop();
                    let res = l / r;
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: pushing (${l} / ${r} => ${res}) to the stack`);
                    break;
                }
                case OP.GET_OBJ_PROP_AND_PUSH: {
                    let prop = this.stack.pop();
                    let obj = this.stack.pop();
                    let val = obj[prop];
                    this.stack.push(val);
                    if(this.verbose) console.log(`[${type}]: ${JSON.stringify(obj)}.[${JSON.stringify(prop)}] => [${typeof(val)}]`);
                    break;
                }
                case OP.LOAD_GLOBAL: {
                    let prop = this.stack.pop();
                    this.getGlobalProp(prop);
                    let obj = this.global[prop];
                    this.stack.push(obj);
                    if(this.verbose) console.log(`[${type}]: Accessing global.[${JSON.stringify(prop)}] -> [${typeof(obj)}]`);
                    break;
                }
                case OP.LOAD_STRING:{
                    let str =this.getString();
                    this.stack.push(str);
                    if(this.verbose) console.log(`[${type}]: "${str}"`);
                    break;
                }
                case OP.LOAD_REGEX:{
                    let str = this.getString();
                    this.stack.push(new RegExp(str));
                    if(this.verbose) console.log(`[${type}]: "${str}"`);
                    break;
                }
                case OP.LOAD_OBJ: {
                    this.stack.push({})
                    if(this.verbose) console.log(`[${type}]: push {} on stack`);
                    break;
                }
                case OP.LOAD_ARRAY: {
                    this.stack.push([])
                    if(this.verbose) console.log(`[${type}]: push [] on stack`);
                    break;
                }
                case OP.LOAD_VAR: {
                    let varIndex = this.get_uint32();
                    let bind = this.variables[varIndex];
                    this.stack.push(bind.value);
                    if(this.verbose) console.log(`[${type}]: Loading $${varIndex}->[${JSON.stringify(bind)}] on stack`);
                    break;
                }
                case OP.SET_OBJ_PROPS_NO_POP: {
                    let obj = this.stack.pop();
                    let val = this.stack.pop();
                    let prop = this.stack.pop();
                    
                    obj[prop] = val;

                    if(this.verbose) console.log(`[${type}]: Assign [${val}] to ${JSON.stringify(obj)}.[${prop}]`);
                    
                    this.stack.push(obj);
                    if(this.verbose) console.log(`[${type}]: push ${JSON.stringify(obj)} on stack`);
                    break;
                }
                case OP.PUSH_ARRAY_NO_POP: {
                    let arr = this.stack.pop();
                    let val = this.stack.pop();
                    arr.unshift(val);
                    this.stack.push(arr);
                    if(this.verbose) console.log(`[${type}]: push ${JSON.stringify(arr)} on stack`);
                    break;
                }
                case OP.CALL_FUNCTION_BY_PROP_NO_PUSH: {
                    let totalArgs = this.getI8();

                    let args = new Array(totalArgs);
                    for(let i = 0 ; i < totalArgs; i++) args[totalArgs - 1 - i] = this.stack.pop();
                    let prop = this.stack.pop();
                    let obj = this.stack.pop();
                    obj[prop].apply(obj, args);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(obj)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.CALL_FUNCTION_BY_PROP_AND_PUSH: {
                    let totalArgs = this.getI8();
                    let args = new Array(totalArgs);
                    for(let i = 0 ; i < totalArgs; i++) args[totalArgs - 1 - i] = this.stack.pop();
                    let prop = this.stack.pop();
                    let obj = this.stack.pop();
                    let res = obj[prop].apply(obj, args);
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(obj)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.NEW_INSTANCE_AND_PUSH: {
                    let totalArgs = this.getI8();
                    let args = new Array(totalArgs);
                    for(let i = 0 ; i < totalArgs; i++) args[ totalArgs - 1 - i] = this.stack.pop();
                    let fn = this.stack.pop();
                    let ret = constructObj(fn, args);
                    this.stack.push(ret);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(fn)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.NEW_INSTANCE_NO_PUSH: {
                    let totalArgs = this.getI8();
                    let args = new Array(totalArgs);
                    for(let i = 0 ; i < totalArgs; i++) args[ totalArgs - 1 - i] = this.stack.pop();
                    let fn = this.stack.pop();
                    let ret = constructObj(fn, args);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(fn)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.CALL_STACK_NO_PUSH: {
                    let totalArgs = this.getI8();

                    let args = new Array(totalArgs);
                    for(let i = 0 ; i < totalArgs; i++) args[ totalArgs - 1 - i] = this.stack.pop();
                    let fn = this.stack.pop();
                    fn.apply(this.global, args);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(fn)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.CALL_STACK_AND_PUSH: {
                    let totalArgs = this.getI8();

                    let args = new Array();
                    for(let i = 0 ; i < totalArgs; i++) args[totalArgs - 1 - i] = this.stack.pop();
                    let fn = this.stack.pop();
                    let res = fn.apply(this.global, args);
                    this.stack.push(res);
                    if(this.verbose) console.log(`[${type}]: CALL->[${typeof(fn)}] args:(${JSON.stringify(args)})`);
                    break;
                }
                case OP.ASSIGN_GLOBAL: {
                    let prop = this.stack.pop();
                    let val = this.stack.pop();
                    this.global[prop] = val;
                    if(this.verbose) console.log(`[${type}]: [Assign ${val}] to global.[${prop}]`);
                    break;
                }
                default:
                    throw("Unknown header: " + header + " : " + OP[header]);
            }
        }
        if(this.verbose) this.debug();
    }
}

export function runVM(compiledProgram: compiledProgram, verbose: boolean = true): void{
    let bytecode = compiledProgram.bytecode;
    let _scopes = compiledProgram.scopes;
    bytes = bytecode;
    scopes = _scopes;
    strings = [];
    new VM(0, verbose).run();
}

export class WebAssembly_JS{
    private compiledProgram;
    constructor(compiledProgram: compiledProgram){
        this.compiledProgram = compiledProgram;
    }

    run(){
        runVM(this.compiledProgram, false);
    }
}