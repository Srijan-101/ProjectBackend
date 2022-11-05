
const {validationResult} = require('express-validator');

exports.runValidation = (req,res,next) => {
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
      const message = errors.array()
      console.log(message[0].msg)
      return res.status(400).json({message: message[0].msg});
    }
    next();
}