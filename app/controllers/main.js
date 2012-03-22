var ni = require('nodeigniter');

module.exports = new function() {
    
    this.index = function(req, res, next) {
        ni.partial('section/header.ejs')
            .partial('main/main.index.ejs')
            .render();
    }
    
};