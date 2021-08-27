import { compileProgram } from "./AstUtils";
import { runVM, WebAssembly_JS } from "./VirtualMachine";

function runTests(){
    let curTest = null;
    let passed = [];
    let failed = [];

    function isEqual(a, b){
        if(typeof(a) !== typeof(b)) return false;
        if(JSON.stringify(a) !== JSON.stringify(b)) return false;
        return true;
    }

    (globalThis as any).std_out = function(value){
        if(!isEqual(value, curTest[2])) failed.push([curTest, value]);
        else passed.push(curTest);
    }
    let tests = [];
    let _test_id = 0;

    tests.push([
        "Test some math",
        `
        let a = 4;
        let b = 7 + a;
        let c = 8 * a;
        let d = 5 ** 2;
        let e = 6 | 9;
        std_out(a + b + c + d + e);
        `,
        87,
    ])

    tests.push([
        "Test some math pt2",
        `
        let a = 4;
        let b = 7 + a << 4 * 23;
        let c = 8 * a;
        let d = 5 ** 2 + b / 4;
        let e = 6 | 9 - c + d;
        std_out(a + b + c + d + e);
        `,
        -2013265853,
    ])

    tests.push([
        "Test console log of object property",
        `
        let obj = {test: "kawak is gay"};
        std_out(obj.test);
        `,
        "kawak is gay",
    ])

    tests.push([
        "Test console log of object",
        `
        let obj = {test: "kawak is gay"};
        std_out(obj);
        `,
        {test: "kawak is gay"},
    ])

    tests.push([
        "Test console log of empty array",
        `
        let obj = [];
        std_out(obj);
        `,
        [],
    ])

    tests.push([
        "Test console log of filled array",
        `
        let obj = [1, "test"];
        std_out(obj);
        `,
        [1, "test"],
    ])

    tests.push([
        "Test setting object property as number from variable",
        `
        let num = 50;
        let obj = {};
        obj.x = num;
        std_out(obj);
        `,
        {x: 50},
    ])

    tests.push([
        "Test setting object property as object from variable",
        `
        let obj = {x: 1}
        obj.x = 3;
        let derp = {test: "hello world"};
        obj.x = derp;
        std_out(obj);
        `,
        {x: {test: "hello world"}},
    ])

    tests.push([
        "Test setting object property as object without variable",
        `
        let obj = {x: {y: "test"}}
        std_out(obj);
        `,
        {x: {y: "test"}},
    ])

    tests.push([
        "Test accessing array at index",
        `
        let obj = [1, "test"]
        std_out(obj[1]);
        `,
        "test",
    ])

    tests.push([
        "Test accessing array at index and type casting addition",
        `
        let obj = [1, "test"]
        std_out(obj[1] + 0);
        `,
        "test0",
    ])

    tests.push([
        "Test pushing to an array",
        `
        let obj = [1, "test"];
        obj.push(10)
        std_out(obj[2]);
        `,
        10,
    ])

    tests.push([
        "Test push object to array",
        `
        let obj = [1, "test"]
        let a = {x: 10};
        obj.push(a);
        std_out(obj[2]);
        `,
        {x: 10},
    ])

    tests.push([
        "call function from array",
        `
        let obj = [1, "test", std_out]
        obj[2](3);
        `,
        3,
    ])

    tests.push([
        "call function that requires a *this* from array",
        `
        let obj = [1, "test", []]
        obj[2].push(420);
        std_out(obj[2]);
        `,
        [420],
    ])

    tests.forEach(test => {
        curTest = test;
        let program = compileProgram(test[1], false);
        //get it as a base64 string
        let bytes = Buffer.from(program.bytecode).toString("base64");
        console.log("Running test: " + test[0]);
        runVM(program, false);
    })

    console.log("=================");
    console.log("passed: " + passed.length + "/" + tests.length);
    console.log("failed: " + failed.length + "/" + tests.length);
    failed.forEach(fail => console.log("[FAILED]: " + fail[0][0] + "[EXPECTED: " + JSON.stringify(fail[0][2]) + " GOT " + JSON.stringify(fail[1])));
    console.log("=================");
    console.log("")

}

runTests();


let verbose = false;
let code = `
let x = new Buffer("test");
`;

let program = compileProgram(code, false);
let WASM = new runVM(program);
//WASM.run();