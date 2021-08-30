
let a = [];
a[Op.CreateFunction] = function(block){
    let blockid = block.readI32();
    block.stack.push(block.runChild(blockid).makeFn());
}

a[Op.Call] = function(block){
    let totalArgs = block.readI8();
    let args = [];
    let fn = block.stack.pop();
    for(let i = 0 ; i < totalArgs; i++) args[ totalArgs - i - 1] = block.stack.pop();
    
    let val = fn.apply(block.scope, args);
    block.log("Function returned: " + val);
    block.stack.push(val);
}

a[Op.ReturnValue] = function(block){
    let value = block.stack.pop();
    block.log("Returning: " + value);
    block.returnRegister = value;
    block.U++;
    
};

a[Op.RegisterString] = function(block){
    block._loadString();
    
}

a[Op.AssignValueToGlobal] = function(block){
    let prop = block.stack.pop();
    let val = block.stack.pop();
    block.stack.push(block.scope[prop] = val);
    block.log(`MOV ${typeof(val) === "string" || typeof(val) === "number" ? val : typeof(val)} -> global.${prop}`);
    
}
a[Op.GetGlobalVariableValue] = function(block){
    let prop = block.stack.pop();
    block.log("property", prop);
    testIsGlobalPropOrFunction(prop);
    block.stack.push(globalScope[prop])
    
}
a[Op.GetArguments] = function(block){
    let index = block.readI8();
    block.log("Loading value into arguments", block.args[index]);
    block.stack.push(block.args[index]);
    
}
a[Op.ObjectPropertyCall] = function(block){
    let totalArgs = block.readI8();
    let args = [];
    let obj = block.stack.pop();
    let prop = block.stack.pop()
    for(let i = 0; i < totalArgs; i++) args[ totalArgs - i - 1 ] = block.stack.pop();
    let fn = obj[prop];
    let val = fn.apply(obj, args);
    block.stack.push(val);
    
}
a[Op.String] = function(block){
    let str = block.readString();
    block.stack.push(str);
    
}
a[Op.GetObjectProperty] = function(block){
    let prop = block.stack.pop();
    let obj = block.stack.pop();
    block.log("#", prop, obj);
    block.stack.push(obj[prop]);
    
}
a[Op.MakeArray] = function(block){
    let elements = block.readI32();
    let arr = new Array(elements);
    for(let i = 0 ; i < elements; i++) arr[elements - i - 1 ] = block.stack.pop();
    block.stack.push(arr);
    block.log("Create Array");
    
}
a[Op.Debugger] = function(block){
    debugger;
    
}
a[Op.MakeObject] = function(block){
    let props = block.readI32();
    let obj = {};
    let values = new Array(props * 2);
    for(let i = 0 ; i < props; i++){
        values[(props - i) * 2 - 1] = block.stack.pop();
        values[(props - i) * 2 - 1 - 1] = block.stack.pop();
    }
    for(let i = 0; i < props * 2; i +=2){
        obj[values[i]] = values[i + 1];
    }
    block.stack.push(obj);
    
}
a[Op.This] = function(block){
    block.stack.push(block.scope);
    
}
a[Op.SetObjectProperty] = function(block){
    
    let property = block.stack.pop();
    let obj = block.stack.pop();
    let value = block.stack.pop();
    obj[property] = value;
    
}
a[Op.AssignValue] = function(block){
    let index = block.readI32();
    let value = block.stack.pop();
    block.parent && block.log(block.parent.definitions);
    block.definitions[index].value = value;
    block.log(`ASSIGN ${typeof(value) === "string" || typeof(value) === "number" ? value : typeof(value)} -> $${index}`);
    
}
a[Op.GetVariableValue] = function(block){
    let index = block.readI32();
    let value = block.definitions[index].value;
    block.stack.push(value);
    block.log(`MOV ${block.blockId}-$${index} ${typeof(value) === "string" || typeof(value) === "number" ? value : typeof(value)} -> stack`);
    
}
a[Op.I8] = function(block){
    let num = block.readI8();
    block.stack.push(num);
    block.log(`MOV ${num} -> stack`);
    
}
a[Op.I32] = function(block){
    let num = block.readI32();
    block.stack.push(num);
    block.log(`MOV ${num} -> stack`);
    
}
a[Op.BOOL] = function(block){
    let bool = !!block.readI8();
    block.log(`MOV ${bool.toString()} -> stack`);
    block.stack.push(bool);
    
}
a[Op.Jump] = function(block){
    let dst = block.readI32();
    block.ip = dst;
    block.log(`JMP @${dst}`);
    
}
a[Op.JumpToBlock] = function(block){
    let blockid = block.readI32();
    block.log(`JMP to Block ->${blockid}`);
    block.runChild(blockid).makeFn().apply(block.scope);
    
}
a[Op.JumpIfFalse] = function(block){
    let dst = block.readI32();
    let val = block.stack.pop();
    if(!val) block.ip = dst;
    
}
a[Op.New] = function(block){
    let totalArgs = block.readI32();
    let args = new Array(totalArgs);
    for(let i = 0 ; i < totalArgs; i++) args[totalArgs - i - 1] = block.stack.pop();
    let obj = block.stack.pop();
    let instace = construct(obj, args)
    block.stack.push(instace);
    
}
a[Op.END] = function(block){
    block.returnRegister = undefined;
    block.U++;
    block.ip = -1;
    block.S = [];
    
}
a[Op.LessThan] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left < right);
    
}
a[Op.LessThanOrEqual] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left <= right);
    
}
a[Op.GreaterThan] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left > right);
    
}
a[Op.GreaterThanOrEqual] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >= right);
    
}
a[Op.EqualTo] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left == right);
    
}
a[Op.EqualToStrict] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left === right);
    
}
a[Op.NotEqualTo] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left != right);
    
}
a[Op.NotEqualToStrict] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left !== right);
    
}
a[Op.Add] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left + right);
    
}
a[Op.Sub] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left - right);
    
}
a[Op.Multiply] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left * right);
    
}
a[Op.Divide] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left / right);
    
}
a[Op.Remainder] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left % right);
    
}
a[Op.BitAnd] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left & right);
    
}
a[Op.BitOr] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left | right);
    
}
a[Op.BitXOR] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left ^ right);
    
}
a[Op.BitLeftShift] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left << right);
    
}

a[Op.BitRightShift] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >> right);
    
}

a[Op.BitZeroFillRightShift] = function(block) {
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left >>> right);
    
}

a[Op.RaiseExponent] = function(block){
    let right = block.stack.pop();
    let left = block.stack.pop();
    block.stack.push(left ** right);
}
