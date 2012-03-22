module.exports = new function() {
    
    this.merge = function(a, b){
        if (a && b) {
            for (var key in b) {
                a[key] = b[key];
            }
        }
        return a;
    }
    
}