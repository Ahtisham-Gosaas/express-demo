const config = require('config');
const express = require('express');
const app = express();    //Convention to assign function to app varaible
const Joi = require('joi');
const logger = require('./logger');
const helmet = require('helmet');   //Add secure headers to request
const morgan = require('morgan');   //Logs request
app.use(express.json());    //Adding a middleware so that request body is parsed in json object automatically
app.use(express.urlencoded({extended: true}));    //Parses the urlencoded form data to JSON format in request.body
app.use(express.static('public'));    //Let us serve the static files listed in public directory.
app.use(helmet());

//Adding templating engine
app.set('view engine', 'pug');
app.set('views', './views');

//Middlewares

console.log(`Node environment: ${process.env.NODE_ENV}`);
console.log(`Node environment: ${app.get('env')}`);

if (app.get('env') === 'development')
  app.use(morgan('tiny'));    //Use this middleware in development environment only

app.use(logger);

app.use(function(req, res, next){
  console.log('Authenticating...');
  next();
});

//Configuration

console.log(`Applicantion Name: ${config.get('name')}`);
console.log(`Mail Server Name: ${config.get('mail.host')}`);
console.log(`Mail Server Password comming from environment variable: ${config.get('mail.password')}`);

//Actual Logic

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
  // res.send('Hello World');
  res.render('index', { title: 'My Express App', message: 'Hello World' });
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with give ID was not found!');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  let {error} = validate_course(req.body);    //New syntax followed called object destructuring
  if (error) return res.status(400).send(error.details[0].message);
  
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  
  courses.push(course);
  res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with give ID was not found!');

  let {error} = validate_course(req.body);
  if (error){
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with give ID was not found!');

  let index = courses.indexOf(course);
  courses.splice(index, 1);
  
  res.send(course);
});

app.get('/api/courses/:year/:month', (req, res) => {
  res.send(req.params);    //Year can be accessed as request.params.year
  // res.send(req.query);   //Query string parameters can be accessed in this way
});

function validate_course(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));