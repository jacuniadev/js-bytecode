const __F64__ = new Float64Array(1);
const __I8__ = new Uint8Array(__F64__);

export const isWholeNumber = (n: number): boolean => (n % 1) === 0;
export const isValidI8 = (n: number): boolean => (n >= 0 && n <= 0xff && isWholeNumber(n));
export const isValidI32 = (n: number): boolean => (n >= 0 && n <= 0xffffffff && isWholeNumber(n));

export function i8Bytes(n: number): number{
    if(!isValidI8(n)) throw("Invalid i8 provided: " + n);
    return n;
}

export function i32Bytes(n: number): Uint8Array{
    if(!isValidI32(n)) throw("Invlaid i32 provided: " + n);
    return new Uint8Array([
        n & 0xff,
        (n >> 8) & 0xff,
        (n >> 16) & 0xff,
        (n >> 24) & 0xff
    ]);
}

export function f64Bytes(n: number): Uint8Array{
    __F64__[0] = n;
    let copy = __I8__.slice();
    return copy;
}
