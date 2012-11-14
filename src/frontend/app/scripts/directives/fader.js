/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.directive('fader', [function () {
    'use strict';

    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            $(elm[0])
                .css({ opacity: 0 })
                .animate({ opacity: 1 }, parseInt(attrs.fader, 10), 'ease-out');
        }
    };
}]);