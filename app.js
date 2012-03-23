var ni = require('nodeigniter'),
    connect = require('connect');

ni.config('root', __dirname + '/app');
ni._initialize(function(){
    connect.createServer(
        connect.bodyParser(),
        connect.static('public'),
        connect.query(), 
        connect.cookieParser('ni_cookie'),
        connect.session({secret: 'kM43QtvEhmhH2KK9sJac',cookie: {maxAge: 36000}}),
        ni.router,
        ni.not_found
    ).listen(80);
    console.log('Application Started on Port: '+80);
});