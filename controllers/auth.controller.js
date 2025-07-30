import nodemailer from 'nodemailer';
const signupController = (request, response) => {
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
}

const loginController = (request, response)=>{
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
                jwt.sign({ user: user}, process.env.JWT_SECRET, { expiresIn: '10m' }, (err, token) => {
                    console.log(token)
                })
                response.status(200).send(`Welcome ${user.username}`);
            }
            else{
                // console.log({ passwordInput: userData.password, Foundpassword: user.password });
                response.status(401).send('Incorrect password');
            }

        }
    })
}

const tokenDecoder =  (request, response)=>{
    const token = request.body.token;
    console.log(token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(401).send(
                'Invalid token');
        }
        response.status(200).send(decoded);
    });
}
export { signupController, loginController, tokenDecoder };