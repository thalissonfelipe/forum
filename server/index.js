const express = require('express');
const bodyParser = require('body-parser');
const config = require('./src/config');
const app = express();

app.use(bodyParser.json());

app.listen(config.getAPIPort(), config.getAPIAddress());

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});
