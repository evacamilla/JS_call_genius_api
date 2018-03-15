const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const searchResultsDiv = document.getElementById('searchResultsDiv');
const searchResultsUl = document.getElementById('searchResultsUl');

const displaySongDiv = document.getElementById('displaySongDiv');

    
/* f u nc t i o n s */
function callApi(apiURL){
    //access token for security
    const myToken = '-vz2WiwO-REtrw3MgtBkeIY5ZG99GvAle3OMLWUgY3z09YcvU3saof76eum-FvcE';

    const request = new Request(apiURL, {
        headers: new Headers({
            'Authorization': `Bearer ${myToken}`
        })
    });
    
    const requestData = fetch(request)
        .then(function(response) {
            return response.json();
        })
    return requestData;
}



function displayOneSong(songId){
    searchResultsDiv.style.display = "none";
    displaySongDiv.style.display = "block";

    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/songs/${songId}`;

    callApi(apiURL)
    .then(function(data) {
        console.log(data.response.song.producer_artists);
    });
}



function displaySearchResults(data){
    searchResultsDiv.style.display = "block";
    displaySongDiv.style.display = "none";

    const searchResultsArray = data.response.hits;

    for(var i = 0; i < searchResultsArray.length; i++){
        //store songId to make a new call to API for more info(prod. + writer names) if user click this.. 
        const songId = searchResultsArray[i].result.id;
        //store other info to be displayed in DOM
        const songTitle = searchResultsArray[i].result.title;
        const songArtistName = searchResultsArray[i].result.primary_artist.name;
        const songImgUrl = searchResultsArray[i].result.song_art_image_thumbnail_url;

        const songInfoTextNode = document.createTextNode(`${songTitle} By ${songArtistName}`);

        const li = document.createElement('li');
        const img = document.createElement('img');

        img.src = songImgUrl;
        li.appendChild(img);
        li.appendChild(songInfoTextNode);

        //eventlistener so that when clicked we call api using the songId to get more info
        li.addEventListener('click', function(){
            //to send parameter without calling the function this works..(..??)
            displayOneSong(songId, li)
        });

        //lastly append li to ul in DOM
        searchResultsUl.appendChild(li);

        console.log(searchResultsArray[i]);
    }
}



searchButton.addEventListener('click', function() {
    const searchQuery = searchInput.value;
    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/search?q=${searchQuery}`;

        callApi(apiURL)
        .then(function(data) {
            displaySearchResults(data);
        });
})


/*
TODO:
user have to reload page to make new search show on top.. /the new results ends up at the bottom
now user can click on search alot and get result again after result
*/