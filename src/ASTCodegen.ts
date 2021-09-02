import { BlockStatement, ThrowStatement, SequenceExpression, ConditionalExpression, TryStatement, BreakStatement, SwitchStatement, LogicalExpression, NewExpression, DebuggerStatement, ArrayExpression, ThisExpression, FunctionExpression, Property, MemberExpression, ForStatement, ObjectExpression, UnaryExpression, UpdateExpression, ReturnStatement, CallExpression, FunctionDeclaration, Identifier, AssignmentExpression, VariableDeclaration, WhileStatement, BinaryExpression, Literal, Node, VariableDeclarator, IfStatement, Program, ExpressionStatement } from "estree";
import { Op } from "./Op";
import { Scope } from "./Parserv2";
import { f64Bytes, i32Bytes, i8Bytes, isValidI32, isValidI8 } from "./Utils";

export function __writeI8(scope: Scope, n: number){
    let i8 = i8Bytes(n);
    scope.data[scope.offset++] = i8;
}

export function __writeI32(scope: Scope, n: number){
    let i32 = i32Bytes(n);
    scope.data[scope.offset++] = i32[0];
    scope.data[scope.offset++] = i32[1];
    scope.data[scope.offset++] = i32[2];
    scope.data[scope.offset++] = i32[3];
}

export function __writeF64(scope: Scope, n: number){
    let f64 = f64Bytes(n);
    scope.data[scope.offset++] = f64[0];
    scope.data[scope.offset++] = f64[1];
    scope.data[scope.offset++] = f64[2];
    scope.data[scope.offset++] = f64[3];
    scope.data[scope.offset++] = f64[4];
    scope.data[scope.offset++] = f64[5];
    scope.data[scope.offset++] = f64[6];
    scope.data[scope.offset++] = f64[7];
}

export function emitMakeArray(scope: Scope, nodes: number){
    __writeI8(scope, Op.MakeArray);
    __writeI32(scope, nodes);
}

export function emitThis(scope: Scope){
    __writeI8(scope, Op.This);
}


export function emitInstanceOf(scope: Scope){
    __writeI8(scope, Op.InstanceOf);
}

export function emitMinusOutFront(scope: Scope){
    __writeI8(scope, Op.MinusOutFront);
}

export function emitPlusOutFront(scope: Scope){
    __writeI8(scope, Op.PlusOutFront);
}

export function emitVoid(scope: Scope){
    __writeI8(scope, Op.Void);
}

export function emitIn(scope: Scope){
    __writeI8(scope, Op.In);
}

export function emitThrow(scope: Scope){
    __writeI8(scope, Op.Throw);
}

export function emitArguments(scope: Scope){
    __writeI8(scope, Op.GetArgs);
}

export function emitDebugger(scope: Scope){
    __writeI8(scope, Op.Debugger);
}

export function emitdelete(scope: Scope){
    __writeI8(scope, Op.Delete);
}

export function emitSetObjectProperty(scope: Scope){
    __writeI8(scope, Op.SetObjectProperty);
}

export function emitGetObjectProperty(scope: Scope){
    __writeI8(scope, Op.GetObjectProperty);
}

export function emitGetGlobalVariableValue(scope: Scope){
    __writeI8(scope, Op.GetGlobalVariableValue);
}

export function emitAssignValueToGlobal(scope: Scope){
    __writeI8(scope, Op.AssignValueToGlobal);
}

export function emitGetVariableValue(scope: Scope, varid: number){
    __writeI8(scope, Op.GetVariableValue);
    __writeI32(scope, varid);
}

export function emitString(scope: Scope, stringid){
    __writeI8(scope, Op.String);
    __writeI32(scope, stringid);
}

export function emitEND(scope: Scope){
    __writeI8(scope, Op.END);
}

export function emitReturn(scope: Scope){
    __writeI8(scope, Op.ReturnValue);
}

export function emitJMP(scope: Scope){
    __writeI8(scope, Op.Jump);
}

export function emitJumpIfFalse(scope: Scope) {
    __writeI8(scope, Op.JumpIfFalse);
}

export function emitLessThan(scope: Scope){
    __writeI8(scope, Op.LessThan);
}

export function emitLessThanOrEqual(scope: Scope){
    __writeI8(scope, Op.LessThanOrEqual);
}

