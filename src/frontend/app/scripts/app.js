/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

'use strict';

var Typonerdory = angular.module('Typonerdory', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .when('/play', {
                templateUrl: 'views/play.html',
                controller: 'PlayController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);