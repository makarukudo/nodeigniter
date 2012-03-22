var ni = require('nodeigniter'),
    connect = require('connect');

ni.config('default_route', 'main');
ni.config('root', __dirname);
ni._initialize(function(){
    connect.createServer(
        connect.bodyParser(),
        connect.static('public'),
        connect.query(), 
        connect.cookieParser('sukilab_connect'),
        connect.session({secret: 'slabs',cookie: {maxAge: 36000}}),
        ni.router,
        ni.not_found
    ).listen(80);
    console.log('Application Started on Port: '+80);
});