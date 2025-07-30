const viewIndex =  (request, response)=>{
    response.sendFile(__dirname + '/index.html');
}

const viewRegister = (request, response) => {
    response.render('register');
}

const viewLogin = (request, response) => {
    response.render('login');
}

const viewEjs = (request, response) => {
    response.render('index');
}

export { viewIndex, viewRegister, viewLogin, viewEjs };