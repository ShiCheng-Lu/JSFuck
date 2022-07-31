/**
 * Base64 encode the JSFuck for obsfucation
 */
const inputFile = './target.js'
const outputFile = './result.js'

const fs = require('fs');
const rawcontent = `${Trans.construct(fs.readFileSync(inputFile, {encoding:'utf8', flag:'r'}))}`

/**
 * encode a section of JSFuck, str must be length 32
 * @param {string} str 
 */
function encodeSegment(str) {
    
}

/**
 * decode a base64 segment to JSFuck
 * @param {string} str 
 */
function decodeSegment(str) {

}





