const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

require('dotenv').config();

app.set('port', process.env.APP_PORT || 3001);
app.set('host', process.env.APP_HOST || 'localhost');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Static assets (copy từ WebManage_test/public)
app.use(express.static(path.join(__dirname, '../../public')));

app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../View'));

module.exports = app;

