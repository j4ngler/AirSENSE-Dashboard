const path = require('path');
const app = require('./config/express.js');
const routes = require('./routes/index.route.js');
const pagesRouters = require('./routes/pages.route.js');
const express = require('express');
const mongoose = require('mongoose');
const mongoConfig = require('./config/mongoConfig.js');
const { password } = require('./config/mongoConfig.js');
//const swagger = require('./config/swagger.js');

// Swagger API documentation
/*app.get('/swagger.json', (req, res) => {
  res.json(swagger);
});*/
// const fileUpload = require('express-fileupload')
// app.use(fileUpload());
// app.use(express.static('public'));

// Connecting to the database
// mongoose.set('useCreateIndex', true);
// mongodb://username:password@host:port/database

// mongoose.connect(mongoConfig.dbConfig, {user: mongoConfig.username, pass:password}).then(() => {
//     console.log("Successfully connected to the database");
// }).catch(err => {
//   console.log(mongoConfig.dbConfig)
//   console.log(mongoConfig.username,mongoConfig.password)
//     console.log('Could not connect to the database. Exiting now...', err);
// });




// Router
app.use('/api', routes);
app.use('', pagesRouters);
app.get('/u', (req, res) => {
  res.send(JSON.stringify({sample:false}));
  // res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});
app.get('/admin/#/*', (req, res) => {
  //res.send(JSON.stringify({sample:false}));
   res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});
app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server is running at http://${app.get('host')}:${app.get('port')}`);
});
//module.exports =  app;
