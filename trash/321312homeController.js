const readmeService = require('../services/4234234readmeService');

exports.renderBody=(req, res)=>{
    readmeService.getReadmeHTML((err, htmlContent) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(
          ` <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>README</title>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
    });
}
