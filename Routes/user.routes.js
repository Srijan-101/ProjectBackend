const Router = require('express').Router();
const {signUp,Login, Current,resendVerify ,Activateaccount, passwordReset, changePassword} = require('../Controllers/user.controllers');

const { runValidation } = require('./Validator');
const { userValidator } = require('./Validator/userValidation');
const passport = require('passport');

// @route GET api/users/register
// @desc Register user
// @access Public
Router.post('/Signup',userValidator,runValidation,signUp);


// @route GET api/users/login
// @desc Login user / Returning JWT Token
// @access Public
Router.post('/Login',Login);


// @route GET api/users/Activateaccount
// @desc Activateaccount /update isActivate:boolean 
// @access Public
Router.post('/Activateaccount',Activateaccount);

Router.post('/ResendVerify',resendVerify );

Router.post('/ResetPassword',passwordReset);

Router.post('/ChangePassword',changePassword);

Router.get('/Current',passport.authenticate('jwt',{session:false}),Current)


module.exports = Router;