const {AddSales,GetDailySalesById, GetMonthlySalesById,GetDailySales, GenerateCSV} = require('../Controllers/sales.controller');
const Router = require('express').Router();
const passport = require('passport');

Router.post('/AddSales',passport.authenticate('jwt',{session:false}),AddSales);
Router.get('/GetDaily/:outletId',passport.authenticate('jwt',{session:false}),GetDailySalesById);
Router.get('/GetMonthly/:outletId',passport.authenticate('jwt',{session:false}),GetMonthlySalesById);
Router.get('/GetDailyAdmin',passport.authenticate('jwt',{session:false}),GetDailySales);

Router.get('/GenerateCSV/:outletId',passport.authenticate('jwt',{session:false}),GenerateCSV);

module.exports = Router;

