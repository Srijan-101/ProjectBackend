const Router = require('express').Router();
const {createOutlet,getAllOutlet,getAllWorkerDetails,AddWorker,getOutletNumber,getOutletById,deleteWorker,AddMenu,GetMenu, DeleteMenu, UpdateMenu,AddTable,GetTable,DeleteTable} = require('../Controllers/outlet.controller');

const passport = require('passport');

Router.post('/CreateOutlet',passport.authenticate('jwt',{session:false}),createOutlet);

Router.get('/GetOutlet',passport.authenticate('jwt',{session:false}),getAllOutlet);
Router.get('/GetOutletNumber',passport.authenticate('jwt',{session:false}),getOutletNumber);
Router.get('/GetOutletbyId/:id',passport.authenticate('jwt',{session:false}),getOutletById);

Router.get('/GetWorker',passport.authenticate('jwt',{session:false}),getAllWorkerDetails)

Router.post('/AddWorker',passport.authenticate('jwt',{session:false}),AddWorker)
Router.delete('/DeleteWorker',passport.authenticate('jwt',{session:false}),deleteWorker)

//Menu
Router.post('/AddMenu',passport.authenticate('jwt',{session:false}),AddMenu);
Router.get('/GetMenu',passport.authenticate('jwt',{session:false}),GetMenu);
Router.delete('/DeleteMenu',passport.authenticate('jwt',{session:false}),DeleteMenu);
Router.put('/UpdateMenu',passport.authenticate('jwt',{session:false}),UpdateMenu);

//Table
Router.post('/AddTable',passport.authenticate('jwt',{session:false}),AddTable);
Router.get('/GetTable',passport.authenticate('jwt',{session:false}),GetTable)
Router.delete('/DeleteTable',passport.authenticate('jwt',{session:false}),DeleteTable);

module.exports = Router;