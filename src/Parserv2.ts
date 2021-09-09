
import {parse} from "acorn";
import { traverse } from "estraverse";
import { GenerateArrayExpression, GenerateAssignmentExpression, GenerateBinaryExpression, GenerateBlockStatement, GenerateBreakStatement, GenerateByteCode, GenerateCallExpression, GenerateConditionalExpression, GenerateDebuggerStatement, GenerateExpressionStatement, GenerateForStatement, GenerateFunctionDeclaration, GenerateFunctionExpression, GenerateIdentifier, GenerateIfStatement, GenerateLiteral, GenerateLogicalExpression, GenerateMemberExpression, GenerateNewExpression, GenerateObjectExpression, GenerateProgram, GenerateProperty, GenerateReturnStatement, GenerateSequenceExpression, GenerateSwitchStatement, GenerateThisExpression, GenerateThrowStatement, GenerateTryStatement, GenerateUnaryExpression, GenerateUpdateExpression, GenerateVariableDeclaration, GenerateVariableDeclarator, GenerateWhileStatement } from "./ASTCodegen";
import { Label } from "./Label";
import { Strings } from "./Strings";
import { BlockStatement, ThrowStatement, SequenceExpression, ConditionalExpression, TryStatement, BreakStatement, SwitchStatement, LogicalExpression, NewExpression, DebuggerStatement, ArrayExpression, ThisExpression, FunctionExpression, Property, MemberExpression, ForStatement, ObjectExpression, UnaryExpression, UpdateExpression, ReturnStatement, CallExpression, FunctionDeclaration, Identifier, AssignmentExpression, VariableDeclaration, WhileStatement, BinaryExpression, Literal, Node, VariableDeclarator, IfStatement, Program, ExpressionStatement } from "estree";


type Definition = {
    localId: number;
}

type Reference = {
    localId: number;
    foreignId: number;
}

export class Scope{
    static id = 1;
    public id = Scope.id++;
    public childNodes = [];
    public parent: Scope;
    public node: Node;
    public strings: Strings;
    public offset = 0;
    public _buffer = new ArrayBuffer(65535);
    public data = new Uint8Array(this._buffer);

    public labels: Array<Label> = [];

    public reference_set: Map<string, Reference> = new Map();
    public definition_set: Map<string, Definition> = new Map();
    public function_set: Map<string, FunctionDeclaration> = new Map();

    constructor(node: Node, parent: Scope | null = null){
        
        this.parent = parent;
        this.node = node;

        //every node will share the same string object
        if(!this.parent){
            this.strings = new Strings(this);
        }else{
            this.strings = this.parent.strings;

            parent.reference_set.forEach((ref, name) => {
                this.addReference(name, ref.localId);
            });
            parent.definition_set.forEach((def, name) => {
                this.addReference(name, def.localId);
            });
        }

        this.parseScope();
    }

    parseScope(){
        this.traverse(this.node);
        this.cleanUp();
    }

    cleanUp(){
        let _id = 0;
        this.definition_set.forEach((def, name) => {
            def.localId = _id++;
        })
        this.reference_set.forEach((ref, name) => {
            ref.localId = _id++;
        })
    }

    //begin new methods
    addReference(name: string, foreignId: number): void{
        let reference: Reference = {localId: null, foreignId: foreignId};
        this.reference_set.set(name, reference);
    }

    addDefinition(name: string): void{
        let definition: Definition = {localId: null};
        this.definition_set.set(name, definition);
    }

    getVarId(name): number{
        if(this.definition_set.has(name)) return this.definition_set.get(name).localId;
        if(this.reference_set.has(name)) return this.reference_set.get(name).localId;
        return -1;
    }

    varDeclaration(name: string){
        //rules
        //will remove any reference to that variable name
        if(this.definition_set.has(name)) return;
        if(this.reference_set.has(name)) this.reference_set.delete(name);
        this.addDefinition(name);
    }

    functionExpression(node: FunctionExpression){
        if(node === this.node){
           
            //add the arguments definition
            let name = "arguments";
            if(this.definition_set.has(name)) return;
            if(this.reference_set.has(name)) this.reference_set.delete(name);
            this.addDefinition(name);

            node.params.forEach(param => {
                if(param.type !== "Identifier") throw("Ivalid parameter type");
                let name = param.name;
                if(this.definition_set.has(name)) return;
                if(this.reference_set.has(name)) this.reference_set.delete(name);
                this.addDefinition(name);
            })
            this.traverse(node.body);
            
            return;
        }
    }

    functionDeclaration(node: FunctionDeclaration){
        if(node === this.node){
            let name = "arguments";
            if(this.definition_set.has(name)) return;
            if(this.reference_set.has(name)) this.reference_set.delete(name);
            this.addDefinition(name);

            node.params.forEach(param => {
                if(param.type !== "Identifier") throw("Ivalid parameter type");
                let name = param.name;
                if(this.definition_set.has(name)) return;
                if(this.reference_set.has(name)) this.reference_set.delete(name);
                this.addDefinition(name);
            })
            this.traverse(node.body);
            
            return;
        }
        //if the var has not been defined as a var
        let name = node.id.name;
        if(this.definition_set.has(name)) return; //functions get overriden by this
        if(this.reference_set.has(name)) this.reference_set.delete(name);
        this.addDefinition(name);
        this.function_set.set(name, node);
    }

    traverse(node){
        let scope = this;
        // need to scan all the for all variables defined with var
        traverse(node, {
            enter(node){
                switch(node.type){
                    case "VariableDeclarator": {
                        if(node.id.type !== "Identifier") throw new Error("Scope.js");
                        scope.varDeclaration(node.id.name);
                        break;
                    }
                    case "FunctionDeclaration": {
                        scope.functionDeclaration(node);
                        return this.skip();
                    }
                    case "FunctionExpression": {
                        scope.functionExpression(node);
                        return this.skip();
                    }
                }
            }
        })
    }
    
    getStringId(str: string): number{
        return this.strings.get(str);
    }

    makeLabel(byteLength: number): Label{
        let label = new Label(this, byteLength);
        this.labels.push(label);
        return label;
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
                //GenerateFunctionDeclaration(node, this);
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
        GenerateByteCode(this.node, this);
        
        let scopes = [];

        let {rawStringdata, stringScope} = this.strings.getData();
        scopes.push(stringScope);

        forEveryParser(this, (scope: Scope)=>{
            let id = scope.id;
            let parentId = scope.parent ? scope.parent.id : 0;
            let totalDefinitions = scope.definition_set.size + scope.reference_set.size;

      //      console.log("************" + scope.id +"**************");
      //      console.log(scope.definition_set);
      //      console.log(scope.reference_set);
      //      console.log("---")

            let inheretedDefinitions = [];
            scope.reference_set.forEach(ref => {
                inheretedDefinitions.push([ ref.localId, ref.foreignId ]);
            });

            //sum up all byte offset of the start of the scope
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
            buffer.push(...<any>bytes);
        })

        buffer.push(...<any>rawStringdata);
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
    let ast = parse(code, {ecmaVersion: 5});
    let topScope = new Scope(<Node>ast);
    
    let {raw, scopes} = topScope.build();
    
    return {
        raw,
        base64: Buffer.from(raw).toString("base64"),
        scopes
    };
}