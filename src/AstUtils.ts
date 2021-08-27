import acorn, { parse } from "acorn";
import {traverse} from "estraverse";
import { OP } from "./Constants";
import { stringArrayTobytes } from "./StringUtils";
import {scopeInfo, compiledProgram} from "./types";
import {analyze} from "escope";
import { Float64ToBytes, isValidUint32, isValidUint8, Uint32ToBytes } from "./NumberUtils";

export function makeAST(code): acorn.Node{
    return parse(code, {ecmaVersion: "latest"});
}

function makeLiteral(val) {
    return {
        "type": "Literal",
        "value": val,
        "start": 0,
        "end": 0,
        "raw": JSON.stringify(val)
    };
}

export function extractString(ast): string[] {
    let map = new Map();
    let extractedStrings = [];

    function addStr(str: string){
        if(!map.has(str)){
            map.set(str, true);
            extractedStrings.push(str);
            return true;
        }
        return false;
    }

    var scopeManager = analyze(ast);
    var globalScope = getScope(scopeManager, ast);
    var currentScope = globalScope;

    //https://github.com/estools/estraverse
    traverse(ast, {
        enter: function (node, parent) {

            //handle literal
            if(node.type === "Literal"){
                let val = node.value;

                if(typeof val === "string"){
                    addStr(val);
                } else if(typeof val === "number") {
                    //numbers are loaded inside the code
                }else{
                    //handle regex
                    if(node.value.constructor === RegExp){
                        addStr(node.raw);
                    }else{
                        throw("Unknown literal type");
                    }
                }
            }else if(node.type === "Property"){
                //this might me redundant...
                let key = node.key;
                //handle only Identifiers. Literal will be handled
                if(key.type === "Identifier"){
                    //@ts-ignore
                    node.key = makeLiteral(key.name);
                }
            }else if(node.type === "MemberExpression"){
                let property = node.property;
                if(property.type === "Identifier" && !node.computed){
                    //@ts-ignore
                    node.property = makeLiteral(property.name);
                    node.computed = true;
                }
            }else if(node.type === "Identifier"){
                let variableDefinition = findScope(currentScope, node.name);
                if(!variableDefinition){
                    addStr(node.name);
                }
            }

            if (/Function/.test(node.type)) {
                currentScope = getScope(scopeManager, node);  // get current function scope
            }
        },
        leave: function(node, parent){

            if (/Function/.test(node.type)) {
                currentScope = currentScope.upper;  // set to parent scope
            }
        }
    });
    return extractedStrings;
}

function isGlobalProp(name: string){
    let o =
      "object" == typeof globalThis
        ? globalThis
        : "object" == typeof window
        ? window
        : self;
    if(name in o) return true;
    try{
        function fn(__) {
            throw new ReferenceError(__ + " is not defined")
        }
        fn(name);
        return true;
    }catch{
        return false;
    }
}


let _id = 0;
export function getScope(scopeManager, ast){
    let scope = scopeManager.acquire(ast);
    scope.__id = _id++;
    return scope;
}

let _id2 = 0;
export function getScope_2(scopeManager, ast){
    let scope = scopeManager.acquire(ast);
    scope.__id = _id2++;
    return scope;
}

function findScope(scope, identifierName){
    if(scope.set.has(identifierName)) return {
        scope: scope.__id,
        id: scope.variables.findIndex((v) => v.name === identifierName)
    };

    if(scope.upper) return findScope(scope.upper, identifierName);
    
    return null;
}