export function emitEqualTo(scope: Scope){
    __writeI8(scope, Op.EqualTo);
}

export function emitEqualToStrict(scope: Scope){
    __writeI8(scope, Op.EqualToStrict);
}

export function emitNotEqualTo(scope: Scope){
    __writeI8(scope, Op.NotEqualTo);
}

export function emitNotEqualToStrict(scope: Scope){
    __writeI8(scope, Op.NotEqualToStrict);
}

export function emitGreaterThan(scope: Scope){
    __writeI8(scope, Op.GreaterThan);
}

export function emitGreaterThanOrEqual(scope: Scope){
    __writeI8(scope, Op.GreaterThanOrEqual);
}

export function emitAdd(scope: Scope){
    __writeI8(scope, Op.Add);
}

export function emitSub(scope: Scope){
    __writeI8(scope, Op.Sub);
}

export function emitDivide(scope: Scope){
    __writeI8(scope, Op.Divide);
}

export function emitNotSymbol(scope: Scope){
    __writeI8(scope, Op.NotSymbol);
}

export function emitTypeOf(scope: Scope){
    __writeI8(scope, Op.TypeOf);
}

export function emitNegateSymbol(scope: Scope){
    __writeI8(scope, Op.NegateSymbol);
}

export function emitOr(scope: Scope){
    __writeI8(scope, Op.Or);
}

export function emitAnd(scope: Scope){
    __writeI8(scope, Op.And);
}

export function emitPlusPlus(scope: Scope, varid){
    __writeI8(scope, Op.PlusPlus);
    __writeI32(scope, varid);
}

export function emitGlobal(scope: Scope){
    __writeI8(scope, Op.GlobalScope);
}

export function emitMinusMinus(scope: Scope, varid){
    __writeI8(scope, Op.MinusMinus);
    __writeI32(scope, varid);
}

export function emitMultiply(scope: Scope){
    __writeI8(scope, Op.Multiply);
}

export function emitRemainder(scope: Scope){
    __writeI8(scope, Op.Remainder);
}

export function emitBitAnd(scope: Scope){
    __writeI8(scope, Op.BitAnd);
}

export function emitBitOr(scope: Scope){
    __writeI8(scope, Op.BitOr);
}

export function emitBitXOR(scope: Scope){
    __writeI8(scope, Op.BitXOR);
}

export function emitBitLeftShift(scope: Scope){
    __writeI8(scope, Op.BitLeftShift);
}

export function emitBitRightShift(scope: Scope){
    __writeI8(scope, Op.BitRightShift);
}

export function emitBitZeroFillRightShift(scope: Scope){
    __writeI8(scope, Op.BitZeroFillRightShift);
}

export function emitRaiseExponent(scope: Scope){
    __writeI8(scope, Op.RaiseExponent);
}

export function emitI8(scope: Scope, n: number){
    __writeI8(scope, Op.I8);
    __writeI8(scope, n);
}

export function emitNewExpression(scope: Scope, totalArgs: number){
    __writeI8(scope, Op.New);
    __writeI32(scope, totalArgs);
}

export function emitJumpToBlock(scope: Scope, n: number){
    __writeI8(scope, Op.JumpToBlock);
    __writeI32(scope, n);
}

export function emitI32(scope: Scope, n: number){
    __writeI8(scope, Op.I32);
    __writeI32(scope, n);
}

export function emitF64(scope: Scope, n: number){
    __writeI8(scope, Op.I32);
    __writeF64(scope, n);
}

export function emitAssignValue(scope: Scope, varid: number){
    __writeI8(scope, Op.AssignValue);
    __writeI32(scope, varid);
}

export function emitCreateFunction(scope: Scope, blockid: number){
    __writeI8(scope, Op.CreateFunction);
    __writeI32(scope, blockid);
}

export function emitGetArguments(scope: Scope, index: number){
    __writeI8(scope, Op.GetArguments);
    __writeI8(scope, index);
}

export function emitBOOL(scope: Scope, bool: boolean){
    __writeI8(scope, Op.BOOL);
    __writeI8(scope, +bool);
}

export function emitNull(scope: Scope){
    __writeI8(scope, Op.Null);
}

export function emitMakeObject(scope: Scope, props: number){
    __writeI8(scope, Op.MakeObject);
    __writeI32(scope, props);
}

