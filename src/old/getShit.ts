import { parse } from "acorn";
import { Generator } from "./Generator";

export function getShit(code: string){
    let ast = <any>parse(code, {ecmaVersion: 5});

    let generator = new Generator(ast);
    let topGenerator = generator;

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

        let offset = 0;
        forEveryGenerator(topGenerator, (gen)=>{
            if(gen.id < generator.id) offset += gen.offset;
        })

        arr.push([generator.id, generator.parent ? generator.parent.id : 0, generator.declarations.length, parentDeclaration, offset]);
        generator.children.forEach(child => extractScopes(arr, child));
    }

    //let generator = new Generator(ast);
    let data = generator.build();

    let scopes = [];
    extractScopes(scopes, generator);
    scopes.unshift(generator.stringManager.scope(data.byteLength));
    data = new Uint8Array([...data, ...generator.stringManager.getData()]);

    forEveryGenerator(topGenerator, (gen)=>{
        console.log("AWDAWD");
        console.log(gen.id, gen.node.type, gen.offset);
    })

    return [Buffer.from(data).toString("base64"), scopes, generator];
}

export function forEveryGenerator(generator: Generator, callback: Function){
    callback(generator);
    generator.children.forEach(child => forEveryGenerator(child, callback));
}
