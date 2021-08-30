import { parse } from "acorn";
//import { Block, setBytes, setScopes } from "./Emulator/Block";
//import { Generator } from "./Generator";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { Generator } from "./Generator";

export function getShit(code: string){
    let ast = <any>parse(code, {ecmaVersion: 5});

    function extractScopes(arr: Array<any>, generator: Generator){

        //have a look at what came from the parent
        let parentDeclaration = [];
        
        let declarations = generator.declarations;
        for(let i = 0; i < declarations.length; i++){
            let data = declarations[i];
            if(data[0] !== generator.id) {
                data[0] = data[1] //FIXME: remove this line
                parentDeclaration.push(data);
            }
        }

        arr.push([generator.id, generator.parent ? generator.parent.id : 0, generator.declarations.length, parentDeclaration, generator.getGeneratorOffset(generator)]);
        generator.children.forEach(child => extractScopes(arr, child));
    }

    let generator = new Generator(ast);
    let data = generator.build();

    let scopes = [];
    extractScopes(scopes, generator);
    scopes.unshift(generator.stringManager.scope(data.byteLength));
    data = new Uint8Array([...data, ...generator.stringManager.getData()]);

    //scopes.forEach(scope => console.log(scope));
    return [Buffer.from(data).toString("base64"), scopes];
}