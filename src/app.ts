import { parse } from "acorn";
//import { Block, setBytes, setScopes } from "./Emulator/Block";
//import { Generator } from "./Generator";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { getShit } from "./getShit";
import { minify } from "terser";
import { Debugger } from "./Debugger";

let templatePath = path.join(__dirname, "../dist/");
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

let [program, scopes] = getShit(`
function test(){
    this.log = function(){
        console.log(this, "helloworld");
    }
}
var a = new test();
console.log(a.log());
`);

let de = new Debugger();
de.debug(new Uint8Array(Buffer.from(<string>program, "base64")));
console.log(de.data);
//de.debug());

let throwId = 0;
traverse(<any>ast, {
    enter(node, parent){
        if(node.type === "VariableDeclarator"){
            let id = node.id;
            if(id.type === "Identifier" && id.name === "__program"){
                node.init = <any>makeLiteral(program);
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
fs.writeFileSync(path.join(templatePath, "out.js"), output);

async function writeMin(){
    var result = await minify(output, { sourceMap: true });
    fs.writeFileSync(path.join(templatePath, "out.min.js"), result.code);
}

Function(output)();

writeMin();