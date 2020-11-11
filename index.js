const express = require('express');
const app = express();    //Convention to assign function to app varaible
app.use(express.json());    //Adding a middleware so that request body is parsed in json object automatically
const Joi = require('joi');

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
  res.send('Hello World');
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