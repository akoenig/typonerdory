/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.service('nameService', [
    function () {
        'use strict';

        var names = ['Valentina', 'Kimberley', 'Violetta',
                     'Leoni', 'Kim', 'Michael', 'Mia',
                     'Matthew', 'William', 'Ella', 'Grace'];

        this.generate = function (except) {
            var name = names[Math.floor(Math.random() * names.length)];

            // If the generated name equals the name in the except
            // parameter, we have to generate again.
            if (name === except) {
                return this.generate(except);
            } else {
                return name;
            }
        };
    }
]);