export function emitObjectPropertyCall(scope: Scope, totalArgs: number){
    __writeI8(scope, Op.ObjectPropertyCall);
    __writeI8(scope, totalArgs);
}

export function emitCall(scope: Scope, totalArgs: number){
    __writeI8(scope, Op.Call);
    __writeI8(scope, totalArgs);
}

export function loadNumber(scope: Scope, num: number){
    if(isValidI8(num)) emitI8(scope, num);
    else if(isValidI32(num)) emitI32(scope, num);
    else emitF64(scope, num);
}


export function GenerateLiteral(node: Literal, scope: Scope){
    if(typeof(node.value) === "string"){
        let id = scope.getStringId(node.value);
        emitString(scope, id);
    }
    else if(typeof(node.value) === "number") loadNumber(scope, node.value);
    else if(typeof(node.value) === "boolean") emitBOOL(scope, node.value);
    else if(node.value === null) emitNull(scope);
    else throw("Unsupported literal type" + node.value);
}

export function GenerateWhileStatement(node: WhileStatement, scope: Scope){
    
    const test_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    
    test_label.setTarget();

    scope.generate(node.test);
    
    emitJumpIfFalse(scope);

    let body_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    body_label.setOrigin();

    scope.generate(node.body);

    emitJMP(scope);
    test_label.setOrigin();

    body_label.setTarget();
    
}

export function GenerateThisExpression(node: ThisExpression, scope: Scope){
    emitThis(scope);
}

export function GenerateReturnStatement(node: ReturnStatement, scope: Scope){
    if(node.argument) scope.generate(node.argument);
    emitReturn(scope);
}

export function GenerateSequenceExpression(node: SequenceExpression, scope: Scope){
    node.expressions.forEach(child => scope.generate(child));
}

export function GenerateCallExpression(node: CallExpression, scope: Scope){
    let callee = node.callee;
    node.arguments.forEach(child => scope.generate(child));
    switch(callee.type){
        case "Identifier": {
            let id = scope.getVariableId(callee.name);
            if(id === -1){
                let id = scope.getStringId(callee.name);
                emitString(scope, id);
                emitGetGlobalVariableValue(scope);
            }else{
                emitGetVariableValue(scope, id);
            }
            emitCall(scope, node.arguments.length);
            break;
        }
        case "MemberExpression": {
            if(callee.property.type === "Identifier"){
                //load its property as a string
                let id = scope.getStringId(callee.property.name);
                emitString(scope, id);
            }else{
                scope.generate(callee.property);
            }
            scope.generate(callee.object);
            emitObjectPropertyCall(scope, node.arguments.length);
            break;
        }
        case "FunctionExpression": {
            scope.generate(callee);
            emitCall(scope, node.arguments.length);
            break;
        }
        default:
            throw("Unsupported callee type" + callee.type);
    }
}

export function GenerateConditionalExpression(node: ConditionalExpression, scope: Scope){
    scope.generate(node.test);

    emitJumpIfFalse(scope);
    const test_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    test_label.setOrigin();
    
    scope.generate(node.consequent);

    emitJMP(scope);
    let consequent_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    consequent_label.setOrigin();
    
    test_label.setTarget();
    scope.generate(node.alternate);
    consequent_label.setTarget();
}

export function GenerateFunctionExpression(node: FunctionExpression, scope: Scope){
    
    if(scope.node === node){
        let argumentId = 0;
        node.params.forEach(child => {
            if(child.type === "Identifier"){
                //redeclare the variable under the new scope
                console.log("entering");
                let varid = scope.getVariableId(child.name);
                console.log("Exciting", varid, child.name);
                emitGetArguments(scope, argumentId);
                emitAssignValue(scope, varid);
                argumentId++;

            }else{
                throw("Unknown paramater type");
                scope.generate(child)
            }
        });
        scope.generate(node.body);
    }else{
        let child = scope.makeChild(node);
        child.generate(child.node);
        emitEND(child);
        emitCreateFunction(scope, child.id);
    }
}

