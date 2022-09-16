// v2 INCOMPLETE

class JSFuckToken {

    constructor(private value: any, private translation: string) { }

    public toString(): JSFuckToken {
        return new JSFuckToken(`${this.value}`, `${this.translation}+[]`);
    }

    public toNumber(): JSFuckToken {
        return new JSFuckToken(+this.value, `+(${this.translation})`);
    }

    public index(number: number): JSFuckToken {
        return new JSFuckToken(this.value[number], `(${this.translation})[${construct(`${number}`).translation}]`);
    }

    public equals(value: any): boolean {
        return value === value;
    }
}

const list: JSFuckToken[] = [];

function construct(target: string): JSFuckToken {
    return new JSFuckToken(target, target.split('').map(char => list.find(token => token.equals(char))).join('+'));
}


list.push(new JSFuckToken('0', '+[]'));











const values = {
    true: "!![]",
    false: "![]",
    undefined: "[][[]]",
}

const chars = {}

function string(value) {
    return `${value}+[]`
}

function getFlatStr() {
    return `${index(string(values["false"]), getNum(0))}+${index(string(values["false"]), getNum(2))}+${index(string(values["false"]), getNum(1))}+${index(string(values["false"]), getNum(0))}`
}

function index(value, idx) {
    return `(${value})[${idx}]`
}


try {
    String().normalize(false)
} catch (f) {
    console.log(f.name)
}


// const content = getFlatStr();
// /**
//  * Write to file and run file
//  */
// const fs = require('fs');
// fs.writeFile('./test.js', content, err => {
//     if (err) {
//         console.error(err);
//     }
// });
// const { exec } = require("child_process");
// exec("node test.js");
