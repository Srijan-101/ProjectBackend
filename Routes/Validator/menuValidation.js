const { body } = require('express-validator');


exports.menuValidator = [
    body('Name')
        .isAlpha()
        .withMessage("Food name invalid!")
        .isLength({ min: 3, max: 15 })
        .withMessage('OutletName should contains atleast 3 letters.'),


       body('Price')
        .isNumeric()
        .withMessage('Price invalid!'),
]



