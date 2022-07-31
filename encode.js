// v0 INCOMPLETE, see encodeClass.js

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
