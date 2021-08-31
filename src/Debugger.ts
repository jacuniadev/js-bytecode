import { Op } from "./Op";

let a = [];
a[Op.CreateFunction] = function(block){
    block.readI32();
}

a[Op.Call] = function(block){
    block.readI8();
}

a[Op.ReturnValue] = function(block){
};

a[Op.RegisterString] = function(block){
    block._loadString();
}

a[Op.AssignValueToGlobal] = function(block){
}
a[Op.GetGlobalVariableValue] = function(block){
}
a[Op.GetArguments] = function(block){
    block.readI8();   
}
a[Op.ObjectPropertyCall] = function(block){
    block.readI8();
}

a[Op.String] = function(block){
    block.readString();
}
a[Op.GetObjectProperty] = function(block){
}

a[Op.MakeArray] = function(block){
    block.readI32();
}
a[Op.Debugger] = function(block){
    debugger;
    
}
a[Op.MakeObject] = function(block){
    block.readI32();
    
}
a[Op.This] = function(block){
    
}
a[Op.SetObjectProperty] = function(block){
}

a[Op.AssignValue] = function(block){
    block.readI32();
}
a[Op.GetVariableValue] = function(block){
    block.readI32();
}
a[Op.I8] = function(block){
    block.readI8();
}
a[Op.I32] = function(block){
    block.readI32();
}
a[Op.BOOL] = function(block){
    block.readI8();
}
a[Op.Jump] = function(block){
    block.readI32();
}
a[Op.JumpToBlock] = function(block){
    block.readI32();
}
a[Op.JumpIfFalse] = function(block){
    block.readI32();
}

a[Op.New] = function(block){
    block.readI32();
}
a[Op.END] = function(block){
}

a[Op.LessThan] = function(block){
}
a[Op.LessThanOrEqual] = function(block){
}
a[Op.GreaterThan] = function(block){
}
a[Op.GreaterThanOrEqual] = function(block){
}
a[Op.EqualTo] = function(block){
}
a[Op.EqualToStrict] = function(block){
}
a[Op.NotEqualTo] = function(block){
}
a[Op.NotEqualToStrict] = function(block){
}
a[Op.Add] = function(block){
}
a[Op.Sub] = function(block){
}
a[Op.Multiply] = function(block){
}
a[Op.Divide] = function(block){
}
a[Op.Remainder] = function(block){
}
a[Op.BitAnd] = function(block){
}
a[Op.BitOr] = function(block){
}
a[Op.BitXOR] = function(block){
}
a[Op.BitLeftShift] = function(block){
}

a[Op.BitRightShift] = function(block){
}

a[Op.BitZeroFillRightShift] = function(block) {
}

a[Op.RaiseExponent] = function(block){
}

export class Debugger {

    public u8: Uint8Array;


    readString(){
        let idx = this.readI32();
    }

    readI32() {
        let num = (
            this.u8[this.ip++] |
          (this.u8[this.ip++] << 8) |
          (this.u8[this.ip++] << 16) |
          (this.u8[this.ip++] << 24)
        )
        this.data.push(num);
    }

    readI8(){
       let val = this.u8[this.ip++];
       this.data.push(val);
        return val;
    }

    _loadString(): void{
        let length = this.readI8();
        /*let str = "";
        let start = this.ip;
        for(let i = start; i < start + length; i++){
            str += String.fromCharCode(bytes[i]);
        }*/
        this.ip += length;
        this.data.push("str");
    }

    public ip = 0;
    public data = new Array();
    debug(ar: Uint8Array){
        this.u8 = ar;
        for(this.ip = 0 ; this.ip < ar.length;){
            let op = this.ip;
            let header = ar[this.ip++];
            this.data.push("[" + op + "] " + Op[header]);
            a[header](this);
        }
        return this.data;
    }
}