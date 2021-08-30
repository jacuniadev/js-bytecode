import { traverse } from "estraverse";
import { BlockStatement, Identifier, Literal, Node, VariableDeclarator, IfStatement } from "estree";
import { GenerateArrayExpression, GenerateAssignmentExpression, GenerateBinaryExpression, GenerateBlockStatement, GenerateCallExpression, GenerateDebuggerStatement, GenerateExpressionStatement, GenerateForStatement, GenerateFunctionDeclaration, GenerateFunctionExpression, GenerateIdentifier, GenerateIfStatement, GenerateLiteral, GenerateMemberExpression, GenerateNewExpression, GenerateObjectExpression, GenerateProgram, GenerateProperty, GenerateReturnStatement, GenerateThisExpression, GenerateUpdateExpression, GenerateVariableDeclaration, GenerateVariableDeclarator, GenerateWhileStatement } from "./ASTCodegen";
import { Label } from "./Label";
import { Op } from "./Op";
import { f64Bytes, i32Bytes, i8Bytes, isValidI32, isValidI8 } from "./Utils";

class StringManager{
    buffer: Array<number> = [];
    set: Map<string, number> = new Map();

    scope(sizeOfProgram: number){
        return [0, -1, 0, [], sizeOfProgram];
    }

    getData(){
        this.buffer.push(Op.JumpToBlock);
        this.buffer.push(1); //jump to 0
        this.buffer.push(0);
        this.buffer.push(0);
        this.buffer.push(0);
        this.buffer.push(Op.END);
        return new Uint8Array(this.buffer);
    }

    add(str: string): number{
        if(!this.set.has(str)){
            let id = this.set.size;
            this.set.set(str, id);
            this.buffer.push(Op.RegisterString);
            this.buffer.push(str.length);
            for(let i = 0 ; i < str.length; i++){
                this.buffer.push(str.charCodeAt(i));
            }
            return id;
        }else{
            return this.set.get(str);
        }
    }
}

let sm = new StringManager();

export class Generator{
    static id = 1; //start id at 1 because the strings loader will be scope 0
    public id = Generator.id++;
    public node: Node;
    public parent: Generator;
    public children: Array<Generator> = [];
    public labels: Array<Label> = [];
    public offset: number = 0;
    public _buffer = new ArrayBuffer(65535);
    public data = new Uint8Array(this._buffer);
    public set: Map<string, number> = new Map();
    public declarations: Array<Array<any>> = [];
    public stringManager: StringManager = sm;
    

    getVariableIndex(name: string): number{
        if(!this.set.has(name)) return -1;
        return this.set.get(name);
    }

    declareVariable(name: string): number{
        if(!this.set.has(name)){
            let id = this.declarations.length;
            let data = [this.id, id];
            this.declarations[id] = data;
            this.set.set(name, id);
            return id;
        }else{
            let id = this.set.get(name)
            let data = this.declarations[id];
            data[0] = this.id;
            return id
        }
    }

    constructor(node: Node){
        this.node = node;
    }

    __writeI8(n: number){
        let i8 = i8Bytes(n);
        this.data[this.offset++] = i8;
    }

    __writeI32(n: number){
        let i32 = i32Bytes(n);
        this.data[this.offset++] = i32[0];
        this.data[this.offset++] = i32[1];
        this.data[this.offset++] = i32[2];
        this.data[this.offset++] = i32[3];
    }

    __writeF64(n: number){
        let f64 = f64Bytes(n);
        this.data[this.offset++] = f64[0];
        this.data[this.offset++] = f64[1];
        this.data[this.offset++] = f64[2];
        this.data[this.offset++] = f64[3];
        this.data[this.offset++] = f64[4];
        this.data[this.offset++] = f64[5];
        this.data[this.offset++] = f64[6];
        this.data[this.offset++] = f64[7];
    }

    emitMakeArray(nodes: number){
        this.__writeI8(Op.MakeArray);
        this.__writeI32(nodes);
    }

    emitThis(){
        this.__writeI8(Op.This);
    }

    emitDebugger(){
        this.__writeI8(Op.Debugger);
    }

    emitSetObjectProperty(){
        this.__writeI8(Op.SetObjectProperty);
    }

    emitGetObjectProperty(){
        this.__writeI8(Op.GetObjectProperty);
    }

    emitGetGlobalVariableValue(){
        this.__writeI8(Op.GetGlobalVariableValue);
    }
    
    emitAssignValueToGlobal(){
        this.__writeI8(Op.AssignValueToGlobal);
    }

    emitGetVariableValue(varid: number){
        this.__writeI8(Op.GetVariableValue);
        this.__writeI32(varid);
    }

    emitString(stringid){
        this.__writeI8(Op.String);
        this.__writeI32(stringid);
    }

    emitEND(){
        this.__writeI8(Op.END);
    }

    emitReturn(){
        this.__writeI8(Op.ReturnValue);
    }

    emitJMP(){
        this.__writeI8(Op.Jump);
    }

    emitJumpIfFalse() {
        this.__writeI8(Op.JumpIfFalse);
    }

    emitLessThan(){
        this.__writeI8(Op.LessThan);
    }

    emitLessThanOrEqual(){
        this.__writeI8(Op.LessThanOrEqual);
    }

    emitEqualTo(){
        this.__writeI8(Op.EqualTo);
    }

    emitEqualToStrict(){
        this.__writeI8(Op.EqualToStrict);
    }

