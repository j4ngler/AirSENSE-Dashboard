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
// app.use(express.static('public'));\


mongoose.set('strictQuery', false);
mongoose.connect(mongoConfig.dbConfig, {user: mongoConfig.username, pass:password}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
  console.log(mongoConfig.dbConfig)
  console.log(mongoConfig.username,mongoConfig.password)
    console.log('Could not connect to the database. Exiting now...', err);
});

(async () => {
  try {
    await RedisClient.connect();
    console.log("Successfully connect to redis")
  } catch (err) {
    console.log("Failed to connect to redis")
  }
})();

//set view engine 
app.use(express.static(__dirname + '/public'));

// Router
app.use('/api', routes);
app.use('', pagesRouters);



// giang comments due to never build react project
// app.get('/u', (req, res) => {
//   res.send(JSON.stringify({sample:false}));
//   // res.sendFile(path.join(__dirname, '../public/dist/index.html'));
// });
// app.get('/admin/#/*', (req, res) => {
//   //res.send(JSON.stringify({sample:false}));
//    res.sendFile(path.join(__dirname, '../public/dist/index.html'));
// });



app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server is running at http://${app.get('host')}:${app.get('port')}`);
});
//module.exports =  app;