export function makebyteCode(scopeManager, currentScope, ast, strings: string[], stringBytes: Uint8Array, verbose: boolean = true): compiledProgram {
    _id = 0;
    _id2 = 0;   
    let buf = [];
    buf.push(...stringBytes);
    let scopeInfos: scopeInfo = [];

    function recursiveScope(scope){
        scopeInfos.push( [scope.__id, scope.set.size] );
        scope.childScopes.forEach( _ => recursiveScope( _ ));
    }

    function load_global(prop: string){
        load_str(prop);
        buf.push(OP.LOAD_GLOBAL);
    }

    function load_var(variableDefinition){
        if(!variableDefinition) throw("No variable declartion is null");
        buf.push(OP.LOAD_VAR);
        buf.push(...Uint32ToBytes(variableDefinition.id));
    }

    function load_new_no_push(totalArgs: number){
        buf.push(OP.NEW_INSTANCE_NO_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }

    function load_new_and_push(totalArgs: number){
        buf.push(OP.NEW_INSTANCE_AND_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }

    function call_function_by_prop_no_push(totalArgs: number){
        buf.push(OP.CALL_FUNCTION_BY_PROP_NO_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }

    function call_function_by_prop_and_push(totalArgs: number){
        buf.push(OP.CALL_FUNCTION_BY_PROP_AND_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }
    
    function call_stack_no_push(totalArgs: number){
        buf.push(OP.CALL_STACK_NO_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }

    function call_stack_push(totalArgs: number){
        buf.push(OP.CALL_STACK_AND_PUSH);
        if(totalArgs > 0xff) throw new Error("Too many arguments, expected <= 255")
        buf.push(totalArgs);
    }

    function load_num(num: number){
        if(isValidUint8(num)) buf.push(OP.LOAD_I8, num);
        else if(isValidUint32(num)) buf.push(OP.LOAD_I32, ...Uint32ToBytes(num));
        else buf.push(OP.LOAD_F64, ...Float64ToBytes(num));
    }

    function load_str(str: string){
        let index = strings.indexOf(str);
        buf.push(OP.LOAD_STRING);
        buf.push(...Uint32ToBytes(index));
    }

    function load_regex(str: string){
        let index = strings.indexOf(str);
        buf.push(OP.LOAD_REGEX);
        buf.push(...Uint32ToBytes(index));
    }

    recursiveScope(currentScope);
    if(verbose) console.log(scopeInfos);

    function getVariableInfo(scope, name){
        return findScope(scope, name);
    }
    
    traverse(ast, {
        enter: function(node, parent) {
            // do stuff

            //console.log("[+] " + node.type);

            if (/Function/.test(node.type)) {
                currentScope = getScope_2(scopeManager, node);  // get current function scope
            }
        },
        leave: function(node, parent) {
            // do stuff

            switch(node.type){
                case "Literal": {
                    switch(typeof(node.value)){
                        case "number": {
                            load_num(node.value);
                            break;
                        }
                        case "string": {
                            load_str(node.value);
                            break;
                        }
                        case "object": {
                            if(node.value.constructor !== RegExp){
                                throw("Literal is not a regex");
                            }
                            //load regex
                            load_regex(node.raw);
                            break;
                        }
                        default:
                            throw("Unknown type: " + node.value, typeof(node.value));
                    }
                    break;
                }
                case "ObjectExpression": {
                    buf.push(OP.LOAD_OBJ);
                    for(let i = 0 ; i < node.properties.length; i++) buf.push(OP.SET_OBJ_PROPS_NO_POP);
                    break;
                }
                case "ArrayExpression": {
                    buf.push(OP.LOAD_ARRAY);
                    for(let i = 0 ; i < node.elements.length; i++) buf.push(OP.PUSH_ARRAY_NO_POP);
                    break;
                }
                case "VariableDeclarator": {
                    let init = node.init;
                    let id = node.id;
                    if(id.type !== "Identifier") throw("Not identifier");
                    let variableName = id.name;
                    let variableDefinition = getVariableInfo(currentScope, variableName);
                    if(!variableDefinition) throw("undefined varaible");

                    if(init){
                        if(verbose) console.log("ASSIGN", variableName);
                        buf.push(OP.ASSIGN, variableDefinition.id);
                    }else{
                        //we dont have to assign
                    }

                    break;
                }
                case "AssignmentExpression": {
                    let left = node.left;
                    let right = node.right;

                    if(left.type === "MemberExpression"){
                        if(left.object.type !== "Identifier") throw("Unhandled assignment");
                        let variableName = left.object.name;
                        let variableDefinition = getVariableInfo(currentScope, variableName);

                        buf.push(OP.ASSIGN_OBJECT);
                        break;
                    }

                    if(left.type !== "Identifier") throw("ERROR");
                    let variableName = left.name;
                    let variableDefinition = getVariableInfo(currentScope, variableName);
                    
                    //if there is no varaible definition, it must be global
                    
                    if(variableDefinition){
                        buf.push(OP.ASSIGN, variableDefinition.id);
                    }else{
                        //push the value onto the stack
                        load_str(left.name)
                        buf.push(OP.ASSIGN_GLOBAL);
                    }

                    switch(right.type){
                        case "ObjectExpression": {
                            break;
                        }
                    }
                    break;
                }
                case "MemberExpression": {
                    let object = node.object;
                    let property = node.property;
                    
                    switch(parent.type){
                        //handle cases like a.b = c as we dont want to load a.b's value
                        case "AssignmentExpression": {
                            break;
                        }
                        //handle cases like array.push() where you CANT store the push function
                        case "CallExpression": {
                            //case of fn(obj.prop) should evaluate the property
                            if(parent.callee !== node){
                                buf.push(OP.GET_OBJ_PROP_AND_PUSH);
                            }
                            break;
                        }
                        default: {
                            buf.push(OP.GET_OBJ_PROP_AND_PUSH);
                            break;
                        }
                    }
                    break;
                }
                case "NewExpression": {
                    let shouldPushValueToStack = parent.type !== "ExpressionStatement";
                    let totalArgs = node.arguments.length;
                    if(shouldPushValueToStack){
                        load_new_and_push(totalArgs);
                    }else{
                        load_new_no_push(totalArgs);
                    }
                    break;
                }
                case "CallExpression": {
                    let shouldPushValueToStack = parent.type !== "ExpressionStatement";
                    let totalArgs = node.arguments.length;

                    switch(node.callee.type){
                        //handle cases like array.push(args) which have to be called on an object
                        case "MemberExpression": {
                            if(shouldPushValueToStack){
                                call_function_by_prop_and_push(totalArgs);
                            }else{
                                call_function_by_prop_no_push(totalArgs);
                            }
                            break;
                        }
                        //for everything else issue the call command
                        default: {
                            if(shouldPushValueToStack){
                                call_stack_push(totalArgs);
                            }else{
                                call_stack_no_push(totalArgs);
                            }
                            break;
                        }
                    }

                    break;
                }
                case "BinaryExpression": {
                    switch(node.operator){
                        case "+": {
                            buf.push(OP.ADD);
                            break;
                        }
                        case "-": {
                            buf.push(OP.SUB);
                            break;
                        }
                        case "/": {
                            buf.push(OP.DIV);
                            break;
                        }
                        case "*": {
                            buf.push(OP.MUL);
                            break;
                        }
                        case "<<": {
                            buf.push(OP.BIT_SHIFT_LEFT);
                            break;
                        }
                        case ">>": {
                            buf.push(OP.BIT_SHIFT_RIGHT);
                            break;
                        }
                        case "&": {
                            buf.push(OP.BITWISE_AND);
                            break;
                        }
                        case "^": {
                            buf.push(OP.XOR);
                            break;
                        }
                        case "|": {
                            buf.push(OP.BITWISE_OR);
                            break;
                        }
                        case ">>>": {
                            buf.push(OP.UNSIGNED_RIGHT_SHIFT);
                            break;
                        }
                        case "**": {
                            buf.push(OP.EXPONENT);
                            break;
                        }
                        case "%": {
                            buf.push(OP.REMAINDER);
                            break;
                        }
                        default:
                            throw("Unknown binary expression");
                    }
                    break;
                }
                case "Identifier": {
                    if(parent.type === "VariableDeclarator") break;
                    if(parent.type === "AssignmentExpression" && parent.left === node) break;

                    let variableName = node.name;
                    let variableDefinition = getVariableInfo(currentScope, variableName);

                    if(variableDefinition){
                        load_var(variableDefinition);
                    }else{
                        load_global(variableName);
                    }
                    break;
                }
            }

            if(verbose) console.log("[-] " + node.type);

            if (/Function/.test(node.type)) {
                currentScope = currentScope.upper;  // set to parent scope
            }
        }
    });

    let u8view = new Uint8Array(buf);
    let raw = Buffer.from(u8view).toString("base64");
    return {
        bytecode: u8view,
        scopes: scopeInfos,
        raw: raw,
    };
}

export function compileProgram(code: string, verbose: boolean = true): compiledProgram{
    //build ast
    let ast = makeAST(code);
    //step 2, extract strings
    let strings = extractString(ast);
    //step 2.1 pack strings together as [op, len, bytes...]
    let stringBytes = stringArrayTobytes(strings);
    //step 3 get scopes
    var scopeManager = analyze(ast);
    var globalScope = getScope_2(scopeManager, ast);
    //step 4 compile bytecode
    return makebyteCode(scopeManager, globalScope, ast, strings, stringBytes, verbose);
}