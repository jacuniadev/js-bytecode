import { compileByteCode } from "./Parserv2";
import { parse } from "acorn";
import * as fs from "fs";
import * as path from "path";
import { traverse } from "estraverse";
import {generate} from "escodegen";
import { minify } from "terser";

let code = `
'use strict';

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }if (!value || !value.then) {
    value = Promise.resolve(value);
  }return then ? value.then(then) : value;
}


var myFetch = _async(function () {
    return _await(fetch('https://sploop.io/img/entity/wall.png'), function (response) {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      return _await(response.blob());
    });
  });
  

function _async(f) {
    return function () {
      for (var args = [], i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }


myFetch().then(function (blob) {
  var objectURL = URL.createObjectURL(blob);
  var image = document.createElement('img');
  image.src = objectURL;
  document.body.appendChild(image);
}).catch(function (e) {
  return console.log(e);
});

`
let {raw, base64, scopes} = compileByteCode(code);

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

//Function(output)();

writeMin();