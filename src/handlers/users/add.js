const database = require('../../database');
const { body, validationResult } = require('express-validator');
const validateName = require('../../validations/user/validateName');
const validateAge = require('../../validations/user/validateAge');

/**
 * POST /api/users
 *
 * name: obligatorio, debe tener por lo menos 3 caracteres
 * age: obligatorio
 */
module.exports = (route) => {
  route.post('/', validateName, validateAge, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const name = req.body.name;
    const age = req.body.age;

    const user = database.add({
      name: name.trim(),
      age: parseInt(age),
    });

    res.json(user);
  });
};
