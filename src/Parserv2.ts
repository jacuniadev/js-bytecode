
import {parse} from "acorn";
import { traverse } from "estraverse";
import { Literal, Node } from "estree";
import { GenerateArrayExpression, GenerateAssignmentExpression, GenerateBinaryExpression, GenerateBlockStatement, GenerateBreakStatement, GenerateCallExpression, GenerateConditionalExpression, GenerateDebuggerStatement, GenerateExpressionStatement, GenerateForStatement, GenerateFunctionDeclaration, GenerateFunctionExpression, GenerateIdentifier, GenerateIfStatement, GenerateLiteral, GenerateLogicalExpression, GenerateMemberExpression, GenerateNewExpression, GenerateObjectExpression, GenerateProgram, GenerateProperty, GenerateReturnStatement, GenerateSequenceExpression, GenerateSwitchStatement, GenerateThisExpression, GenerateThrowStatement, GenerateTryStatement, GenerateUnaryExpression, GenerateUpdateExpression, GenerateVariableDeclaration, GenerateVariableDeclarator, GenerateWhileStatement } from "./ASTCodegen";
import { Label } from "./Label";
import { Strings } from "./Strings";

export class Scope{
    static id = 1;
    public id = Scope.id++;
    public childNodes = [];
    public parent: Scope;
    public node: Node;
    public varId = 0;
    public strings: Strings;
    public offset = 0;
    public _buffer = new ArrayBuffer(65535);
    public data = new Uint8Array(this._buffer);
    public labels: Array<Label> = [];

    public variables = [];
    public set: {[key: string]: number} = {};

    public inheretedVariables = [];
    public inheretedSet: {[key: string]: number} = {};

    constructor(node: Node, parent: Scope | null = null){
        this.parent = parent;

        //every node will share the same string object
        if(!this.parent){
            this.strings = new Strings(this);
        }else{
            this.strings = this.parent.strings;
        }

        this.node = node;
        this.findVariables();
    }

    getStringId(str: string): number{
        return this.strings.get(str);
    }

    getVariableId(name: string): number{
        if(this.set.hasOwnProperty(name)) return this.set[name];
        return -1;
    }

    copyInheretedIntoLocal(){
        for(const key in this.inheretedSet){
            let parentVariableId = this.inheretedSet[key];
            if(parentVariableId === -1) {
                this.strings.add(key);
                continue;
            };
            //if its been declared anyways, use that id
            if(this.set.hasOwnProperty(key)){
                let localVariableId = this.set[key];
                this.inheretedVariables.push([localVariableId, parentVariableId])
            }else{
                let localVariableId = this.varId++;
                this.set[key] = localVariableId;
                this.inheretedVariables.push([localVariableId, parentVariableId]);
                this.variables[localVariableId] = localVariableId;
            }
        }
    }

    _getVariable(name: string): number {
        if(this.set.hasOwnProperty(name)) return this.set[name];
        if(this.parent) return this.parent._getVariable(name);
        return -1; //if its a global property happen
    }

    addInheretedVar(name: string): void{
        if(this.inheretedSet[name]) return; //no need to go looking if we have already found it 
        if(this.parent){
            let variableId = this.parent._getVariable(name); 
            this.inheretedSet[name] = variableId;
        }else{
            let variableId = -1;
            this.inheretedSet[name] = variableId;
        }
    }

    addLocalVar(name: string){
        let id = this.varId++;
        this.set[name] = id;
        this.variables[id] = id;
    }

    makeLabel(byteLength: number): Label{
        let label = new Label(this, byteLength);
        this.labels.push(label);
        return label;
    }

    findVariables(){
        let scope = this;
        traverse(scope.node, {
            enter(node, parent){

                //little hack, try to float all functions to the top to prevent them from being called before being defined
                if(node.type === "Program"){
                    var first = "FunctionDeclaration";
                    node.body.sort(function(x,y){ return x.type == first ? -1 : y.type == first ? 1 : 0; });
                }

                if(node.type === "FunctionDeclaration" && node !== scope.node){
                    scope.addLocalVar(node.id.name);
                    return this.skip();
                }

                if(node.type === "Literal" && typeof(node.value) === "string"){
                    return scope.strings.add(node.value);
                }

                if(node.type === "MemberExpression" && !node.computed && node.property.type === "Identifier"){
                    node.property = <Literal>{
                        type: "Literal",
                        value: node.property.name,
                        raw: JSON.stringify(node.property.name)
                    };
                    return;
                }

                if(node.type === "Identifier"){
                    if(parent.type === "VariableDeclarator"){
                        scope.addLocalVar(node.name);
                        return;
                    }else if(parent.type === "FunctionDeclaration" || parent.type === "FunctionExpression"){
                        if(parent.params.indexOf(node) !== -1){
                            scope.addLocalVar(node.name);
                            return;
                        }
                    }
                    //its not local
                    return scope.addInheretedVar(node.name);
                }
            }
        });
        this.copyInheretedIntoLocal();
    }

