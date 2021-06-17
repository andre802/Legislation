const express = require('express');
const app = express();
const port = process.env.PORT || 3306;
export const APIKEY = process.env.KEY;
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})


