import { Generator } from "./Generator";
import { i32Bytes, i8Bytes } from "./Utils";

export class Label {
    public reference: Uint8Array;
    public offset = 0;
    public generator: Generator = null;
    public byteLength = 0;
    public destination: number = null;
    public start = 0;

    constructor(generator: Generator, byteLength: number){
        this.generator = generator;
        this.byteLength = byteLength;
    }

    exceedMaxSize(){
        throw new Error("Label exceeded maximum size of: " + this.reference.byteLength);
    }

    setOrigin(){
        let generator = this.generator;
        this.start = generator.offset;
        this.reference = new Uint8Array(generator._buffer, this.start, this.byteLength);
        generator.offset += this.byteLength;
    }

    setTarget(){
        this.destination = this.generator.offset;
    }
    
    writeI8(n: number){
        if(this.offset + 1 > this.reference.length) this.exceedMaxSize();
        let i8bytes = i8Bytes(n);
        this.reference[this.offset++] = i8bytes;
    }

    writeI32(n: number){
        for(let i = 0 ; i < this.reference.length; i++){
            if(this.reference[i] !== 0) throw("Overwriting");
        }
        if(this.offset + 4 > this.reference.length) this.exceedMaxSize();
        let i32bytes = i32Bytes(n);
        this.reference[this.offset++] = i32bytes[0];
        this.reference[this.offset++] = i32bytes[1];
        this.reference[this.offset++] = i32bytes[2];
        this.reference[this.offset++] = i32bytes[3];
    }
}