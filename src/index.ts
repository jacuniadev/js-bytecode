import { compileByteCode } from "./Parserv2";
import { parse } from "acorn";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import { generate } from "escodegen";
import { minify } from "terser";
import { a } from "./InstructionFuncs";
import { Op, OpRemap, _Op } from "./Op";
import JavaScriptObfuscator from 'javascript-obfuscator';

let inputPath = path.join(__dirname, "../input/in.js");
let code = fs.readFileSync(inputPath, { encoding: "utf8" });

let { raw, base64, scopes } = compileByteCode(code);

scopes.forEach(scope => {
    //console.log(scope);
});

let templatePath = path.join(__dirname, "./EmulatorTemplate/");
let templateOutput = path.join(__dirname, "../out/");
let template = fs.readFileSync(path.join(templatePath, "/EmulatorTemplate.js"), { encoding: "utf-8" });
let ast = parse(template, { ecmaVersion: "latest" });

function makeLiteral(val) {
    return {
        type: "Literal",
        value: val,
        raw: JSON.stringify(val)
    };
}

function makeArray(aray) {
    return parse(JSON.stringify(aray), { ecmaVersion: "latest" });
}

let throwId = 0;
traverse(<any>ast, {
    enter(node, parent) {
        if (node.type === "VariableDeclarator") {
            let id = node.id;
            if (id.type === "Identifier" && id.name === "__program") {
                node.init = <any>makeLiteral(base64);
            } else if (id.type === "Identifier" && id.name === "__scopes") {
                node.init = <any>makeArray(scopes);
            } else if (id.type === "Identifier" && id.name === "__funcs") {
                let newAr = [];
                let descriptors = Object.getOwnPropertyDescriptors(Op);
                for (const key in descriptors) {
                    newAr[OpRemap[key]] = a[_Op[key]];
                }
                node.init = <any>parse(`[${newAr.toString()}]`, { ecmaVersion: "latest" });
            }
        }
        if (node.type === "ThrowStatement") {
            //node.argument = <any>makeLiteral(throwId++);
        }
        if (node.type === "Literal" && (node.value === "The block does not match up" || node.value === " is not a child scope of ")) {
            node.value = "c";
        }
    }
})

let output = generate(ast);
fs.writeFileSync(path.join(templateOutput, "out.js"), output);

async function writeMin() {
    var result = await minify(output, {
        sourceMap: true, mangle: {
            properties: true,
        }
    });

    //optimal settins
    const options = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        selfDefending: true,
        renameProperties: true,
        TRenamePropertiesMode: 'unsafe',
        TIdentifierNamesGenerator: 'mangled-shuffled',
    };

    let obfsCode = JavaScriptObfuscator.obfuscate(result.code, options).getObfuscatedCode();

    var finalMinCode = await minify(obfsCode, {
        sourceMap: true
    });

    fs.writeFileSync(path.join(templateOutput, "out.min.js"), finalMinCode.code);
}



writeMin();

console.log();
console.log("Evaluating JSBytecode");
console.log();
//Function(output)();
