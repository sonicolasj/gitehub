$(document).ready(function() {
    $form = $("form[name=search-form]");
    
    $resultsListContainer = $(".results-list-container");
    $resultsCountContainer = $("#results-count");

    $resultDetailsContainer = $("#result-details");

    $form.submit(onSubmitSearchForm);
});

let $form;

let $resultsListContainer;
let $resultsCountContainer;

let $resultDetailsContainer;

// Affiche la section "recherche, resultats, details" voulue
function showCollapsablePart(name) {
    let collapsables = [ "recherche", "resultats", "details" ];

    for (let collapsable of collapsables) {
        if (name === collapsable) {
            $(`#${collapsable}`).collapse("show");

        } else {
            $(`#${collapsable}`).collapse("hide");
        }   
    }
}

// Affiche ou masque le texte d'erreur
function displayErrorText(errorText) {
    errorText = errorText.trim();
    if (errorText) {
        errorText = errorText.replace(/\n/, "<br/>");

        $(".search-errors-container")
            .html(errorText)
            .removeClass("hidden");

    }
    else {
        $(".search-errors-container")
            .html("")
            .addClass("hidden");
    }
}

// Change l'état du bouton recherche "Recherche..., Rechercher"
function changeSearchButtonState(state) {
    let $submitButton = $form.find("input[type=submit]");

    if (state === 'off') {
        $submitButton.val("Recherche...");
        $submitButton.attr("disabled", "disabled");

    } else if (state === 'on') {
        $submitButton.val("Rechercher");
        $submitButton.removeAttr("disabled");
    }
}

function displayResultsList(results) {
    showCollapsablePart("resultats");

    if (results.length > 0) {
        // Suppression du contenu précédent
        $resultsListContainer.html("");
        
        // Affichage du nombre de résultats
        $resultsCountContainer.html(results.length);

        // Pour chaque résultat, affichage de la photo et du titre
        for (let result of results) {
            let listing = result.listing;

            let $listElement = $(`
            <div class="media">
                <div class="media-left">
                    <img class="media-object" src="${listing.picture_url}" width="64" height="64" />
                </div>

                <div class="media-body">
                    ${listing.name}
                </div>
            </div>`);

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

        let $resultDetailsElement = $(`
        <img src="${listing.picture_url}" height="256" width="256" />

        <p>
            ${listing.name}
        </p>

        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default btn-calendar">
                <span class="glyphicon glyphicon-calendar"></span>
            </button>

            <button type="button" class="btn btn-default btn-share">
                <span class="glyphicon glyphicon-share"></span>
            </button>
        </div>`);

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
            // Corps du message :
            // Réservation GiteHub
            // 
            // Date de début : result.pricing_quote.check_in
            // Date de fin : result.pricing_quote.check_out
            //
            // Adresse : listing.public_address
            // Description : "listing.name"
            let message = `Réservation GiteHub\n\nDate de début : ${result.pricing_quote.check_in}\nDate de fin : ${result.pricing_quote.check_out}\n\nAdresse : ${listing.public_address}\nDescription : "${listing.name}"`;

            // plugins.socialsharing.shareViaSMS('My cool message', '0612345678,0687654321', function(msg) {console.log('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})
            plugins.socialsharing.shareViaSMS(
                message, 
                null
            );
        });

        $resultDetailsContainer.html($resultDetailsElement);

        showCollapsablePart("details");
        
    } else {
        $resultDetailsContainer.html("Aucun élément sélectionné");
    }
}

function onSubmitSearchForm(e) {
    e.preventDefault();

    changeSearchButtonState('off');

    // On retire le contenu du details
    displayResultDetails(null);

    // On cache l'erreur
    displayErrorText("");

    // Récupération des valeurs du formulaire
    // [ { "name": "field.name", "value": "field.value" } ] => { "field.name": "field.value" }
    let searchData = $form.serializeArray().reduce((acc, field) => { acc[field.name] = field.value; return acc; }, {});

    try {
        dataService.getLogements(searchData)
                   .done(onReceivedSearchResult)
                   .fail(onFailedSearchResult);
    } catch (error) {
        // Affichage des erreurs de validation
        displayErrorText(error.message)

        // Réinitialisation du bouton de recherche
        changeSearchButtonState('on');
    } 
}

function onReceivedSearchResult(data) {
    displayResultsList(data.results_json.search_results);

    // Réinitialisation du bouton de recherche
    changeSearchButtonState('on');
}

function onFailedSearchResult(error) {
    // Affichage de l'erreur
    displayErrorText(error.statusText);

    // Réinitialisation du bouton de recherche
    changeSearchButtonState('on');
}