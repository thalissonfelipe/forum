const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');

const app = express();

mongoose.connect(
    'mongodb+srv://web:web@cluster0.fgljt.mongodb.net/<web_db>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

app.use(express.json());
app.use(routes);

app.listen(config.getAPIPort(), config.getAPIAddress());
