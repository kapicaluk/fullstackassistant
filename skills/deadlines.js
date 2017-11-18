module.exports = function(controller) {
  controller.hears(['resume'], 'direct_message,direct_mention', function(
    bot,
    message
  ) {
    bot.reply(
      message,
      'Your resume is due '
    );
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
  controller.hears(['PEP', 'Personal Enrichment Project'], 'direct_message,direct_mention', function(
    bot,
    message
  ) {
    bot.reply(message, 'Your Personal Enrichment Project is due on 11/16th');
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
