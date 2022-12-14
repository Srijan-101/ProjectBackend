const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors')

require('dotenv').config();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

//Importing Routes
const userRoutes = require('./Routes/user.routes');
const outletRoutes = require('./Routes/outlet.routes');
const orderRoutes = require('./Routes/order.routes');
const salesRoutes = require('./Routes/sales.routes');
 
//Passport middleware
app.use(passport.initialize());

//passport 
require('./Routes/Config/passport')(passport);

//Routes
app.use('/api',userRoutes);
app.use('/api',outletRoutes);
app.use('/api',orderRoutes);
app.use('/api',salesRoutes);


app.listen(process.env.PORT,()=>{
     console.log("Server running at port",process.env.PORT)
})