export function GenerateFunctionDeclaration(node: FunctionDeclaration, scope: Scope){
    
    if(scope.node === node){
        let argumentId = 0;
        node.params.forEach(child => {
            if(child.type === "Identifier"){
                //redeclare the variable under the new scope
                let varid = scope.getVariableId(child.name);
                emitGetArguments(scope, argumentId);
                emitAssignValue(scope, varid);
                argumentId++;

            }else{
                throw("Unknown paramater type");
                scope.generate(child)
            }
        });

        scope.generate(node.body);
    }else{
        let id = scope.getVariableId(node.id.name);

        let child = scope.makeChild(node);
        child.generate(child.node);
        emitEND(child);
    
        emitCreateFunction(scope, child.id);
        emitAssignValue(scope, id);
    }
}

export function GenerateDebuggerStatement(node: DebuggerStatement, scope: Scope){
    emitDebugger(scope);
}

export function GenerateNewExpression(node: NewExpression, scope: Scope){
    scope.generate(node.callee);
    node.arguments.forEach(child => scope.generate(child));
    emitNewExpression(scope, node.arguments.length);
}

export function GenerateIdentifier(node: Identifier, scope: Scope){

    if(node.name === "arguments"){
        return;
    }

    let id = scope.getVariableId(node.name);

    if(id === -1){ //its a global property...
        let id = scope.getStringId(node.name);
        emitString(scope, id);
        emitGetGlobalVariableValue(scope);
    }else{
        emitGetVariableValue(scope, id);
    }
}

export function GenerateLogicalExpression(node: LogicalExpression, scope: Scope){
    switch(node.operator){
        case "||": {
            scope.generate(node.left);
            scope.generate(node.right);
            emitOr(scope);
            break;
        }
        case "&&": {
            scope.generate(node.left);
            scope.generate(node.right);
            emitAnd(scope);
            break;
        }
        default: 
            throw("Unknown logical expression");
    }
}

const break_labels = [];
//lets pray that its inside the switch
export function GenerateBreakStatement(node: BreakStatement, scope: Scope){
    let break_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    emitJMP(scope);
    break_label.setOrigin();
    break_labels.push(break_label);
}

export function GenerateTryStatement(node: TryStatement, scope: Scope){
    //throTryStatement
    scope.generate(node.block);
}

export function GenerateSwitchStatement(node: SwitchStatement, scope: Scope){
    //return
    
    let labels = [];
    let cases = node.cases;
    for(let i = 0; i < cases.length; i++){
        var _case = cases[i];
        if(_case.test){
            scope.generate(node.discriminant);
            scope.generate(_case.test)
            emitNotEqualToStrict(scope);
            emitJumpIfFalse(scope);
            let label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
            label.setOrigin();
            labels.push(label);
        }else{
            emitJMP(scope);
            let defaultCaseJump = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
            defaultCaseJump.setOrigin();
            labels.push(defaultCaseJump);
        }
    }

    let jump_missed_cases = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    emitJMP(scope);
    jump_missed_cases.setOrigin();

    for(let i = 0; i < cases.length; i++){
        
        labels[i].setTarget();
        var _case = cases[i];
        _case.consequent.forEach(child => scope.generate(child));
    }

    break_labels.forEach(label => label.setTarget());
    break_labels.length = 0;    
    jump_missed_cases.setTarget();
}

