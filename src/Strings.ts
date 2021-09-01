import { Op } from "./Op";
import { forEveryParser, Scope } from "./Parserv2";

export class Strings {
    public id = 0;
    public strings: Array<string> = [];
    public set: {[key: string]: number} = {};
    public parent: Scope;

    constructor(parent: Scope){
        this.parent = parent;
    }

    add(string: string){
        console.log(string, "added");
        if(!this.set.hasOwnProperty(string)){
            let id = this.id++;
            this.set[string] = id;
            this.strings[id] = string;
        }
    }

    get(string: string): number{
        console.log(string);
        if(!this.set.hasOwnProperty(string)) throw("Couldnt find the string");
        return this.set[string];
    }

    getData(): {
        stringScope: Array<any>,
        rawStringdata: Uint8Array,
    }{
        let offset = 0;
        forEveryParser(this.parent, (scope) => {
            offset += scope.offset;
        });
        let stringScope = [0, -1, 0, [], offset];
        let buffer = [];
        this.strings.forEach(str => {
            buffer.push(Op.RegisterString);
            buffer.push(str.length)
            for(let i = 0 ; i < str.length; i++) buffer.push(str.charCodeAt(i));
        })
        
        buffer.push(Op.JumpToBlock);
        buffer.push(1); //jump to 0
        buffer.push(0);
        buffer.push(0);
        buffer.push(0);
        buffer.push(Op.END);

        let rawStringdata = new Uint8Array(buffer);
        return {
            stringScope,
            rawStringdata,
        }
    }
}
