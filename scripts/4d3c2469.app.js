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

Typonerdory.run([
    '$rootScope',
    'titleService',

    function ($rootScope, titleService) {
        $rootScope.$on('$routeChangeStart', function(scope, next, current) {
            var section,
                title = 'Typonerdory » ';

            switch (next.$route.controller) {

            case 'HomeController':
                section = 'home';
                title = title + 'Hello';
            break;

            case 'PlayController':
                section = 'play';
                title = title + 'The Game';
            break;
            }
            
            titleService.set(title);
            $rootScope.section = section;
        });
    }
]);