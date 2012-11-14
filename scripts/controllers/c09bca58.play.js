/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.controller('PlayController', [
    '$rootScope',
    '$scope',
    'dataService',
    'gameService',

    function($rootScope, $scope, dataService, gameService) {
        'use strict';

        dataService.initialize().then(function (fonts) {
            $rootScope.fonts = fonts;

            $scope.game = gameService.start($rootScope.fonts);
        });

        $scope.selectDeck = function (id) {
            gameService.selectDeck(id);
        };
    }
]);