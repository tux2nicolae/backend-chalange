const csv = require('csv-parser')
const fs = require('fs')

module.exports = async (path, callback) => {
    const results = [];

    return new Promise(resolve => {
        fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            resolve(results);
        });    
    })
}