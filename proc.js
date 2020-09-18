const fs = require('fs')
const util = require('util')

// https://www.youtube.com/watch?v=W-3MP27IU-I&list=PLTPQcjlcvvXFtR0R91Gh5j9Xi8cq0oN3Y

const usdrx = /^(\d+)\/(\d+)\/(\d+)$/
/**
 * Munge USA date to ISO date
 *
 * @param {string} usd - USA date format M/D/YY with year in the 2000s
 */
function mungeUsaDateString(usd) {
    const da = usdrx.exec(usd)
    if (!da) throw Error('bad line dude')
    const gd = new Date(Date.UTC(Number(da[3]) + 2000, Number(da[1]) - 1, Number(da[2])))
    return gd.toISOString().substr(0, 10)
}

readRaw('raw.txt', (err, data) => {
    if (err) throw err
    let s = JSON.stringify(data).replace('[[', '[\n  [').replace(']]', ']\n]\n').replace(/],/g, '],\n  ')
    fs.writeFileSync('data.json', s)
})

function procRawLine(line) {
    let t = line.replace(/#.*$/, '').replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/)
    return t.length === 2 ? [mungeUsaDateString(t[0]), Number(t[1])] : null
}

function readRaw(f, callback) {
    fs.readFile(f, 'utf8', (err, data) => {
        if (err) return callback(err)
        const lines = data
            .split('\n')
            .map((line) => procRawLine(line))
            .filter((x) => x !== null)
        return callback(null, lines)
    })
}
