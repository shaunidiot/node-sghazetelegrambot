var ping = function(){

    this.init = function(){

    };

    this.doStop = function(done){
        done();
    };


    this.doMessage = function (msg, reply){
        if (msg.text.toLowerCase() == "ping")
            reply({type: 'text', text: 'pong'}); 
    };

};

module.exports = ping;