export function GenerateAssignmentExpression(node: AssignmentExpression, scope: Scope){
    scope.generate(node.right);
    let left = node.left;
    if(node.operator === "="){
        switch(left.type){
            case "Identifier":
                let id = scope.getVariableId(left.name);
                if(id === -1){
                    let stringid = scope.getStringId(left.name);
                    emitString(scope, stringid);
                    emitAssignValueToGlobal(scope);
                }else{
                    emitAssignValue(scope, id);
                }
                break;
            case "MemberExpression": {

                
                scope.generate(left.object);
                let property = left.property;
                //if its computed, dont run that shit
                if(property.type === "Identifier" && !left.computed){
                    let stringid = scope.getStringId(property.name);
                    emitString(scope, stringid);
                }else{
                    scope.generate(left.property);
                }
                emitSetObjectProperty(scope);
                break;
            }
            default:
                throw("Invalid assignment expression type");
        }
    }else if(node.operator === "+=" || node.operator === "-=" || node.operator === "%=" || node.operator === "^=" || node.operator === "&=" || node.operator === "|="){
        switch(left.type){
            case "Identifier":
                let id = scope.getVariableId(left.name);
                if(id === -1){
                    let stringid = scope.getStringId(left.name);
                    emitString(scope, stringid);
                    emitGetGlobalVariableValue(scope);
                    switch(node.operator){
                        case "^=":
                            emitBitXOR(scope);
                            break;
                        case "&=":
                            emitBitAnd(scope);
                            break;
                        case "%=":
                            emitRemainder(scope);
                            break;
                        case "-=":
                            emitSub(scope);
                            break;
                        case "|=":
                            emitBitOr(scope);
                            break;
                        case "+=":
                            emitAdd(scope);
                            break;
                        default:
                            throw("Unknown type");
                    }
                    emitString(scope, stringid);
                    emitAssignValueToGlobal(scope);
                }else{
                    emitGetVariableValue(scope, id);
                    switch(node.operator){
                        case "^=":
                            emitBitXOR(scope);
                            break;
                        case "&=":
                            emitBitAnd(scope);
                            break;
                        case "%=":
                            emitRemainder(scope);
                            break;
                        case "-=":
                            emitSub(scope);
                            break;
                        case "|=":
                            emitBitOr(scope);
                            break;
                        case "+=":
                            emitAdd(scope);
                            break;
                        default:
                            throw("Unknown type");
                    }
                    emitAssignValue(scope, id);
                }
                break;
            case "MemberExpression": {

                
                scope.generate(left.object);
                let property = left.property;
                //if its computed, dont run that shit
                if(property.type === "Identifier" && !left.computed){
                    let stringid = scope.getStringId(property.name);
                    emitString(scope, stringid);
                }else{
                    scope.generate(left.property);
                }
                emitSetObjectProperty(scope);
                break;
            }
            default:
                throw("Invalid assignment expression type");
        }
    }else{
        throw("Unsupported assignment operator");
    }
}

export function GenerateVariableDeclarator(node: VariableDeclarator, scope: Scope){
    if(node.init) scope.generate(node.init);
    switch(node.id.type){
        case "Identifier": {
            let id = scope.getVariableId(node.id.name);
            emitAssignValue(scope, id);
            break;
        }
        default:
            throw("Unknown init varaible");
    }
}

export function GenerateMemberExpression(node: MemberExpression, scope: Scope){
    let object = node.object;
    
    switch(object.type){
        case "Identifier":
            let id = scope.getVariableId(object.name);
            if(id === -1){
                let id = scope.getStringId(object.name);
                emitString(scope, id);
                emitGetGlobalVariableValue(scope);
            }else{
                emitGetVariableValue(scope, id);
            }   
            break;
        default:
            scope.generate(object);
    }

    let property = node.property;

    switch(property.type){
        
        case "Identifier": {
            if(!node.computed){
                let id = scope.getStringId(property.name);
                emitString(scope, id);
                break;
            }
        }
        default:
            scope.generate(node.property);
    }

    emitGetObjectProperty(scope);
}

export function GenerateProperty(node: Property, scope: Scope){
    let key = node.key;
    switch(key.type){
        case "Identifier":
            let stringid = scope.getStringId(key.name);
            emitString(scope, stringid);
            break;
        default:
            throw("Unknow property @generateProperty");
    }
    scope.generate(node.value);
}

export function GenerateArrayExpression(node: ArrayExpression, scope: Scope){
    node.elements.forEach(child => scope.generate(child));
    emitMakeArray(scope, node.elements.length);
}

export function GenerateObjectExpression(node: ObjectExpression, scope: Scope){
    node.properties.forEach(child => scope.generate(child));
    emitMakeObject(scope, node.properties.length);
}

export function GenerateForStatement(node: ForStatement, scope: Scope){
    if(node.init) scope.generate(node.init);
    let pre_test_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    pre_test_label.setTarget();

    if(node.test) scope.generate(node.test);
    emitJumpIfFalse(scope)
    let skip_body_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    skip_body_label.setOrigin();

    if(node.body) scope.generate(node.body);
    if(node.update) scope.generate(node.update);

    emitJMP(scope);
    pre_test_label.setOrigin();
    skip_body_label.setTarget();
}

export function GenerateVariableDeclaration(node: VariableDeclaration, scope: Scope){
    node.declarations.forEach(child => scope.generate(child));
}

