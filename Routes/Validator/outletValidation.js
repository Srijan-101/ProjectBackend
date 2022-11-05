const { body } = require('express-validator');


exports.outletValidator = [
    body('outletName')
        .isAlpha()
        .withMessage("Outlet Name invalid!")
        .isLength({ min: 3, max: 15 })
        .withMessage('OutletName should contains atleast 3 letters.'),

        body('location')
        .isAlpha()
        .withMessage("Location  invalid!")
        .isLength({ min: 3, max: 15 })
        .withMessage('Location should contains atleast 3 letters.'),

       body('ManagerEmail')
        .isEmail()
        .withMessage('Invalid email address'),

    body('phoneNumber')
        .isNumeric()
        .withMessage("Phone number Invalid")
        .isLength({min:9,max:10})
        .withMessage('Phone number Invalid')
]



