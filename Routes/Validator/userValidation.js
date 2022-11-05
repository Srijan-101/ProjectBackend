const { body } = require('express-validator');


exports.userValidator = [

    body('firstName')
        .isAlpha()
        .withMessage("Invalid first name.")
        .isLength({ min: 3, max: 15 })
        .withMessage('Firstname should contains atleast 3 letters.'),

    body('lastName')
        .isAlpha()
        .withMessage("Invalid last name.")
        .isLength({ min: 2, max: 15 })
        .withMessage('Firstname should contains atleast 2 letters.'),

    body('email')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({min:7})
        .withMessage('Password must contains minimum 8 characters')
]



