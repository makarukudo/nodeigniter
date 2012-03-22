
module.exports = new function() {

    this.counter = function(start, end, order) {
        if (start && end) {
            var count = {};
            if (order=='desc') {
                for (var i=end; i>=start; i--) {
                    count[i] = i;
                }
            } else {
                for (var i=start; i<=end; i++) {
                    count[i] = i;
                }
            }
            return count;
        } else {
            return {};
        }
    }
    
}