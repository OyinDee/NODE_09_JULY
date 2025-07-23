const express = require('express');
const PORT = 9000;
const app = express()
const ejs = require('ejs');
require('dotenv').config();
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})
const User = mongoose.model('User', userSchema);



const connect = mongoose.connect(uri) 
connect.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.listen(PORT, ()=>{
    console.log('app is running on port something')
})

app.set('view engine', 'ejs')
app.get('/', (request, response)=>{
    response.send('Hello World!')
})

app.post('/login', (request, response)=>{
    const userData = {
        username: request.body.username,
        password: request.body.password
    }
    console.log(userData);
    User.findOne({username: userData.username})
    .then(user => {
        console.log(user);
        if(!user || user==null){
            return response.status(404).send('User not found; Please register!');
        }
        else{
            // console.log('User found:', user);
            if(user.password==userData.password){
                response.status(200).send(`Welcome ${user.username}`);
            }
            else{
                // console.log({ passwordInput: userData.password, Foundpassword: user.password });
                response.status(401).send('Incorrect password');
            }

        }
    })
})

app.post('/signup', (request, response)=>{
    console.log(request.body);
    const email = request.body.email;
    const newUser = new User(request.body);
    newUser.save()
    .then(() => {
        console.log('User saved successfully');
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    
    const mailOptions ={
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to Our Service',
        // text: 'Thank you for signing up for our service!',
        html: `<h1>Dear ${request.body.username},</h1><br><p>Thank you for signing up for our service!</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return response.status(500).send('Error sending email: ' + error.message);
        }
        // response.status(200).send('Email sent successfully: ' + info.response);
        console.log('Email sent successfully: ' + info.response);
    });
        response.redirect('login');
    })
    .catch((err) => {
        console.error('Error saving user:', err);
        response.status(500).send(`Error saving user: ${err.message}`);
    });
}) 

app.get('/index', (request, response)=>{
    response.sendFile(__dirname + '/index.html');
})


app.get('/register', (request, response)=>{
    response.render('register')
})

app.get('/login', (request, response)=>{
    response.render('login')
})
app.get('/ejs', (request, response)=>{
    response.render('index')
})