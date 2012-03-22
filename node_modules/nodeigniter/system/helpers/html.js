var ni = require('nodeigniter');

module.exports = new function() {
    
    this.attr = function(attrs) {
        var attr = '';
        if (typeof(attrs)=='object') {
            for (var key in attrs) {
                attr += key+'="'+attrs[key]+'" ';
            }
        }
        return attr;
    }
    
    this.tag = function(tag, content, attr) {
        return '<'+tag+' '+this.attr(attr)+'>'+content+'</'+tag+'>';
    }

    this.link_tag = function(filename, options) {
        var def = {href: ni.fn.site_url(filename), type: 'text/css', rel: 'stylesheet'};
        return '<link '+this.attr(def)+'/>';
    }
    
    this.script_tag = function(filename, options) {
        var def = {src: ni.fn.site_url(filename), type: 'text/javascript', language: 'javascript'};
        return '<script '+this.attr(def)+'></script>';
    }
    
    this.doctype = function(type) {
        var doctypes = {html5:'<!DOCTYPE html>'};
        return (doctypes[type]!=undefined) ? doctypes[type] : doctypes['html5'];
    }
    
    this.image = function(url, options) {
        if (url!=undefined) {
            var def = {src: ni.fn.site_url(url), alt: ''};
            return '<img '+this.attr(def)+'/>';
        }
    }
    
    this.anchor = function(url, value, options) {
        if (url!=undefined && value!=undefined) {
            def = ni.fn.merge({href: ni.fn.site_url(url)}, options);
            return '<a '+this.attr(def)+'>'+value+'</a>';
        }
    }
    
}