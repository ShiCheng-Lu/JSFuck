// v1

class Trans {
    static valMapping = {};
    static charMapping = {};
    static universalMap;

    static addMapping(value, fuck) {
        if (typeof value === 'string' && value.length === 1) {
            Trans.charMapping[value] = new Trans(value, fuck);
        } else {
            Trans.valMapping[value] = new Trans(value, fuck);
            Trans.processCharMapping(Trans.valMapping[value]);
        }
    }

    static processCharMapping(trans) {
        const converted = trans.convert('string');
        const valueStr = `${trans.value}`;
        for (const idx in valueStr) {
            const char = valueStr[idx];
            const fuck = converted.index(idx);
            this.addCharMapping(char, fuck.fuck);
        }
    }

    /**
     * add a JSFuck character mapping, keep shorter mapping
     * @param {char} char 
     * @param {string} mapping 
     */
    static addCharMapping(char, mapping) {
        if (Trans.charMapping[char] === undefined || Trans.charMapping[char].fuck.length > mapping.length) {
            Trans.addMapping(char, mapping);
        }
    }

    /**
     * use the available mappings to create a string of value
     * @param {string} value 
     * @returns 
     */
    static construct(value) {
        return value.split('').map(char => {
            if (Trans.charMapping[char]) {
                return Trans.charMapping[char].fuck
            } else if (Trans.universalMap) {
                return Trans.universalMap(char)
            } else {
                throw `Faild to get ${char}`
            }
        }).join('+')
    }

    /**
     * return a string that runs |value| as code
     * @param {string} value 
     */
    static runCode(value) {
        return `${Trans.valMapping[Function.constructor].fuck}(${value})()`
    }

    constructor(value, fuck) {
        this.value = value;
        this.fuck = fuck;
    }

    static getNum(value) {
        return value.toString().split('').map(x => {
            if (x == '0') {
                return "[+[]]"
            } else {
                return `[${"+!![]".repeat(parseInt(x))}]`
            }
        }).join("+")
    }

    static setUniversalMap(func) {
        Trans.universalMap = func;
    }

    convert(value) {
        switch (value) {
            case 'string':
                return new Trans(`${this.value}`, `${this.fuck}+[]`);
            case 'number':
                return new Trans(parseInt(this.value), `+(${this.fuck})`);
        }
    }

    static debug(value) {
        for (var i in Trans.valMapping) {
            if (value === undefined || value.includes(i)) Trans.valMapping[i].debug();
        }
        for (var i in Trans.charMapping) {
            if (value === undefined || value.includes(i)) Trans.charMapping[i].debug();
        }
    }

    debug() {
        console.log(`${this.value}: ${this.fuck}`)
    }

    index(index) {
        return new Trans(this.value[index], `(${this.fuck})[${Trans.getNum(index)}]`);
    }

    valueOf() {
        return this.fuck;
    }
}


/**
 * Add basic 
 */
Trans.addMapping(true, "!![]")
Trans.addMapping(false, "![]")
Trans.addMapping(undefined, "[][[]]")

/**
 * 
 */
Trans.addMapping([]["flat"], `[][${Trans.construct("flat")}]`)
Trans.addMapping([]["entries"](), `[][${Trans.construct("entries")}]()`)


/**
 * Numbers and period
 */
for (var x = 0; x < 10; ++x) {
    Trans.addMapping(x.toString(), Trans.getNum(x))
}
Trans.addMapping('.', `(+(${Trans.construct("11e100")})+[])[${Trans.getNum(1)}]`)

/**
 * Constructor Strings
 */
Trans.addMapping(0["constructor"], `(+[])[${Trans.construct("constructor")}]`)
Trans.addMapping(""["constructor"], `([]+[])[${Trans.construct("constructor")}]`)
// Trans.addMapping(Array.constructor, `[][${Trans.construct("constructor")}]`) // Duplicate chars of []["entries"]
Trans.addMapping(Function.constructor, `[][${Trans.construct("flat")}][${Trans.construct("constructor")}]`)

/**
 * Rest of lowercase chars from (int)["toString"](36)
 */
var toString = `${Trans.construct("to")}+(${Trans.valMapping[""["constructor"]].fuck}[${Trans.construct("name")}])`
for (var x = 10; x < 36; ++x) {
    Trans.addCharMapping(x.toString(x + 1), `(+(${Trans.getNum(x)}))[${toString}](${Trans.getNum(x + 1)})`)
}

/**
 * Get all (using String.fromCharCode to get all possible characters)
 */
Trans.addMapping(',', `([[]][${Trans.construct("concat")}]([[]])+[])`)
Trans.addMapping('%2C', `${Trans.runCode(Trans.construct(`return escape`))}((${Trans.charMapping[','].fuck}))`)

Trans.setUniversalMap(x => `(${Trans.valMapping[""["constructor"]].fuck}[${Trans.construct("fromCharCode")}](${Trans.getNum(x.charCodeAt(0))}))`)



/**
 * Start of lowercase codable (using regex to get unicode characters)
 */
// Trans.addMapping("RangeError", Trans.runCode(Trans.construct("try{String().normalize(false)}catch(f){return f.name}")))

const inputFile = './target.js'
const outputFile = './result.js'

const fs = require('fs');
const rawcontent = `${Trans.runCode(Trans.construct(fs.readFileSync(inputFile, {encoding:'utf8', flag:'r'})))}`
// format content to have newline every 100 chars
const content = rawcontent.split("").map((c, i) => (i !== 0 && i % 100 === 0) ? "\n" + c : c).join("")

/**
 * Write to file and run file
 */
fs.writeFileSync(outputFile, content);
console.log("RUNNING PRODUCED CODE:")
const { exec } = require("child_process");
exec(`node ${outputFile}`, (exc, out, err) => console.log(out));
