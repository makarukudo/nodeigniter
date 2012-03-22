var ni = require('nodeigniter');

module.exports = new function() {
    
    this.form_open = function(action, attr) {
        def = ni.fn.merge({name: 'form', method: 'POST', action: (action.length > 0 ? action: ni.input.url)}, attr);
        return '<form '+ni.fn.attr(def)+'>';
    }
    
    this.form_input = function(name, value, attr) {
        if (name!=undefined && value!=undefined) {
            def = ni.fn.merge({name: name, value: value, type: 'text', maxlength: 50}, attr);
            return '<input '+ni.fn.attr(def)+'>';
        } else {
            return '';
        }
    }
    
    this.form_password = function(name, value, attr) {
        if (name!=undefined && value!=undefined) {
            def = ni.fn.merge({name: name, value: value, type: 'password', maxlength: 50}, attr);
            return '<input '+ni.fn.attr(def)+'>';            
        } else {
            return '';
        }
    }
    
    this.form_label = function(value, label_for, attr) {
        if (value!=undefined && label_for!=undefined) {
            def = ni.fn.merge({'for': 'label_for'}, attr);
            return '<label '+ni.fn.attr(def)+'>'+value+'</label>';
        } else {
            return '';
        }
        
    }
    
    this.validation_errors = function(separator, attr) {
        var errors = ni.validation.errors.join((separator!=undefined) ? separator :'<br />');        
        ni.validation.errors = [];
        return (errors.length > 0) ? ni.fn.tag('div', errors, attr) : '';
    }
    
    this.form_select = function(name, options, value, attr) {
        
        if (name!=undefined && typeof(options)=='object' && value!=undefined) {
            var opts = '';
            for (var key in options) {
                var selected = (key.toString()==value.toString()) ? ' selected="selected"' : '';
                opts += '<option value="'+key+'"'+selected+'>'+options[key]+'</option>';                    
            }
            def = ni.fn.merge({name: name}, attr);
            return '<select '+ni.fn.attr(def)+'>'+opts+'</select>';
        } else {
            return '';
        }
    }    
    
    this.form_submit = function(name, value, attr) {
        def = ni.fn.merge({name: name, value: value, type: 'submit'}, attr);
        return '<input '+ni.fn.attr(def)+'>';
    }
    
    this.set_value = function(field) {
        return (ni.input.req_vars[field]!==undefined) ? ni.input.req_vars[field] : '';
    }
    
    this.form_close = function() {
        return '</form>';
    }
    
}