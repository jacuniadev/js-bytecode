import { BlockStatement, BreakStatement, SwitchStatement, LogicalExpression, NewExpression, DebuggerStatement, ArrayExpression, ThisExpression, FunctionExpression, Property, MemberExpression, ForStatement, ObjectExpression, UnaryExpression, UpdateExpression, ReturnStatement, CallExpression, FunctionDeclaration, Identifier, AssignmentExpression, VariableDeclaration, WhileStatement, BinaryExpression, Literal, Node, VariableDeclarator, IfStatement, Program, ExpressionStatement } from "estree";
import { Generator } from "./Generator";

export function GenerateLiteral(node: Literal, generator: Generator){
    if(typeof(node.value) === "string"){
        let id = generator.stringManager.add(node.value);
        generator.emitString(id);
    }
    else if(typeof(node.value) === "number") generator.loadNumber(node.value);
    else if(typeof(node.value) === "boolean") generator.emitBOOL(node.value);
    else throw("Unsupported literal type");
}

export function GenerateWhileStatement(node: WhileStatement, generator: Generator){
    
    const test_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    
    test_label.setTarget();

    generator.generate(node.test);
    
    generator.emitJumpIfFalse();

    let body_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    body_label.setOrigin();

    generator.generate(node.body);

    generator.emitJMP();
    test_label.setOrigin();

    body_label.setTarget();
    
}

export function GenerateThisExpression(node: ThisExpression, generator: Generator){
    generator.emitThis();
}

export function GenerateReturnStatement(node: ReturnStatement, generator: Generator){
    if(node.argument) generator.generate(node.argument);
    generator.emitReturn();
}

export function GenerateCallExpression(node: CallExpression, generator: Generator){
    let callee = node.callee;
    node.arguments.forEach(child => generator.generate(child));
    switch(callee.type){
        case "Identifier": {
            let id = generator.getVariableIndex(callee.name);
            if(id === -1){
                let id = generator.stringManager.add(callee.name);
                generator.emitString(id);
                generator.emitGetGlobalVariableValue();
            }else{
                generator.emitGetVariableValue(id);
            }
            generator.emitCall(node.arguments.length);
            break;
        }
        case "MemberExpression": {
            if(callee.property.type === "Identifier"){
                //load its property as a string
                let id = generator.stringManager.add(callee.property.name);
                generator.emitString(id);
            }else{
                generator.generate(callee.property);
            }
            generator.generate(callee.object);
            generator.emitObjectPropertyCall(node.arguments.length);
            break;
        }
        default:
            throw("Unsupported callee type");
    }
}
export function GenerateFunctionExpression(node: FunctionExpression, generator: Generator){
    
    if(generator.node === node){
        let argumentId = 0;
        node.params.forEach(child => {
            if(child.type === "Identifier"){
                //redeclare the variable under the new scope
                let varid = generator.declareVariable(child.name);
                generator.emitGetArguments(argumentId);
                generator.emitAssignValue(varid);
                argumentId++;

            }else{
                throw("Unknown paramater type");
                generator.generate(child)
            }
        });
        generator.generate(node.body);
    }else{
        let child = generator.child(node);
        child.generate(child.node);
        child.emitEND();
        generator.emitCreateFunction(child.id);
    }
}

export function GenerateFunctionDeclaration(node: FunctionDeclaration, generator: Generator){
    
    if(generator.node === node){
        let argumentId = 0;
        node.params.forEach(child => {
            if(child.type === "Identifier"){
                //redeclare the variable under the new scope
                let varid = generator.declareVariable(child.name);
                generator.emitGetArguments(argumentId);
                generator.emitAssignValue(varid);
                argumentId++;

            }else{
                throw("Unknown paramater type");
                generator.generate(child)
            }
        });

        generator.generate(node.body);
    }else{
        let id = generator.declareVariable(node.id.name);

        let child = generator.child(node);
        child.generate(child.node);
        child.emitEND();
    
        generator.emitCreateFunction(child.id);
        generator.emitAssignValue(id);
    }
}

export function GenerateDebuggerStatement(node: DebuggerStatement, generator: Generator){
    generator.emitDebugger();
}

export function GenerateNewExpression(node: NewExpression, generator: Generator){
    generator.generate(node.callee);
    node.arguments.forEach(child => generator.generate(child));
    generator.emitNewExpression(node.arguments.length);
}

export function GenerateIdentifier(node: Identifier, generator: Generator){
    let id = generator.getVariableIndex(node.name);

    if(id === -1){ //its a global property...
        let id = generator.stringManager.add(node.name);
        generator.emitString(id);
        generator.emitGetGlobalVariableValue();
    }else{
        generator.emitGetVariableValue(id);
    }
}

export function GenerateLogicalExpression(node: LogicalExpression, generator: Generator){
    switch(node.operator){
        case "||": {
            generator.generate(node.left);
            generator.generate(node.right);
            generator.emitOr();
            break;
        }
        case "&&": {
            generator.generate(node.left);
            generator.generate(node.right);
            generator.emitAnd();
            break;
        }
        default: 
            throw("Unknown logical expression");
    }
}

