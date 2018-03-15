const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const searchResultsDiv = document.getElementById('searchResultsDiv');
const searchResultsUl = document.getElementById('searchResultsUl');

const displaySongDiv = document.getElementById('displaySongDiv');
const producersUl = document.getElementById('producersUl');
const writersUl = document.getElementById('writersUl');

const displayArtistDiv = document.getElementById('displayArtistDiv');


    
/* f u nc t i o n s */

function callApi(apiURL){
    //access token for security
    const myToken = 'c1xEgpHh4mQnAng-IrOOlg4E76g-eDt1lzDexfUPh1xq2429SFHC9oVwZC1veo69';

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


function fetchAndDisplayOneSong(songId){

    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/songs/${songId}`;

    callApi(apiURL)
    .then(function(data) {
        displaySongFull(data);
    });
}

function fetchAndDisplayOneArtist(id){

    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/artists/${id}`;

    callApi(apiURL)
    .then(function(data) {
        displayArtist(data);
    });
}


function displaySongFull(data){
    const producersArray = data.response.song.producer_artists;

    for(let producer of producersArray){
        const producerId = producer.id;
        const producerNameTextNode = document.createTextNode(producer.name);

        const li = document.createElement('li');
        li.appendChild(producerNameTextNode);

        li.addEventListener('click', function(){
            fetchAndDisplayOneArtist(producerId);
        })
        producersUl.appendChild(li);
    }


    const writersArray = data.response.song.writer_artists;
    for(let writer of writersArray){
        const writerId = writer.id;
        const writerNameTextNode = document.createTextNode(writer.name);

        const li = document.createElement('li');
        li.appendChild(writerNameTextNode);
        writersUl.appendChild(li);
    }
}

function displayArtist(data){
    console.log(data);
}



function displaySearchResults(data){

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
            searchResultsDiv.style.display = "none";
            displaySongDiv.style.display = "block";

            //to send parameter without calling the function this works..(..??)
            fetchAndDisplayOneSong(songId)
        });

        //lastly append li to ul in DOM
        searchResultsUl.appendChild(li);
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
show message if no writers or producers??
user have to reload page to make new search show on top.. /the new results ends up at the bottom
now user can click on search alot and get result again after result

*/