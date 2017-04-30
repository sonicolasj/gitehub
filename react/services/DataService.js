const BASE_URL = "https://www.airbnb.fr/search/search_results/";

export default class DataService {
    static search(params) {
        let url = `${BASE_URL}?location=${params.location}&guest=${params.guest}&checkin=${params.checkin}&checkout=${params.checkout}`;

        return fetch(url)
            .then(response => response.json())
            .then(response => response.results_json.search_results);
    }
}