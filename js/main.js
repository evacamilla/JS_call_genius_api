const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResultsUl = document.getElementById('searchResultsUl');

    
function createRequest(apiURL){
    //access token for security
    const myToken = '-vz2WiwO-REtrw3MgtBkeIY5ZG99GvAle3OMLWUgY3z09YcvU3saof76eum-FvcE';

    var request = new Request(apiURL, {
        headers: new Headers({
            'Authorization': `Bearer ${myToken}`
        })
    });
    return request;
}


function displaySearchResults(data){
    console.log(data);
}



searchButton.addEventListener('click', function() {
    const searchQuery = searchInput.value;
    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/search?q=${searchQuery}`;

    request = createRequest(apiURL);

    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displaySearchResults(data);
        });
})