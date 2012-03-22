var ni = require('nodeigniter');

module.exports = new function() {
    
    this.site_url = function(url) {
        var protocol = /http:\/\//gi.test(url) ?  '' : 'http://'+ni.input.headers.host+'/';
        return protocol+(url.length > 0 ? url : '');
    }
    
    this.base_url = function() {
        return ni.input.headers.host;
    }
    
    this.current_url = function() {
        return this.site_url(ni.input.url.substring(1, ni.input.url.length));
    }
    
}