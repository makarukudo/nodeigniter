# nodeigniter
A fast and flexible [node.js](http://nodejs.org) framework built for node developers.

The website:  [nodeigniter](http://nodeigniter.co)

Inspired by Codeigniter

``` js
http://www.domain.com/[controller]/[function]/[param1]/[param2]/[etc]
```

Can be installed using NPM

``` js
npm install nodeigniter
```


It's easy to instantiate

``` js
var ni = require('nodeigniter');
```

Dependencies:

- connect
- ejs
- mongodb
- mongojs

How to run the app? The app.js is located in app folder

``` js
//if you're in the root directory

> node app\app.js

```

Customize the autoload in app/config/autoload.js

``` js
// currently available helpers
this.helpers = ['security','array','url', 'string', 'html', 'form'];

//or load the helper in the controller
var ni = require('nodeigniter');

//either string
ni.load_helper('array');

//or array
ni.load_helper(['array', 'url']);

```

Customize the autoload in app/config/routes.js

``` js
// set your custom routes here
this.route = [
    {src: '/sign_up', dest: '/main/sign_up', method: ['GET','POST']},
    {src: '/sign_in', dest: '/main/sign_in', method: ['GET','POST']}
];
```

How to set the config variables?

``` js
// config variable setting
var ni = require('nodeigniter');

//setter
ni.config('some-name', 'value');

//getter
var val = ni.config('some-name');

```

How to access helpers in the controller?

``` js
// config variable setting
var ni = require('nodeigniter');

//from url helper
ni.fn.site_url();


//from html helper
ni.fn.anchor();


//to view availabe functions
console.log(ni.fn);

```

Working on forms?

``` js
// config variable setting
var ni = require('nodeigniter');

//validation library
ni.load_librray('validation');

//set the rules - same with codeigniter
ni.validation.set_rules('name', 'display', 'required|valid_email|max_length[30]');

//to execute
if (ni.validation.run()) {
    some function
} else {
    some function
}

//writing form fields to the view and setting the values

{{= 
    form_open('') + 
    form_input('name', set_value('name'), {class: 'someclass', maxlength: 30}) + 
    form_submit('submit', 'Submit')
}}


//accessing the request variables

var username = ni.input.req_vars.username;
var password = ni.fn.sha1(ni.input.req_vars.password);

//you can also use any functions

```


How to use mongodb support?

``` js
// config variable setting
var ni = require('nodeigniter');

var db = ni.db('dbname','collectioname');

db.collectioname.save({test: 'test'});
```

How to render the view? I use the ejs templating system. It allows helper functions to be accessed locally on the view

``` js
// setting the partial pages and render, allows chaining

var ni = require('nodeigniter');

// file should be located in the views folder under app: app/views
ni.partial('main.ejs').render();

//you can also put the file into a sub folder
ni.partial('subfolder/main.ejs').render();

//or this
ni.partial('section/header.ejs').partial('subfolder/main.ejs').render();

```

view exaample app/views/section/header.ejs

``` js
{{= doctype('html5') }}
<html lang="en">
    <head>
        <title>Nodeigniter - Fast and flexible node framework</title>
        {{= link_tag('css/bootstrap.min.css?timestamp='+Number(new Date())) }}
        {{= link_tag('css/custom.css?timestamp='+Number(new Date())) }}
        {{= script_tag('js/jquery-1.4.6.min.js?timestamp='+Number(new Date())) }}
        {{= script_tag('js/jquery.tmpl.js?timestamp='+Number(new Date())) }}
    </head>

//use the curly braces
{{= some_function or some vars }}
```

For more details [the nodeigniter framework](http://www.nodeigniter.co)

Created by: Michael Brucal

Email @ epson.code@gmail.com
