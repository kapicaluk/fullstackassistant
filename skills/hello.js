/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

module.exports = function(controller) {
  controller.hears(['^hello$'], 'direct_message,direct_mention', function(
    bot,
    message
  ) {
    bot.reply(message, "Hi there! I'm here help you during your time at Fullstack");
    controller.on('direct_message,direct_mention,mention', function(
      bot,
      message
    ) {
      controller.studio
        .runTrigger(bot, message.text, message.user, message.channel)
        .catch(function(err) {
          bot.reply(
            message,
            'I experienced an error with a request to Botkit Studio: ' + err
          );
        });
    });
  });
};
