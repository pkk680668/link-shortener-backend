const express = require("express");

const app = express();
const urlRoute = require('./routes/url');
app.use('/api', urlRoute);
