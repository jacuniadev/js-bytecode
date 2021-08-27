export interface scope {
    0: number, //id
    1: number, //number of times will come up
    2?: never,
}

export interface scopeInfo extends Array<scope>{}

export interface compiledProgram {
    scopes: Array<any>,
    bytecode: Uint8Array,
    raw: string,
}

export interface bind {
    value: any,
}
