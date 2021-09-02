import { compileByteCode } from "./Parserv2";
import { parse } from "acorn";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { minify } from "terser";


let code = `
let setSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
        Object.defineProperty(Image.prototype, "src", {
            set() {
                setSrc.apply(this, ["https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"]);
            },
        });
`
let {raw, base64, scopes} = compileByteCode(code);
console.log(base64);
console.log(raw);

scopes.forEach(scope => {
    console.log(scope);
});

let templatePath = path.join(__dirname, "../dist/");
let templateOutput = path.join(__dirname, "../output/");
let template = fs.readFileSync(path.join(templatePath, "/index.js"), {encoding: "utf-8"});
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
            node.argument = <any>makeLiteral(throwId++);
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