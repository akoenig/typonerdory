/*!
 * Typonerdory
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

Typonerdory.service('dataService', [
    '$q',
    '$http',

    function ($q, $http) {
        'use strict';

        var apiEndpoint = 'http://typonerdory-apiwrapper.rs.af.cm/?callback=JSON_CALLBACK',
            fonts;

        this.initialize = function () {
            var deferred = $q.defer();

            if (fonts === undefined) {
                $http.jsonp(apiEndpoint)
                    .success(function(data) {
                        fonts = data;

                        deferred.resolve(fonts);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
            } else {
                deferred.resolve(fonts);
            }

            return deferred.promise;
        };
    }
]);