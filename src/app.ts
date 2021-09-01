import { compileByteCode } from "./Parserv2";
import { parse } from "acorn";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { minify } from "terser";


let code = `
window.MurmurHash3 = {
    mul32: function(m, n) {
        var nlo = n & 0xffff;
        var nhi = n - nlo;
        return ((nhi * m | 0) + (nlo * m | 0)) | 0;
    },

    hashBytes: function(data, len, seed) {
        var c1 = 0xcc9e2d51, c2 = 0x1b873593;

        var h1 = seed;
        var roundedEnd = len & ~0x3;

        for (var i = 0; i < roundedEnd; i += 4) {
            var k1 = (data.charCodeAt(i)     & 0xff)        |
                ((data.charCodeAt(i + 1) & 0xff) << 8)  |
                ((data.charCodeAt(i + 2) & 0xff) << 16) |
                ((data.charCodeAt(i + 3) & 0xff) << 24);

            k1 = this.mul32(k1, c1);
            k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
            k1 = this.mul32(k1, c2);

            h1 ^= k1;
            h1 = ((h1 & 0x7ffff) << 13) | (h1 >>> 19);  // ROTL32(h1,13);
            h1 = (h1 * 5 + 0xe6546b64) | 0;
        }

        k1 = 0;

        switch(len % 4) {
            case 3:
                k1 = (data.charCodeAt(roundedEnd + 2) & 0xff) << 16;
                // fallthrough
            case 2:
                k1 |= (data.charCodeAt(roundedEnd + 1) & 0xff) << 8;
                // fallthrough
            case 1:
                k1 |= (data.charCodeAt(roundedEnd) & 0xff);
                k1 = this.mul32(k1, c1);
                k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
                k1 = this.mul32(k1, c2);
                h1 ^= k1;
        }

        // finalization
        h1 ^= len;

        // fmix(h1);
        h1 ^= h1 >>> 16;
        h1  = this.mul32(h1, 0x85ebca6b);
        h1 ^= h1 >>> 13;
        h1  = this.mul32(h1, 0xc2b2ae35);
        h1 ^= h1 >>> 16;

        return h1;
    },

    hashString: function(data, len, seed) {
        var c1 = 0xcc9e2d51, c2 = 0x1b873593;

        var h1 = seed;
        var roundedEnd = len & ~0x1;

        for (var i = 0; i < roundedEnd; i += 2) {
            var k1 = data.charCodeAt(i) | (data.charCodeAt(i + 1) << 16);

            k1 = this.mul32(k1, c1);
            k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
            k1 = this.mul32(k1, c2);

            h1 ^= k1;
            h1 = ((h1 & 0x7ffff) << 13) | (h1 >>> 19);  // ROTL32(h1,13);
            h1 = (h1 * 5 + 0xe6546b64) | 0;
        }

        if((len % 2) == 1) {
            k1 = data.charCodeAt(roundedEnd);
            k1 = this.mul32(k1, c1);
            k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
            k1 = this.mul32(k1, c2);
            h1 ^= k1;
        }

        // finalization
        h1 ^= (len << 1);

        // fmix(h1);
        h1 ^= h1 >>> 16;
        h1  = this.mul32(h1, 0x85ebca6b);
        h1 ^= h1 >>> 13;
        h1  = this.mul32(h1, 0xc2b2ae35);
        h1 ^= h1 >>> 16;

        return h1;
    }
};
console.log(MurmurHash3.hashString("awdwadawd", 10, "awd"));

`
let {raw, base64, scopes} = compileByteCode(code);
console.log(base64);
console.log(raw);

scopes.forEach(scope => {
    console.log(scope);
});

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
fs.writeFileSync(path.join(templatePath, "out.js"), output);

async function writeMin(){
    var result = await minify(output, { sourceMap: true });
    fs.writeFileSync(path.join(templatePath, "out.min.js"), result.code);
}

//Function(output)();

writeMin();