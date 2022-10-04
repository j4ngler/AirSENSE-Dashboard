const express = require('express');
const bodyParser = require('body-parser');
//const morgan = require('morgan');
const cors = require('cors');
//const helmet = require('helmet');
//const compression = require('compression');
//const methodOverride = require('method-override');
//const { TrendingUpTwoTone } = require('@material-ui/icons');

var path = require('path');

const app = express();

require('dotenv').config();

app.set('port', process.env.APP_PORT || 3000);
app.set('host', process.env.APP_HOST || 'localhost');

//app.use(express.json({limit: '100mb'}));
//app.use(express.urlencoded({limit: '100mb'}));
app.use(cors());
app.options('*', cors()) // include before other routes
//app.use(helmet());
//app.use(compression());
//app.use(methodOverride());
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: TrendingUpTwoTone  }));
//app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../../public')));
app.engine('ejs', require('ejs-locals'));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../View'));
console.log(__dirname + '../View');

module.exports =  app;
