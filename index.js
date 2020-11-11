const config = require('config');
const express = require('express');
const app = express();    //Convention to assign function to app varaible
const logger = require('./middlewares/logger');
const helmet = require('helmet');   //Add secure headers to request
const morgan = require('morgan');   //Logs request
const courses = require('./routes/courses');
const homepage = require('./routes/home');

//Middlewares
app.use(express.json());    //Adding a middleware so that request body is parsed in json object automatically
app.use(express.urlencoded({extended: true}));    //Parses the urlencoded form data to JSON format in request.body
app.use(express.static('public'));    //Let us serve the static files listed in public directory.
app.use(helmet());

app.use(logger);
app.use(function(req, res, next){
  console.log('Authenticating...');
  next();
});

if (app.get('env') === 'development')
  app.use(morgan('tiny'));    //Use this middleware in development environment only

app.use('/api/courses', courses);
app.use('/', homepage);

//Adding templating engine
app.set('view engine', 'pug');
app.set('views', './views');

//Environemnt Variables
console.log(`Node environment: ${process.env.NODE_ENV}`);
console.log(`Node environment: ${app.get('env')}`);

//Configuration
console.log(`Applicantion Name: ${config.get('name')}`);
console.log(`Mail Server Name: ${config.get('mail.host')}`);
console.log(`Mail Server Password comming from environment variable: ${config.get('mail.password')}`);

//Actual Logic
var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));