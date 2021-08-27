const __F32__ = new Float64Array(1);
const __BUF__ = new Uint8Array(__F32__.buffer);

export function isWholeNumber(num: number): boolean{
    return num % 1 === 0;
}

export function isValidUint8(num: number): boolean{
    if( !isWholeNumber( num ) ) return false;
    if(num < 0) return false;
    if( num > 0xff) return false;
    return true;
}

export function isValidUint32(num: number): boolean {
    if(num < 0) return false;
    if( !isWholeNumber( num ) ) return false;
    if( num >= Math.pow(2, 32) ) return false;    
    return true;
}

export function Float64ToBytes(num: number): Uint8Array{
    __F32__[0] = num;
    //create a copy that does not share same buffer
    let byteCopy = __BUF__.slice();
    return byteCopy;
}

export function Uint32ToBytes(num: number): Uint8Array {
    if( !isValidUint32(num) ) throw new Error(num + " is not a uint32");

    return new Uint8Array([
        num & 0xff,
        (num >> 8) & 0xff,
        (num >> 16) & 0xff,
        (num >> 24) & 0xff
    ]);
}