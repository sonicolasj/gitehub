$(document).ready(function() {
    $("form[name=search-form]").submit(onSubmitSearchForm);
});

var results = [];

function displayResults() {
    var $resultsListContainer = $(".results-list-container");
    if (results.length > 0) {
        // Vidage du contenu précédent
        $resultsListContainer.html("");

        // Pour chaque résultat, affichage de la photo et du titre
        for (var i = 0; i < results.length; i++) {
            var result = results[i].listing;
            
            var listElement = '' +
            '<div class="row">' + 
                '<div class="col-xs-3">' +
                    '<img src="' + result.picture_url + '" />' + 
                '</div>' + 

                '<div class="col-xs-9">' +
                    result.name + 
                '</div>' + 
            '</div>';

            $resultsListContainer.append(listElement);
        }
    }
    else {
        $resultsListContainer.html("Aucun résultat");
    }
}

function onSubmitSearchForm(e) {
    e.preventDefault();

    var $errorContainer = $(".search-errors-container");
    $errorContainer.html("");
    $errorContainer.addClass("hidden");

    var $form = $(e.target);
    var searchData = $form.serializeArray()
                          .reduce(function (acc, field) { acc[field.name] = field.value; return acc; }, {});

    try {
        dataService.getLogements(searchData)
                   .done(onReceivedSearchResult)
                   .fail(onFailedSearchResult);
    } catch (error) {
        var $errorContainer = $(".search-errors-container");
        $errorContainer.html(error.message.replace(/\n/, "<br/>"));
        $errorContainer.removeClass("hidden");
    } 
}

function onReceivedSearchResult(data) {
    results = data.results_json.search_results;


}

function onFailedSearchResult(error) {
    var $errorContainer = $(".search-errors-container");
    $errorContainer.html(error.statusText);
    $errorContainer.removeClass("hidden");
}

function onResultSelected(e) {
    e.preventDefault();
}