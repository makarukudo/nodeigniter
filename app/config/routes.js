module.exports = new function() {
    
    //add routes here
    this.route = [
        {src: '/sign_up', dest: '/main/sign_up', method: ['GET','POST']},
        {src: '/sign_in', dest: '/main/sign_in', method: ['GET','POST']}
    ];
    
}