    makeChild(node: Node): Scope{
        let scope = new Scope(node, this);
        this.childNodes.push(scope);
        return scope;
    }

   
    generate(node: Node){
        switch(node.type){
            case "Literal":
                GenerateLiteral(node, this);
                break;
            case "Program":
                GenerateProgram(node, this);
                break;
            case "ExpressionStatement":
                GenerateExpressionStatement(node, this);
                break;
            case "IfStatement":
                GenerateIfStatement(node, this);
                break;
            case "BlockStatement":
                GenerateBlockStatement(node, this);
                break;
            case "ConditionalExpression":
                GenerateConditionalExpression(node, this);
                break;
            case "TryStatement":
                GenerateTryStatement(node, this);
                break;
            case "BinaryExpression":
                GenerateBinaryExpression(node, this);
                break;
            case "WhileStatement":
                GenerateWhileStatement(node, this);
                break;
            case "VariableDeclaration":
                GenerateVariableDeclaration(node, this);
                break;
            case "Identifier":
                GenerateIdentifier(node, this);
                break;
            case "AssignmentExpression":
                GenerateAssignmentExpression(node, this);
                break;
            case "VariableDeclarator":
                GenerateVariableDeclarator(node, this);
                break;
            case "FunctionDeclaration":
                GenerateFunctionDeclaration(node, this);
                break;
            case "CallExpression":
                GenerateCallExpression(node, this);
                break;
            case "DebuggerStatement":
                GenerateDebuggerStatement(node, this);
                break;
            case "ArrayExpression":
                GenerateArrayExpression(node, this);
                break;
            case "FunctionExpression":
                GenerateFunctionExpression(node, this);
                break;
            case "ThisExpression": 
                GenerateThisExpression(node, this);
                break
            case "ReturnStatement":
                GenerateReturnStatement(node, this);
                break;
            case "UpdateExpression":
                GenerateUpdateExpression(node, this);
                break;
            case "ForStatement":
                GenerateForStatement(node, this);
                break;
            case "SwitchStatement":
                GenerateSwitchStatement(node, this);
                break;
            case "BreakStatement":
                GenerateBreakStatement(node, this);
                break;
            case "ObjectExpression":
                GenerateObjectExpression(node, this);
                break;
            case "MemberExpression":
                GenerateMemberExpression(node, this);
                break;
            case "SequenceExpression":
                GenerateSequenceExpression(node, this);
                break;
            case "ThrowStatement":
                GenerateThrowStatement(node, this);
                break;
            case "NewExpression":
                GenerateNewExpression(node, this);
                break;
            case "UnaryExpression":
                GenerateUnaryExpression(node, this);
                break;
            case "Property":
                GenerateProperty(node, this);
                break;
            case "LogicalExpression":
                GenerateLogicalExpression(node, this);
                break;
            case "EmptyStatement":
                break;
            default:
                throw("Unknown node type: " + node.type);
        }
    }

    build(): {
        scopes: Array<any>,
        raw: Uint8Array
    }{
        this.generate(this.node);
        
        let scopes = [];

        let {rawStringdata, stringScope} = this.strings.getData();
        scopes.push(stringScope);

        forEveryParser(this, (scope: Scope)=>{
            let id = scope.id;
            let parentId = scope.parent ? scope.parent.id : 0;
            let totalDefinitions = scope.variables.length;
            let inheretedDefinitions = scope.inheretedVariables;
            let offset = 0;

            forEveryParser(this, (_scope: Scope)=>{
                if(_scope.id < scope.id) offset += _scope.offset;
            });

            scopes.push([id, parentId, totalDefinitions, inheretedDefinitions, offset]);
        })

        let buffer = [];
        forEveryParser(this, (scope: Scope)=>{

            scope.labels.forEach(label => {
                if(label.destination !== null){
                    label.destination += scopes[scope.id][4];
                    label.writeI32(label.destination);
                }
            })

            let bytes = new Uint8Array(scope._buffer, 0, scope.offset).slice();
            buffer.push(...bytes);
        })

        buffer.push(...rawStringdata);
        let raw = new Uint8Array(buffer);

        return {
            scopes,
            raw
        };
    }
}

export function forEveryParser(topScope: Scope, callback: Function){
    callback(topScope);
    topScope.childNodes.forEach(child => forEveryParser(child, callback));
}

export function compileByteCode(code: string){
    let ast = parse(code, {ecmaVersion: 2015});
    let topScope = new Scope(<Node>ast);
    
    let {raw, scopes} = topScope.build();
    
    return {
        raw,
        base64: Buffer.from(raw).toString("base64"),
        scopes
    };
}