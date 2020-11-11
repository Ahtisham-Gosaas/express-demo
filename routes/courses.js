const express = require('express');
const router = express.Router();
const Joi = require('joi');

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with give ID was not found!');
  res.send(course);
});

router.post('/', (req, res) => {
  let {error} = validate_course(req.body);    //New syntax followed called object destructuring
  if (error) return res.status(400).send(error.details[0].message);
  
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  
  courses.push(course);
  res.send(course);
});


router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with give ID was not found!');

  let index = courses.indexOf(course);
  courses.splice(index, 1);
  
  res.send(course);
});

function validate_course(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

module.exports = router;