export function GenerateUnaryExpression(node: UnaryExpression, scope: Scope){
    if(node.operator === "delete"){
        let memExp = node.argument;
        if(memExp.type === "MemberExpression"){
            scope.generate(memExp.object);
            scope.generate(memExp.property);
            emitdelete(scope);
        }else{
            throw("cant delete on not a member expression");
        }
        return;
    }
    scope.generate(node.argument);
    switch(node.operator){
        case "!":
            emitNotSymbol(scope);
            break;
        case "~":
            emitNegateSymbol(scope);
            break;
        case "typeof":
            emitTypeOf(scope);
            break;
        case "-":
            emitMinusOutFront(scope);
            break;
        case "+":
            emitPlusOutFront(scope);
            break;
        case "void":
            emitVoid(scope);
            break;
        default:
            throw("Unsuported unary expression: " + node.operator);
    }
}

export function GenerateUpdateExpression(node: UpdateExpression, scope: Scope){
    let argument = node.argument;
    switch(argument.type){
        case "Identifier": {
            let varid = scope.getVariableId(argument.name);
            switch(node.operator){
                case "++": {
                    if(varid === -1){
                        throw("Cant handle global++ yet");
                    }else{
                        emitPlusPlus(scope, varid);
                    }
                    break;
                }
                case "--": {
                    if(varid === -1){
                        throw("Cant handle global++ yet");
                    }else{
                        emitMinusMinus(scope, varid);
                    }
                    break;
                }
                default:
                    throw("Unknown update statement: " + node.operator);
            }

            break;
        }
        default:
            throw("Unknown update statement type");
    }
}

export function GenerateBinaryExpression(node: BinaryExpression, scope: Scope){
    scope.generate(node.left);
    scope.generate(node.right);
    switch(node.operator){
        case "<": {
            emitLessThan(scope);
            break;
        }
        case "<=": {
            emitLessThanOrEqual(scope);
            break;
        }
        case ">": {
            emitGreaterThan(scope);
            break;
        }
        case ">=": {
            emitGreaterThanOrEqual(scope);
            break;
        }
        case "==": {
            emitEqualTo(scope);
            break;
        }
        case "===": {
            emitEqualToStrict(scope);
            break;
        }
        case "!=": {
            emitNotEqualTo(scope);
            break;
        }
        case "!==": {
            emitNotEqualTo(scope);
            break;
        }
        case "**": {
            emitRaiseExponent(scope);
            break;
        }
        case ">>": {
            emitBitRightShift(scope);
            break;
        }
        case ">>>": {
            emitBitZeroFillRightShift(scope);
            break;
        }
        case "<<": {
            emitBitLeftShift(scope);
            break;
        }
        case "&": {
            emitBitAnd(scope);
            break;
        }
        case "|": {
            emitBitOr(scope);
            break;
        }
        case "^": {
            emitBitXOR(scope);
            break;
        }
        case "*": {
            emitMultiply(scope);
            break;
        }
        case "/": {
            emitDivide(scope);
            break;
        }
        case "-": {
            emitSub(scope);
            break;
        }
        case "+": {
            emitAdd(scope);
            break;
        }
        case "%": {
            emitRemainder(scope);
            break;
        }
        case "instanceof": {
            emitInstanceOf(scope);
            break;
        }
        case "in": {
            emitIn(scope);
            break;
        }
        default:
            throw("Unknown binary operation: " + node.operator);
    }
}

export function GenerateThrowStatement(node: ThrowStatement, scope: Scope){
    scope.generate(node.argument);
    emitThrow(scope);
}

export function GenerateBlockStatement(node: BlockStatement, scope: Scope){
   // if(scope.node === node){
        node.body.forEach(child => scope.generate(child));
        //scope.emitEND();
    //}else{
      //  let child = scope.child(node);
       // scope.emitJumpToBlock(child.id);
        //child.generate(child.node);
    //}
}

export function GenerateIfStatement(node: IfStatement, scope: Scope){
    scope.generate(node.test);

    emitJumpIfFalse(scope);
    const test_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    test_label.setOrigin();
    
    scope.generate(node.consequent);

    emitJMP(scope);
    let consequent_label = scope.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    consequent_label.setOrigin();
    
    test_label.setTarget();
    if(node.alternate) scope.generate(node.alternate);
    consequent_label.setTarget();
}

export function GenerateExpressionStatement(node: ExpressionStatement, scope: Scope){
    scope.generate(node.expression);
}

export function GenerateProgram(node: Program, scope: Scope){
    node.body.forEach(child => scope.generate(child));
    emitEND(scope);
}