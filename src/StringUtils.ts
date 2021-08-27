import { OP } from "./Constants";

export function getStringLengthHeader(str_len){
    return [OP.REGISTER_STRING, str_len];
}

export function stringArrayTobytes(strings: string[]): Uint8Array {
    let buffer = [];
    strings.forEach(str => {
        let bytes = stringTobytes(str);
        let header = getStringLengthHeader(str.length);
        buffer.push(...header);
        buffer.push(...bytes);
    });
    return new Uint8Array(buffer);
}

export function stringTobytes(str: string): Uint8Array{
    let buffer = [];
    for(let i = 0 ; i < str.length; i++){
        buffer[i] = str.charCodeAt(i);
    }
    return new Uint8Array(buffer);
}