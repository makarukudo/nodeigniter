var fs = require('fs'),
    utils = require('connect').utils;

var nodeigniter = function() {
    
    var self = this;
    this.output = ''; // for page rendering
    this.config = {}; // for configuration
    this.locals = {}; // for local vars, helpers
    this.logger = []; // for logging
    this.autoload = {}; // for autoloaded resources
    this.fn = {};
    this.controllers = {};
    this.custom_routes = [];
    this.input = {};
    this.session = {};
    this.subscribed = 0; //total number of connections
    
    //initialize nodeigniter
    this._initialize = function(callback) {
        try {
            self.config('system_dir', __dirname);
            self.load_controller();
            self._autoload();
            callback();
            console.log('Initialization Successful');
        } catch (err) {
            console.log('Initialization Failed %j', err);
        }
    }
    
    //autoload resources
    this._autoload = function() {        
        try {
            //autoload from config/autoload.js
            //helpers
            var autoload = require(this.config('root') + '/config/autoload.js');
            if (autoload['helpers'].length > 0) {
                self.load_helper(autoload['helpers']);
            }
            
            //defined routes from config/routes.js
            var routes = require(this.config('root') + '/config/routes.js');
            if (routes['route'].length > 0) {
                for (var i in routes['route']) {
                    var route = routes['route'][i];
                    self._createRoute(route.src, route.dest, route.method);
                }
            }
            console.log('Autoloading Successful');
        } catch(err) {
            console.log('Autoloading Resources Failed - %j', err);
        }
    }
    
    //for config
    this.config = function(name, value) {
        if (typeof(name) != 'undefined' && typeof(value) != 'undefined') {
            // This is a setter
            this.config[name] = value;
            return true;
        }
        else if (typeof(name) != 'undefined') {
            // This is a getter
            return this.config[name];
        }
        else {
            return null;
        }
    }    
    
    //create routes
    this._createRoute = function (source, destination, method) {
        if (source!=undefined && destination!=undefined) {
            self.custom_routes.push({src: source, dest: destination || '/', method: method || false});
        }
    }
    
    //matching custom routes
    this._checkRoutes = function (path, method) {
                
        var routes = self.custom_routes;
        if (routes.length == 0) {return path};
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var methodMatch = !route.method;
            
            if (path==route.src) {
                if (Array.isArray(route.method)) {
                    for (var i in route.method) {
                        if (route.method[i].toUpperCase() === method) {
                            methodMatch = true;
                        };
                    }
                } else {methodMatch = true;}
                if (methodMatch) return route.dest;
            }
        }
        return path;
    }    
    
    this._input = function(req, res) {
        self.input['headers'] = req.headers;
        self.input['method'] = req.method;
        self.input['req_vars'] = (req.method=='GET') ? req.query : req.body;
        self.input['url'] = req.url;
        self.input['origUrl'] = req.originalUrl;
        self.input['cookies'] = req.cookies;
        self.subscribed = req.client.server.connections;
        self.session = req.session;
        self.res = res;
    }
    
    //custom router
    this.router = function(req, res, next) {
        var start = Number(new Date());
        
        self._input(req, res);        
        var parsedUrl = require('url').parse(req.url, true);
        var pathArr, args, controller, fn;
        
        //check if path is available in the added routes
        parsedUrl = self._checkRoutes(parsedUrl.pathname, req.method);
        parsedUrl = (parsedUrl.indexOf('/') !== 0) ? '/'+parsedUrl : parsedUrl;
        
        pathArr = parsedUrl.split('/');
        args = pathArr.slice(3);
        res.self = {};

        args.unshift(req, res, next);

        if (pathArr[1]) {
            controller = self.controllers[pathArr[1]];
            if (controller) {
                res.self.controller = pathArr[1];
                res.self.action = (pathArr[2]) ? pathArr[2] : 'index';
                fn = (pathArr[2]) ? controller[pathArr[2]] : controller.index;
                
                if (typeof(controller.__init) === 'function' && fn) {
                    args.unshift(function () {
                        args.shift();
                        fn.apply(null, args);
                    });
                    controller.__init.apply(null, args);
                } else if (fn) {
                    fn.apply(null, args);
                } else {
                    res.self.controller = undefined;
                    res.self.action = undefined;
                    next();
                }
            }
            else {
                next();
            }
        }
        else {
            controller = self.controllers.main;
            if (controller && controller.index) {
                res.self.controller = self.config('default_route') || 'main';
                res.self.action = 'index';
                
                if (typeof(controller.__init) === 'function') {
                    controller.__init(function () {
                        controller.index(req, res, next);
                    }, req, res, next);
                } else {
                    controller.index(req, res, next);
                }
            }
            else {
                next();
            }
        }
        var end = Number(new Date());
        console.log('Response: %j ms', end - start);
    }
    
    //creates a partial view
    this.partial = function(filename, options) {
        var content = fs.readFileSync(self.config('root')+'/views/'+filename, 'utf-8');
        //load the local vars added to the options
        self.locals = utils.merge(self.locals, options);
        self.output += content;
        return this;
    }
    
    //render the entire page
    this.render = function() {
        var ejs = require('ejs');
        ejs.open = '{{';
        ejs.close = '}}';
        var opts = utils.merge(self.locals, self.fn);
        self.output = ejs.render(self.output, opts);
        self.res.end(self.output, 'utf-8');
        self.output = '';
    }
    
    this.not_found = function(req, res, next) {
        var content = fs.readFileSync(self.config('root')+'/error/not_found.js', 'utf-8');
        res.end(content, 'utf-8');
    }
    
    this.load_model = function(name) {
        self.model[name] = require(self.config('root')+'/models/'+name+'.js');
    }
    
    this.load_library = function(name) {
        self[name] = require('nodeigniter/system/libraries/'+name+'.js');
        return this;
    }
    
    this.load_helper = function(name) {
        var _dir = 'nodeigniter/system/helpers/';
        if (typeof(name)==='object') {
            for (var i in name) { 
                self.fn = utils.merge(self.fn, require(_dir + name[i] + '.js')); 
            }
        } else {
            self.fn = utils.merge(self.fn, require(_dir + name + '.js'));
        }
    }

    this.load_controller = function() {
        var _dir = self.config('root')+'/controllers';
        fs.readdir(_dir, function(err, files){
            files.forEach(function(file){
                if (!/~$/.test(file)) {
                    var name = file.split('.')[0];
                    self.controllers[name] = require(_dir + '/' + file);
                }
            });
        });
    }
};

exports = module.exports = new nodeigniter();
exports.db = function(db, name) {
    if (db!=undefined && name!=undefined) {
        return require('mongojs').connect(db, [name]);        
    } else {
        return null;
    }
}