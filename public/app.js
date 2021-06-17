const express = require('express');
const app = express();
const port = process.env.PORT || 3306;
const APIKEY = process.env.KEY;
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})

module.exports = APIKEY;

