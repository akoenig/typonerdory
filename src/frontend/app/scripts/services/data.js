/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.service('dataService', [

    '$q'

    function ($q) {
        'use strict';

        var apiEndpoint = '',
            fonts;

        this.initialize = function () {
            var deferred = $q.defer();

            if (fonts === undefined) {
                $http({
                    method: 'JSONP',
                    url: apiEndpoint
                })
                .success(function(data) {
                    fonts = data;

                    deferred.resolve(fonts);
                });
            } else {
                deferred.resolve(fonts);
            }

            return deferred.promise;
        }
    }
]);