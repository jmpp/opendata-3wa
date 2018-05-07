(function() {
    'use strict';

    const formSearch = document.getElementById('form-search');
    const resultsBody = document.querySelector('#results > table > tbody');

    // Récupération des champs input/select
    let fieldFauteuils          = document.querySelector('[name=fauteuils]');
    let fieldFauteuilsOperation = document.querySelector('[name=operation_fauteuils]');

    let fieldEcrans             = document.querySelector('[name=ecrans]');
    let fieldEcransOperation    = document.querySelector('[name=operation_ecrans]');

    let fieldArrondissement     = document.querySelector('[name=arrondissement]');

    // Validation du formulaire
    formSearch.addEventListener('submit', event => {
        event.preventDefault();

        // Constitution de la requête pour le serveur
        const params = {
            'operation_fauteuils' : fieldFauteuilsOperation.value,
            'fauteuils' : fieldFauteuils.value,
            'operation_ecrans' : fieldEcransOperation.value,
            'ecrans' : fieldEcrans.value,
            'arrondissement' : fieldArrondissement.value
        };

        // Envoi au serveur
        fetch('/ajax' + buildQueryString(params))
            .then(response => response.json())
            .then(data => buildResults(data))
            .catch(err => alert(`Une erreur est survenue\n${err.message || err}`));
    });

    function buildResults(data) {
        // Les données renvoyées par le serveur ressemblent à celles de l'API opendata Paris cinémas
        
        if (data.length === 0) {
            return resultsBody.innerHTML = '<td colspan="5">Aucun résultat pour ces paramètres</td>';
        }
        
        const resultsFragment = document.createDocumentFragment();
        resultsFragment.innerHTML = '';

        data.map(item => item.fields).forEach(item => {
            resultsFragment.innerHTML += `<tr>
                <td>${item.nom_etablissement}</td>
                <td>${item.adresse}</td>
                <td>${item.arrondissement}</td>
                <td>${item.fauteuils}</td>
                <td>${item.ecrans}</td>
            </tr>`;
        });

        resultsBody.innerHTML = resultsFragment.innerHTML;
    }

    function buildQueryString(params) {
        let qs = '?';
        for (let name in params)
            qs += encodeURIComponent(name) + '=' + encodeURIComponent(params[name]) + '&';
        return qs.slice(0, -1);
    }
})();