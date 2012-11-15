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
     Settings = require('settings'),
     underscore = require('underscore'),
     uuid = require('node-uuid');

(function () {
    'use strict';

    var CACHE_TIMEOUT = 180000,
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
        var count = parseInt(req.query.count, 10) || 8;

        if (!fonts) {
            request(GOOGLE_WEB_FONTS_ENDPOINT, function (error, response, body) {
                var i = 0,
                    item;

                if (!error && response.statusCode === 200) {
                    body = JSON.parse(body);
                    body = underscore.shuffle(body.items);

                    fonts = [];

                    for (i; i < count; i = i + 1) {
                        item = body[i];

                        fonts.push({
                            id: 'font-' + uuid.v4(),
                            family: item.family,
                            variant: item.variants[0]
                        });
                    }

                    res.jsonp(fonts);
                } else {
                    body = JSON.parse(body);
                    res.jsonp(body, 500);
                }
            });
        } else {
          res.jsonp(fonts);
        }
    });
}());
