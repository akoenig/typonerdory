/*!
 * Typonerdory - google-web-fonts-wrapper
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */
 var express = require('express'),
     http = require('http'),
     pkg = require('./package.json'),
     request = require('request'),
     Settings = require('settings');

(function () {
    'use strict';


    var CACHE_TIMEOUT = 300000,
        GOOGLE_WEB_FONTS_ENDPOINT = 'https://www.googleapis.com/webfonts/v1/webfonts?',
        app = express(),
        config = {},
        fonts;

    app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
    });

    //
    // Load the application configuration
    //
    try {
        config.environment = new Settings(__dirname + '/environment.js').environment;

        app.set('port', process.env.PORT || config.environment.port);

        GOOGLE_WEB_FONTS_ENDPOINT = GOOGLE_WEB_FONTS_ENDPOINT + '?key=' + config.environment.apiKey;

    } catch (e) {
        console.log(e);
        console.log('[ERROR] Application is not configured. Verify your config directory.');
        return;
    }

    http.createServer(app).listen(app.get('port'), function(){
        console.log(pkg.name + " server listening on port " + app.get('port'));
    });

    setInterval(function () {
        fonts = undefined;
    }, CACHE_TIMEOUT);

    app.get('/', function (req, res) {
        if (!fonts) {
            request(GOOGLE_WEB_FONTS_ENDPOINT, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    fonts = JSON.parse(body);

                    res.jsonp(fonts);
                }
            });
        } else {
          res.jsonp(fonts);
        }
    });
}());