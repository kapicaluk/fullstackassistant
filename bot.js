const env = require('node-env-file');
env(__dirname + '/.env');

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}
const http = require('http')
const slackToken = process.env.slackkey

const Botkit = require('botkit');
const debug = require('debug')('botkit:main');


const bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    studio_token: process.env.studioToken,
    // debug: true,
    scopes: ['bot']
};

const luisOptions = { serviceUri: process.env.serviceUri };


bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);
controller.startTicking();
//Weather 
controller.hears(
    ['weather in (.*)', '(.*) weather'],
    'direct_message,direct_mention,mention',
    function(bot, message) {
      let cityUrl = message.match[1].split(' ').join('');
      let city = message.match[1]
      console.log('city: ' + city);
      if (undefined === city || '' === city || null === city) {
        bot.reply(
          message,
          "Are't you forgot the city name? I am really sorry, currently I can't guess your city."
        );
      } else {
        const options = {
          protocol: 'http:',
          host: 'api.openweathermap.org',
          path:
            '/data/2.5/weather?q=' +
            cityUrl +
            '&appid='+ process.env.weatherKey,
          port: 80,
          method: 'GET'
        };
        var request = http.request(options, function(response) {
          var body = '';
          response.on('data', function(data) {
            body += data;
            weather = JSON.parse(body);
            console.log('weather :' + weather.weather[0].main);
            bot.reply(
              message,
              'It\'s ' + weather.weather[0].main + ' in ' + city
            );
            var reaction = '';
            switch (weather.weather[0].main) {
              case 'Clear':
                reaction = 'mostly_sunny';
                bot.reply(message, ':' + reaction + ':');
                bot.reply(message, "Bring your shades. It's sunny");
                break;
              case 'Clouds':
              case 'Cloud':
                reaction = 'cloud';
                bot.reply(message, ':' + reaction + ':');
                break;
              case 'Smoke':
                reaction = 'smoking';
                bot.reply(message, ':' + reaction + ':');
                break;
              case 'Rain':
                reaction = 'rain_cloud';
                bot.reply(message, ':' + reaction + ':');
                bot.reply(message, 'Bring your raincoat. It may rain in ' + city);
                break;
              case 'Mist':
                reaction = 'fog';
                bot.reply(message, ':' + reaction + ':');
                bot.reply(message, "It's misty " + city);
                break;
              case 'Thunderstorm':
                reaction = 'thunder_cloud_and_rain';
                bot.reply(message, ':' + reaction + ':');
                bot.reply(message, "It's raining cats and dogs " + city);
                break;
              default:
                console.log(message)
            }
            bot.api.reactions.add(
              {
                timestamp: message.ts,
                channel: message.channel,
                name: reaction
              },
              function(err, res) {
                if (err) {
                  bot.botkit.log('Failed to add emoji reaction :(', err);
                }
              }
            );
          });
          response.on('end', function() {
            /*res.send(JSON.parse(body));*/
          });
        });
        request.on('error', function(e) {
          console.log('Problem with request: ' + e.message);
          bot.reply(
            message,
            "sorry, couldn't find weather info for city " + city
          );
        });
        request.end();
      }
    }
  );

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

const normalizedPath = require('path').join(__dirname, 'skills');
require('fs').readdirSync(normalizedPath).forEach(function(file) {
  require('./skills/' + file)(controller);
});

