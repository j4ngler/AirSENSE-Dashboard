const path = require('path');
const app = require('./config/express.js');
const routes = require('./routes/index.route.js');
const pagesRouters = require('./routes/pages.route.js');
const express = require('express');
//const swagger = require('./config/swagger.js');

// Swagger API documentation
/*app.get('/swagger.json', (req, res) => {
  res.json(swagger);
});*/
// const fileUpload = require('express-fileupload')
// app.use(fileUpload());
// app.use(express.static('public'));




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