export function GenerateBreakStatement(node: BreakStatement, generator: Generator){
    generator.emitEND();
}

export function GenerateSwitchStatement(node: SwitchStatement, generator: Generator){
    //return
    if(node === generator.node){
        let labels = [];
        let cases = node.cases;
        for(let i = 0; i < cases.length; i++){
            var _case = cases[i];
            if(_case.test){
                generator.generate(node.discriminant);
                generator.generate(_case.test)
                generator.emitNotEqualToStrict();
                generator.emitJumpIfFalse();
                let label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
                label.setOrigin();
                labels.push(label);
            }else{
                generator.emitJMP();
                let defaultCaseJump = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
                defaultCaseJump.setOrigin();
                labels.push(defaultCaseJump);
            }
        }
    
        generator.emitEND();

        for(let i = 0; i < cases.length; i++){
            
            labels[i].setTarget();
            var _case = cases[i];
            _case.consequent.forEach(child => generator.generate(child));
        }
    }else{
        let child = generator.child(node);
        generator.emitJumpToBlock(child.id);
        child.generate(child.node);
        child.emitEND();    
    }
}

export function GenerateAssignmentExpression(node: AssignmentExpression, generator: Generator){
    generator.generate(node.right);
    let left = node.left;
    if(node.operator === "="){
        switch(left.type){
            case "Identifier":
                let id = generator.getVariableIndex(left.name);
                if(id === -1){
                    let stringid = generator.stringManager.add(left.name);
                    generator.emitString(stringid);
                    generator.emitAssignValueToGlobal();
                }else{
                    generator.emitAssignValue(id);
                }
                break;
            case "MemberExpression": {

                
                generator.generate(left.object);
                let property = left.property;
                //if its computed, dont run that shit
                if(property.type === "Identifier" && !left.computed){
                    let stringid = generator.stringManager.add(property.name);
                    generator.emitString(stringid);
                }else{
                    generator.generate(left.property);
                }
                generator.emitSetObjectProperty();
                break;
            }
            default:
                throw("Invalid assignment expression type");
        }
    }else if(node.operator === "+=" || node.operator === "-=" || node.operator === "%=" || node.operator === "^=" || node.operator === "&=" || node.operator === "|="){
        switch(left.type){
            case "Identifier":
                let id = generator.getVariableIndex(left.name);
                if(id === -1){
                    let stringid = generator.stringManager.add(left.name);
                    generator.emitString(stringid);
                    generator.emitGetGlobalVariableValue();
                    switch(node.operator){
                        case "^=":
                            generator.emitBitXOR();
                            break;
                        case "&=":
                            generator.emitBitAnd();
                            break;
                        case "%=":
                            generator.emitRemainder();
                            break;
                        case "-=":
                            generator.emitSub();
                            break;
                        case "|=":
                            generator.emitBitOr();
                            break;
                        case "+=":
                            generator.emitAdd();
                            break;
                        default:
                            throw("Unknown type");
                    }
                    generator.emitString(stringid);
                    generator.emitAssignValueToGlobal();
                }else{
                    generator.emitGetVariableValue(id);
                    switch(node.operator){
                        case "^=":
                            generator.emitBitXOR();
                            break;
                        case "&=":
                            generator.emitBitAnd();
                            break;
                        case "%=":
                            generator.emitRemainder();
                            break;
                        case "-=":
                            generator.emitSub();
                            break;
                        case "|=":
                            generator.emitBitOr();
                            break;
                        case "+=":
                            generator.emitAdd();
                            break;
                        default:
                            throw("Unknown type");
                    }
                    generator.emitAssignValue(id);
                }
                break;
            case "MemberExpression": {

                
                generator.generate(left.object);
                let property = left.property;
                //if its computed, dont run that shit
                if(property.type === "Identifier" && !left.computed){
                    let stringid = generator.stringManager.add(property.name);
                    generator.emitString(stringid);
                }else{
                    generator.generate(left.property);
                }
                generator.emitSetObjectProperty();
                break;
            }
            default:
                throw("Invalid assignment expression type");
        }
    }else{
        throw("Unsupported assignment operator");
    }
}

export function GenerateVariableDeclarator(node: VariableDeclarator, generator: Generator){
    if(node.init) generator.generate(node.init);
    switch(node.id.type){
        case "Identifier": {
            let id = generator.declareVariable(node.id.name);
            generator.emitAssignValue(id);
            break;
        }
        default:
            throw("Unknown init varaible");
    }
}

export function GenerateMemberExpression(node: MemberExpression, generator: Generator){
    let object = node.object;
    
    switch(object.type){
        case "Identifier":
            let id = generator.declareVariable(object.name);
            if(id === -1){
                let id = generator.stringManager.add(object.name);
                generator.emitString(id);
                generator.emitGetGlobalVariableValue();
            }else{
                generator.emitGetVariableValue(id);
            }   
            break;
        default:
            generator.generate(object);
    }

    let property = node.property;

    switch(property.type){
        
        case "Identifier": {
            if(!node.computed){
                let id = generator.stringManager.add(property.name);
                generator.emitString(id);
                break;
            }
        }
        default:
            generator.generate(node.property);
    }

    generator.emitGetObjectProperty();
}

