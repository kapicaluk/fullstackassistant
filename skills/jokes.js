module.exports = function(controller) {
  
controller.hears(['joke'], 'direct_message,direct_mention', function(
    bot,
    message
  ) {
    bot.startConversation(message, function(err, convo) {
      if (!err) convo.say(
        'Ok here goes a joke'
      );
      convo.ask('How many programmers does it take to change a light bulb?', function(response, convo) {
        convo.say('None – It’s a hardware problem')
        convo.next();
      });
    });
  });
controller.hears(['more'], 'direct_message,direct_mention', function(bot, message){
    bot.startConversation(message, function(err, convo){
        if(!err) convo.say('ok here goes another one...')
        convo.ask('What\'s ghost\'s favourite data type', function(response, convo){
            convo.say('Booooolean')
            convo.next();
        })
    })
})

};
