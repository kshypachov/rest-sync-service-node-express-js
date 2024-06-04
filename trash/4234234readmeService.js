const fs = require('fs');
const {marked} = require('marked');
const path = require('path');

function getReadmeHTML(callback) {
  const readmePath = path.join(__dirname, '../', 'README.md');
    fs.readFile(readmePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback('Error reading README.md');
            return;
        }
        const htmlContent = marked(data);
        callback(null, htmlContent);
    });
}

module.exports = {
    getReadmeHTML
};
