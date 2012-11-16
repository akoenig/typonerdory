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

    var GOOGLE_WEB_FONTS_ENDPOINT = 'https://www.googleapis.com/webfonts/v1/webfonts',
        app = express(),
        config = {},
        fonts = [],
        privates = {};

    //
    // Method for loading the configuration from the environment file.
    //
    privates.loadConfiguration = function () {
        var config = {};

        try {
            config.environment = new Settings(__dirname + '/environment.js').environment;

            app.set('port', process.env.PORT || config.environment.port);

            GOOGLE_WEB_FONTS_ENDPOINT = GOOGLE_WEB_FONTS_ENDPOINT + '?key=' + config.environment.apiKey;
        } catch (e) {
            console.log(e);
            console.log('[ERROR] Application is not configured. Verify your config directory.');
            return;
        }

        return config;
    };

    //
    // API communication for grabbing the fonts.
    //
    privates.grabFonts = function (count, cb) {
        request(GOOGLE_WEB_FONTS_ENDPOINT, function (error, response, body) {
            var i = 0,
                fonts;

            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                fonts = underscore.shuffle(body.items);

                for (i; i < count; i = i + 1) {
                    fonts[i] = {
                        id: 'font-' + uuid.v4(),
                        family: fonts[i].family,
                        variant: fonts[i].variants[0]
                    };
                }

                cb(null, fonts.slice(0, count));
            } else {
                body = JSON.parse(body);
                cb(body);
            }
        });
    };

    //
    // Express configuration.
    //
    app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
    });

    config = privates.loadConfiguration();

    //
    // Cache clear interval
    //
    setInterval(function () {
        fonts = [];
    }, config.environment.emptyCache);

    //
    // Routes.
    //
    app.get('/', function (req, res) {
        var count = parseInt(req.query.count, 10) || 8;

        if (fonts.length !== count) {
            privates.grabFonts(count, function (error, grabbedFonts) {
                if (error) {
                    res.jsonp(error, 500);
                } else {
                    fonts = grabbedFonts;

                    res.jsonp(fonts);
                }
            });
        } else {
          res.jsonp(fonts);
        }
    });

    http.createServer(app).listen(app.get('port'), function(){
        console.log(pkg.name + " server listening on port " + app.get('port'));
    });
}());