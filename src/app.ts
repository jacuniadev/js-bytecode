import { parse } from "acorn";
//import { Block, setBytes, setScopes } from "./Emulator/Block";
//import { Generator } from "./Generator";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { getShit } from "./getShit";
import { minify } from "terser";

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

window.rc4Encrypt = function(key, pt) {
    var s = new Array();
    for (var i = 0; i < 256; i = i + 1) {
        s[i] = i;
    }
    var j = 0;
    var x;
    for (i = 0; i < 256; i = i + 1) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 255;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = 0;
    j = 0;
    var ct = '';
    for (var y = 0; y < pt.length; y = y + 1) {
        i = (i + 1) % 255;
        j = (j + s[i]) % 255;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        ct = ct + String.fromCharCode(pt.charCodeAt(y) ^ s[(s[i] + s[j]) % 255]);
    }
    return ct;
};
`);

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
            node.argument = <any>makeLiteral(throwId++);
        }
    }
})

let output = generate(ast);
fs.writeFileSync(path.join(templatePath, "out.js"), output);

async function writeMin(){
    var result = await minify(output, { sourceMap: true });
    fs.writeFileSync(path.join(templatePath, "out.min.js"), result.code);
}

writeMin();