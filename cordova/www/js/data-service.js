(function(window, $) {
    'use strict';

    window.dataService = {
        getLogements: getLogements
    };

    var BASE_URL = "https://www.airbnb.fr/search/search_results/";
    var now = new Date();
    now.setHours(0,0,0,0);

    // Returns a promise querying the data
    function getLogements(params) {
        params = validateParams(params);
        
        return $.ajax(BASE_URL + "?" + $.param(params));
    }

    // Removes checks the presence of the necessaries parameters, and removes superfluous ones
    function validateParams(params) {
        var params = params || {},
            finalParams = {},
            errors = [];

        if (params.location === undefined || params.location === null || params.location.trim() === "") {
            errors.push("Argument manquant: ville");
        }
        finalParams.location = params.location;

        if (params.guests === undefined || params.guests === null || params.guests.trim() === "") {
            errors.push("Argument manquant: nombre de personnes");
        }
        else {
            if (parseInt(params.guests) <= 0) {
                errors.push("Nombre de personnes invalide");
            }
        }
        finalParams.guests = params.guests;

        if (params.checkin === undefined || params.checkin === null || params.checkin.trim() === "") {
            errors.push("Argument manquant: date de début");
        }
        else {
            var checkinDate = new Date(params.checkin);
            if (checkinDate.toString() === "Invalid Date") {
                errors.push("La date de début est invalide");
            }
            else if (checkinDate < now) {
                errors.push("La date de début doit être supérieure ou égale à maintenant");
            }
        }
        finalParams.checkin = params.checkin;

        if (params.checkout === undefined || params.checkout === null || params.checkout.trim() === "") {
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