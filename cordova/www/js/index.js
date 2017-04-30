$(document).ready(function() {
    $form = $("form[name=search-form]");
    $submitButton = $form.find("input[type=submit]");
    
    $resultsListContainer = $(".results-list-container");
    $resultsCountContainer = $("#results-count");

    $resultDetailsContainer = $("#result-details");

    $form.submit(onSubmitSearchForm);
});

let $form;
let $submitButton;

let $resultsListContainer;
let $resultsCountContainer;

let $resultDetailsContainer;

// Affiche la section "recherche, resultats, details" voulue
function showCollapsablePart(name) {
    let collapsables = [ "recherche", "resultats", "details" ];

    for (let i = 0; i < collapsables.length; i++) {
        let collapsable = collapsables[i];

        if (name === collapsable) {
            $("#" + collapsable).collapse("show");
        } else {
            $("#" + collapsable).collapse("hide");
        }   
    }
}

function displayResultsList(results) {
    showCollapsablePart("resultats");

    if (results.length > 0) {
        // Vidage du contenu précédent
        $resultsListContainer.html("");
        
        // Affichage du nombre de résultats
        $resultsCountContainer.html(results.length);

        // Pour chaque résultat, affichage de la photo et du titre
        for (let i = 0; i < results.length; i++) {
            let result = results[i],            
                listing = result.listing;

            let $listElement = $('' +
            '<div class="media">' +
                '<div class="media-left">' +
                   ' <img class="media-object" src="' + listing.picture_url + '" width="64" height="64" />' +
                '</div>' +

                '<div class="media-body">' +
                    listing.name +
                '</div>' +
            '</div>');

            // Appelle la fonction d'affichage de détails sur le clic
            $listElement.on('click', function(e) {
                e.preventDefault();

                displayResultDetails(result);
            });

            $resultsListContainer.append($listElement);
        }
    }
    else {
        $resultsListContainer.html("Aucun résultat");

        // Suppression du compteur de résultats
        $resultsCountContainer.html("");
    }
}

function displayResultDetails(result) {
    // On affiche les détails de l'élément, sinon rien
    if (result) {
        let listing = result.listing;

        let $resultDetailsElement = $('' +
        '<img src="' + listing.picture_url + '" height="256" width="256" />' +

        '<p>' +
            listing.name +
        '</p>' +

        '<div class="btn-group" role="group">' +
            '<button type="button" class="btn btn-default btn-calendar">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
            '</button>' +

            '<button type="button" class="btn btn-default btn-share">' +
                '<span class="glyphicon glyphicon-share"></span>' +
            '</button>' +
        '</div>');

        // Ajout dans le calendrier
        $resultDetailsElement.find(".btn-calendar").on("click", function(e) {
            // Crée un évènement de calendrier
            // plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate, success, error);
            plugins.calendar.createEventInteractively(
                "Réservation GiteHub", 
                listing.public_address, 
                listing.name, 
                new Date(result.pricing_quote.check_in), 
                new Date(result.pricing_quote.check_out)
            );
        });

        // Partage en SMS
        $resultDetailsElement.find(".btn-share").on("click", function(e) {

        });

        $resultDetailsContainer.html($resultDetailsElement);

        showCollapsablePart("details");
    } else {
        $resultDetailsContainer.html("Aucun élément sélectionné");
    }
}

function onSubmitSearchForm(e) {
    e.preventDefault();

    $submitButton.val("Recherche...");
    $submitButton.attr("disabled", "disabled");

    // On retire le contenu du details
    displayResultDetails(null);

    // On cache l'erreur
    let $errorContainer = $(".search-errors-container");
    $errorContainer.html("");
    $errorContainer.addClass("hidden");

    // Récupération des valeurs du formulaire
    // [ { "name": "fieldName", "value": "fieldValue" } ] => { "fieldName": "fieldValue" }
    let searchData = $form.serializeArray() 
                          .reduce(function (acc, field) { acc[field.name] = field.value; return acc; }, {});

    try {
        dataService.getLogements(searchData)
                   .done(onReceivedSearchResult)
                   .fail(onFailedSearchResult);
    } catch (error) {
        // Affichage des erreurs de validation
        let $errorContainer = $(".search-errors-container");
        $errorContainer.html(error.message.replace(/\n/, "<br/>"));
        $errorContainer.removeClass("hidden");

        // Réinitialisation du bouton de recherche
        $submitButton.val("Rechercher");
        $submitButton.removeAttr("disabled");
    } 
}

function onReceivedSearchResult(data) {
    displayResultsList(data.results_json.search_results);

    // Réinitialisation du bouton de recherche
    $submitButton.val("Rechercher");
    $submitButton.removeAttr("disabled");
}

function onFailedSearchResult(error) {
    // Affichage de l'erreur
    let $errorContainer = $(".search-errors-container");
    $errorContainer.html(error.statusText);
    $errorContainer.removeClass("hidden");

    // Réinitialisation du bouton de recherche
    $submitButton.val("Recherche...");
    $submitButton.removeAttr("disabled");
}