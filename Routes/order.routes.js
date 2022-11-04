const Router = require('express').Router();
const {AddOrderItem ,GetOrderItem,deleteItem} = require('../Controllers/order.controller');

const passport = require('passport');

Router.post('/AddOrderItem',passport.authenticate('jwt',{session:false}),AddOrderItem)
Router.get('/GetOrderItem/:id',passport.authenticate('jwt',{session:false}),GetOrderItem)
Router.delete('/DeleteItem',passport.authenticate('jwt',{session:false}),deleteItem)


module.exports = Router;