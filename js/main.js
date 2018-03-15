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
    const searchResultsArray = data.response.hits;

    for(var i = 0; i < searchResultsArray.length; i++){
        //store songId to make a new call to API for more info(prod. + writer names) if user click this.. 
        const songId = searchResultsArray[i].result.id;
        //store other info to be displayed in DOM
        const songTitle = searchResultsArray[i].result.title;
        const songArtistName = searchResultsArray[i].result.primary_artist.name;
        const songImg = searchResultsArray[i].result.song_art_image_thumbnail_url;



        console.log(songImg);
        console.log(searchResultsArray[i]);
    }
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