    emitNotEqualTo(){
        this.__writeI8(Op.NotEqualTo);
    }

    emitNotEqualToStrict(){
        this.__writeI8(Op.NotEqualToStrict);
    }

    emitGreaterThan(){
        this.__writeI8(Op.GreaterThan);
    }

    emitGreaterThanOrEqual(){
        this.__writeI8(Op.GreaterThanOrEqual);
    }

    emitAdd(){
        this.__writeI8(Op.Add);
    }

    emitSub(){
        this.__writeI8(Op.Sub);
    }

    emitDivide(){
        this.__writeI8(Op.Divide);
    }

    emitMultiply(){
        this.__writeI8(Op.Multiply);
    }

    emitRemainder(){
        this.__writeI8(Op.Remainder);
    }

    emitBitAnd(){
        this.__writeI8(Op.BitAnd);
    }

    emitBitOr(){
        this.__writeI8(Op.BitOr);
    }

    emitBitXOR(){
        this.__writeI8(Op.BitXOR);
    }

    emitBitLeftShift(){
        this.__writeI8(Op.BitLeftShift);
    }

    emitBitRightShift(){
        this.__writeI8(Op.BitRightShift);
    }

    emitBitZeroFillRightShift(){
        this.__writeI8(Op.BitZeroFillRightShift);
    }

    emitRaiseExponent(){
        this.__writeI8(Op.RaiseExponent);
    }

    emitI8(n: number){
        this.__writeI8(Op.I8);
        this.__writeI8(n);
    }

    emitNewExpression(totalArgs: number){
        this.__writeI8(Op.New);
        this.__writeI32(totalArgs);
    }

    emitJumpToBlock(n: number){
        this.__writeI8(Op.JumpToBlock);
        this.__writeI32(n);
    }

    emitI32(n: number){
        this.__writeI8(Op.I32);
        this.__writeI32(n);
    }

    emitF64(n: number){
        this.__writeI8(Op.I32);
        this.__writeF64(n);
    }

    emitAssignValue(varid: number){
        this.__writeI8(Op.AssignValue);
        this.__writeI32(varid);
    }

    emitCreateFunction(blockid: number){
        this.__writeI8(Op.CreateFunction);
        this.__writeI32(blockid);
    }

    emitGetArguments(index: number){
        this.__writeI8(Op.GetArguments);
        this.__writeI8(index);
    }

    emitBOOL(bool: boolean){
        this.__writeI8(Op.BOOL);
        this.__writeI8(+bool);
    }

    emitMakeObject(props: number){
        this.__writeI8(Op.MakeObject);
        this.__writeI32(props);
    }

    emitObjectPropertyCall(totalArgs){
        this.__writeI8(Op.ObjectPropertyCall);
        this.__writeI8(totalArgs);
    }

    emitCall(totalArgs){
        this.__writeI8(Op.Call);
        this.__writeI8(totalArgs);
    }

    loadNumber(num){
        if(isValidI8(num)) this.emitI8(num);
        else if(isValidI32(num)) this.emitI32(num);
        else this.emitF64(num);
    }

    child(node: Node): Generator{
        let child: Generator = new Generator(node);
        child.set = new Map(this.set);
        child.declarations = JSON.parse(JSON.stringify(this.declarations));
        child.parent = this;
        this.children.push(child);
        return child;
    }

    makeLabel(byteLength: number): Label{
        let label = new Label(this, byteLength);
        this.labels.push(label);
        return label;
    }

    getGeneratorOffset(generator: Generator){
        let total = 0;
        if(generator.parent){
            let parent = generator.parent;
            let index = parent.children.indexOf(generator);
            for(let i = 0 ; i < index; i++) total += parent.children[i].offset;
            total += parent.offset;
            total += this.getGeneratorOffset(generator.parent);
    
        }
        return total
    }

    _getData(ar: Array<number>){
        //set all the label destinations
        this.labels.forEach(label => {
            if(label.destination !== null){
                label.destination += this.getGeneratorOffset(this);
                label.writeI32(label.destination);
            }
        })
        let data = new Uint8Array(this._buffer, 0, this.offset);
        ar.push(...data);
        this.children.forEach(child => child._getData(ar));
    }

    figureOutScope(){
        //find all variables defined in a scopet
        let that = this;
        traverse(this.node, {
            enter(node){
                if(node.type === "VariableDeclarator"){
                    let id = node.id;
                    if(id.type === "Identifier"){
                        console.log("Declared", id.name);
                        that.declareVariable(id.name);
                    }
                }else if(node.type === "FunctionDeclaration"){
                    let id = node.id;
                    if(id.type === "Identifier"){
                        console.log("Declared", id.name);
                        that.declareVariable(id.name);
                    }
                }
            }
        })
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
            case "ObjectExpression":
                GenerateObjectExpression(node, this);
                break;
            case "MemberExpression":
                GenerateMemberExpression(node, this);
                break;
            case "NewExpression":
                GenerateNewExpression(node, this);
                break;
            case "Property":
                GenerateProperty(node, this);
                break;
            case "EmptyStatement":
                break;
            default:
                throw("Unknown node type: " + node.type);
        }
    }

    build(): Uint8Array{


        this.children = [];
        this.declarations = [];
        this.set = new Map();

        this.figureOutScope();

        this.generate(this.node);
        let data = [];
        this._getData(data); //recursivly add the children's data into this
        return new Uint8Array(data);
    }
}