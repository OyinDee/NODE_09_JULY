require('dotenv').config();
const mongoose = require("mongoose")
const express = require('express');
const PORT = 9000;
const app = express()
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const jwt  = require('jsonwebtoken')
const { loginController, tokenDecoder, signupController } = require('./controllers/auth.controller.js');
const { default: connect } = require('./controllers/connection.controller.js');
const cors = require('cors')
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const { viewEjs, viewLogin, viewRegister, viewIndex } = require('./controllers/views.controllers.js');

app.use(cors())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3000/'],
  credentials: true
}));
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
}).addListener('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.listen(PORT, ()=>{
    console.log('app is running on port ' + PORT)
})

app.set('view engine', 'ejs')
app.get('/', (request, response)=>{
    response.send('Hello World!')
})
app.post('/decodetoken', tokenDecoder)
app.post('/login', loginController)
app.post('/signup', signupController)

app.get('/index', viewIndex)
app.get('/register', viewRegister)
app.get('/login', viewLogin)
app.get('/ejs', viewEjs)