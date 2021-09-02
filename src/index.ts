import { compileByteCode } from "./Parserv2";
import { parse } from "acorn";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { minify } from "terser";

let inputPath = path.join(__dirname, "../input/in.js");
let code = fs.readFileSync(inputPath, {encoding: "utf8"});

let {raw, base64, scopes} = compileByteCode(code);

scopes.forEach(scope => {
    console.log(scope);
});

let templatePath = path.join(__dirname, "./EmulatorTemplate/");
let templateOutput = path.join(__dirname, "../out/");
let template = fs.readFileSync(path.join(templatePath, "/EmulatorTemplate.js"), {encoding: "utf-8"});
let ast = parse(template, {ecmaVersion: "latest"});

function makeLiteral(val){
    return {
        type: "Literal",
        value: val,
        raw: JSON.stringify(val)
    };
}

function makeArray(aray){
    return parse(JSON.stringify(aray), {ecmaVersion: "latest"});
}

let throwId = 0;
traverse(<any>ast, {
    enter(node, parent){
        if(node.type === "VariableDeclarator"){
            let id = node.id;
            if(id.type === "Identifier" && id.name === "__program"){
                node.init = <any>makeLiteral(base64);
            }else if(id.type === "Identifier" && id.name === "__scopes"){
                node.init = <any>makeArray(scopes);
            }
        }
        if(node.type === "ThrowStatement"){
            //node.argument = <any>makeLiteral(throwId++);
        }
    }
})

let output = generate(ast);
fs.writeFileSync(path.join(templateOutput, "out.js"), output);

async function writeMin(){
    var result = await minify(output, { sourceMap: true });
    fs.writeFileSync(path.join(templateOutput, "out.min.js"), result.code);
}

Function(output)();

writeMin();