export function GenerateProperty(node: Property, generator: Generator){
    let key = node.key;
    switch(key.type){
        case "Identifier":
            let stringid = generator.stringManager.add(key.name);
            generator.emitString(stringid);
            break;
        default:
            throw("Unknow property @generateProperty");
    }
    generator.generate(node.value);
}

export function GenerateArrayExpression(node: ArrayExpression, generator: Generator){
    node.elements.forEach(child => generator.generate(child));
    generator.emitMakeArray(node.elements.length);
}

export function GenerateObjectExpression(node: ObjectExpression, generator: Generator){
    node.properties.forEach(child => generator.generate(child));
    generator.emitMakeObject(node.properties.length);
}

export function GenerateForStatement(node: ForStatement, generator: Generator){
    if(node.init) generator.generate(node.init);
    let pre_test_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    pre_test_label.setTarget();

    if(node.test) generator.generate(node.test);
    generator.emitJumpIfFalse()
    let skip_body_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    skip_body_label.setOrigin();

    if(node.body) generator.generate(node.body);
    if(node.update) generator.generate(node.update);

    generator.emitJMP();
    pre_test_label.setOrigin();
    skip_body_label.setTarget();
}

export function GenerateVariableDeclaration(node: VariableDeclaration, generator: Generator){
    node.declarations.forEach(child => generator.generate(child));
}

export function GenerateUnaryExpression(node: UnaryExpression, generator: Generator){
    generator.generate(node.argument);
    switch(node.operator){
        case "!":
            generator.emitNotSymbol();
            break;
        case "~":
            generator.emitNegateSymbol();
            break;
        default:
            throw("Unsuported unary expression: " + node.operator);
    }
}

export function GenerateUpdateExpression(node: UpdateExpression, generator: Generator){
    let argument = node.argument;
    switch(argument.type){
        case "Identifier": {
            let varid = generator.getVariableIndex(argument.name);
            switch(node.operator){
                case "++": {
                    if(varid === -1){
                        throw("Cant handle global++ yet");
                    }else{
                        generator.emitPlusPlus(varid);
                    }
                    break;
                }
                default:
                    throw("Unknown update statement");
            }

            break;
        }
        default:
            throw("Unknown update statement type");
    }
}

export function GenerateBinaryExpression(node: BinaryExpression, generator: Generator){
    generator.generate(node.left);
    generator.generate(node.right);
    switch(node.operator){
        case "<": {
            generator.emitLessThan();
            break;
        }
        case "<=": {
            generator.emitLessThanOrEqual();
            break;
        }
        case ">": {
            generator.emitGreaterThan();
            break;
        }
        case ">=": {
            generator.emitGreaterThanOrEqual();
            break;
        }
        case "==": {
            generator.emitEqualTo();
            break;
        }
        case "===": {
            generator.emitEqualToStrict();
            break;
        }
        case "!=": {
            generator.emitNotEqualTo();
            break;
        }
        case "!==": {
            generator.emitNotEqualTo();
            break;
        }
        case "**": {
            generator.emitRaiseExponent();
            break;
        }
        case ">>": {
            generator.emitBitRightShift();
            break;
        }
        case ">>>": {
            generator.emitBitZeroFillRightShift();
            break;
        }
        case "<<": {
            generator.emitBitLeftShift();
            break;
        }
        case "&": {
            generator.emitBitAnd();
            break;
        }
        case "|": {
            generator.emitBitOr();
            break;
        }
        case "^": {
            generator.emitBitXOR();
            break;
        }
        case "*": {
            generator.emitMultiply();
            break;
        }
        case "/": {
            generator.emitDivide();
            break;
        }
        case "-": {
            generator.emitSub();
            break;
        }
        case "+": {
            generator.emitAdd();
            break;
        }
        case "%": {
            generator.emitRemainder();
            break;
        }
        default:
            throw("Unknown binary operation: " + node.operator);
    }
}

export function GenerateBlockStatement(node: BlockStatement, generator: Generator){
   // if(generator.node === node){
        node.body.forEach(child => generator.generate(child));
        //generator.emitEND();
    //}else{
      //  let child = generator.child(node);
       // generator.emitJumpToBlock(child.id);
        //child.generate(child.node);
    //}
}

export function GenerateIfStatement(node: IfStatement, generator: Generator){
    generator.generate(node.test);

    generator.emitJumpIfFalse();
    const test_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    test_label.setOrigin();
    
    generator.generate(node.consequent);

    generator.emitJMP();
    let consequent_label = generator.makeLabel(Uint32Array.BYTES_PER_ELEMENT);
    consequent_label.setOrigin();
    
    test_label.setTarget();
    if(node.alternate) generator.generate(node.alternate);
    consequent_label.setTarget();
}

export function GenerateExpressionStatement(node: ExpressionStatement, generator: Generator){
    generator.generate(node.expression);
}

export function GenerateProgram(node: Program, generator: Generator){
    node.body.forEach(child => generator.generate(child));
    generator.emitEND();
}