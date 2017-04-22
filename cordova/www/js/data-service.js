(function(window, $) {
    'use strict';

    window.dataService = {
        getLogements: getLogements
    };

    var BASE_URL = "https://www.airbnb.fr/search/search_results/";
    var now = new Date();

    // Returns a promise querying the data
    function getLogements(params) {
        params = validateParams(params);
        
        return $.ajax(BASE_URL + "?" + $.params(params));
    }

    // Removes checks the presence of the necessaries parameters, and removes superfluous ones
    function validateParams(params) {
        var params = params || {},
            finalParams = {},
            errors = [];

        if (params.location === undefined) {
            errors.push("Argument manquant: ville");
        }
        finalParams.location = params.location;

        if (params.guests === undefined) {
            errors.push("Argument manquant: nombre de personnes");
        }
        finalParams.guests = params.guests;

        if (params.checkin === undefined) {
            errors.push("Argument manquant: date de début");
        }
        else {
            var checkinDate = new Date(params.checkin);
            if (checkinDate.toString() === "Invalid Date") {
                errors.push("La date de début est invalide");
            }
            else if (checkinDate <= now) {
                errors.push("La date de début doit être supérieur à maintenant");
            }
        }
        finalParams.checkin = params.checkin;

        if (params.checkout === undefined) {
            errors.push("Argument manquant: date de fin");
        }
        else {
            var checkoutDate = new Date(params.checkout);
            if (checkoutDate.toString() === "Invalid Date") {
                errors.push("La date de fin est invalide");
            }
            else if (checkoutDate <= now) {
                errors.push("La date de fin doit être supérieur à maintenant");
            }
        }
        finalParams.checkout = params.checkout;

        if (new Date(params.checkin) >= new Date(params.checkout)) {
            errors.push("La date de début doit être strictement inférieure à la date de fin");
        }

        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return finalParams;
    }

    
})(window, $);