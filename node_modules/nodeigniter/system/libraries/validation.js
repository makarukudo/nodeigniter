var ni = require('nodeigniter');

module.exports = new function() {
        
    var v = this;
    this.rules = [];
    this.errors = [];
    this.req_vars = {};

    this.set_rules = function(name, display, rules) {
        v.rules.push({name: name, display: display, rules: rules});
        return this;
    }
    
    this.display_errors = function() {
        return this.errors.join('<br />');
    }
    
    this.run = function() {
        
        this.errors = [];
        this.req_vars = ni.input.req_vars;
        
        for (var k in this.rules) {
            var field = v.rules[k];
            
            if (this.req_vars[field.name]!=undefined) {
                field.value = this.req_vars[field.name];
            
                //split the rules
                var rules = field.rules.split('|');
                var failed = false;
                
                for (var i in rules) {
                    
                    var method = rules[i];
                    var param = null;
                    
                    //check if has param
                    var parts = ruleRegex.exec(method)
                    if (parts) {
                        method = parts[1];
                        param = parts[2];
                    }
                    
                    if (typeof(_hooks[method])=='function') {
                        if (!_hooks[method].apply(this, [field, param])) {
                            failed = true;
                        }
                    }
                    
                    if (typeof(ni.fn[method])=='function') {
                        field.value = ni.fn[method].apply(this, [field.value]);
                        if (ni.input.method=='GET') {
                            ni.input.req_vars[field] = field.value;
                        } else {
                            ni.input.req_vars[field] = field.value;
                        }
                    }
                    
                    if (failed) {
                        var source = defaults.messages[method];
                        var message = source.replace('%s', field.display);
                        if (param) {
                            message = message.replace('%s', param);
                        }
                        this.errors.push(message);                       
                        break;
                   }
                   
                }                
            }
        }
        this.rules = [];
        return (this.errors.length==0) ? true : false;
    }    
    
    
var defaults = {
    messages: {
        required: 'The %s field is required.',
        matches: 'The %s field does not match the %s field.',
        valid_email: 'The %s field must contain a valid email address.',
        valid_emails: 'The %s field must contain all valid email addresses.',
        min_length: 'The %s field must be at least %s characters in length.',
        max_length: 'The %s field must not exceed %s characters in length.',
        exact_length: 'The %s field must be exactly %s characters in length.',
        greater_than: 'The %s field must contain a number greater than %s.',
        less_than: 'The %s field must contain a number less than %s.',
        alpha: 'The %s field must only contain alphabetical characters.',
        alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
        alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
        alpha_space: 'The %s field should only contain alpha characters and spaces.',
        alpha_extra: 'The %s field may only contain alpha-numeric characters, spaces, periods, underscores, and dashes.',
        numeric: 'The %s field must contain only numbers.',
        integer: 'The %s field must contain an integer.',
        decimal: 'The %s field must contain a decimal number.',
        is_natural: 'The %s field must contain only positive numbers.',
        is_natural_no_zero: 'The %s field must contain a number greater than zero.',
        is_date: 'The %s field must contain the format YYYY-MM-DD',
        valid_ip: 'The %s field must contain a valid IP.',
        valid_base64: 'The %s field must contain a base64 string.'
    },
    callback: function(errors) {

    }
};    
var ruleRegex = /^(.+)\[(.+)\]$/,
    numericRegex = /^[0-9]+$/,
    integerRegex = /^\-?[0-9]+$/,
    decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
    emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
    alphaRegex = /^[a-z]+$/i,
    alphaNumericRegex = /^[a-z0-9]+$/i,
    alphaDashRegex = /^[a-z0-9_-]+$/i,
    alphaSpace = /^([a-zA-Z\s])+$/i,
    alphaExtra = /^([\.\s-a-zA-Z0-9_-])+$/i,
    naturalRegex = /^[0-9]+$/i,
    naturalNoZeroRegex = /^[1-9][0-9]*$/i,
    ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
    isDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    base64Regex = /[^a-zA-Z0-9\/\+=]/i;

var _hooks = {
        required: function(field) {
            return (field.value!=null && field.value!='');
        },

        matches: function(field, matchName) {
            if (v.req_vars[matchName]!=undefined) {
                return field.value === v.req_vars[matchName];
            }
            return false;
        },

        valid_email: function(field) {
            return emailRegex.test(field.value);
        },

        valid_emails: function(field) {
            var result = field.value.split(",");
            
            for (var i = 0; i < result.length; i++) {
                if (!emailRegex.test(result[i])) {
                    return false;
                }
            }
            
            return true;
        },

        min_length: function(field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }

            return (field.value.length >= length);
        },

        max_length: function(field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }

            return (field.value.length <= length);
        },

        exact_length: function(field, length) {
            if (!numericRegex.test(length)) {
                return false;
            }
            
            return (field.value.length === length);
        },

        greater_than: function(field, param) {
            if (!decimalRegex.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) > parseFloat(param));
        },

        less_than: function(field, param) {
            if (!decimalRegex.test(field.value)) {
                return false;
            }

            return (parseFloat(field.value) < parseFloat(param));
        },

        alpha: function(field) {
            return (alphaRegex.test(field.value));
        },

        alpha_numeric: function(field) {
            return (alphaNumericRegex.test(field.value));
        },

        alpha_dash: function(field) {
            return (alphaDashRegex.test(field.value));
        },
        
        alpha_space: function(field) {
            return (alphaSpace.test(field.value));
        },
        
        alpha_extra: function(field) {
            return (alphaExtra.test(field.value));
        },

        numeric: function(field) {
            return (decimalRegex.test(field.value));
        },

        integer: function(field) {
            return (integerRegex.test(field.value));
        },

        decimal: function(field) {
            return (decimalRegex.test(field.value));
        },

        is_natural: function(field) {
            return (naturalRegex.test(field.value));
        },

        is_natural_no_zero: function(field) {
            return (naturalNoZeroRegex.test(field.value));
        },

        valid_ip: function(field) {
            return (ipRegex.test(field.value));
        },

        valid_base64: function(field) {
            return (base64Regex.test(field.value));
        },
        
        is_date: function(field) {
            return (isDateRegex.test(field.value));
        }
        
    };    
    
}

