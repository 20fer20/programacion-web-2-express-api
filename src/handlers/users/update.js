const database = require('../../database');
const { validationResult } = require('express-validator');
const validateName = require('../../validations/user/validateName');
const validateAge = require('../../validations/user/validateAge');

/**
 * PUT /api/users/:userId
 *
 * name: obligatorio, debe tener por lo menos 3 caracteres
 * age: obligatorio
 */
module.exports = (route) => {
  route.put('/:userId', validateName, validateAge, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const userId = parseInt(req.params.userId);
    const name = req.body.name;
    const age = req.body.age;

    const user = database.update(userId, {
      name: name.trim(),
      age: parseInt(age),
    });

    res.json(user);
  });
};
