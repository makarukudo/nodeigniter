module.exports = new function() {
    
    this.tolower = function(str) {
        return str.toString().toLowerCase();
    }
    
    this.toupper = function(str) {
        return str.toString().toUpperCase();
    }
    
    this.ucfirst = function(str) {
        return this.toupper(str.toString().charAt(0)) + str.substring(1);
    }
    
}