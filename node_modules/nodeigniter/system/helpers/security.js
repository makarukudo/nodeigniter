var crypto = require('crypto');

module.exports = new function() {
    
    this.md5 = function(str, encoding){
        return crypto
            .createHash('md5')
            .update(str)
            .digest(encoding || 'hex');
    };

    /**
     * encoding: hex | base64 | binary
     */
    this.sha1 = function(str, encoding) {
        return crypto
            .createHash('sha1')
            .update(str)
            .digest(encoding || 'hex');        
    }
    
}