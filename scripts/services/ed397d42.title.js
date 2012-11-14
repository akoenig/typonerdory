/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.service('titleService', [
    '$window',

    function ($window) {
        'use strict';

        this.set = function (newTitle) {
            $window.document.title = newTitle;
        };

        this.get = function () {
            return $window.document.title;
        };
    }
]);