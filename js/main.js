const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const searchResultsDiv = document.getElementById('searchResultsDiv');
const searchResultsUl = document.getElementById('searchResultsUl');

const displaySongDiv = document.getElementById('displaySongDiv');
const songTitleHeading = document.getElementById('songTitleHeading');
const producersUl = document.getElementById('producersUl');
const writersUl = document.getElementById('writersUl');

const displayArtistDiv = document.getElementById('displayArtistDiv');
const artistNameHeading = document.getElementById('artistNameHeading');
const artistImage = document.getElementById('artistImage');
const songsByArtistUl = document.getElementById('songsByArtistUl');



/* eventlistener */
searchButton.addEventListener('click', function() {
    const searchQuery = searchInput.value;
    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/search?q=${searchQuery}`;

        callApi(apiURL)
        .then(function(data) {
            displaySearchResults(data);
        });
})

//call to the api.. static value for myToken.. 
//sending in special apiURL: info about what you want to fetch from where
//handle the data using json
function callApi(apiURL){
    //access token for security
    const myToken = 'wRvUcrsqmhtD3in0K9NJbPk6bL2MBaaa6p8Zoqq3bHzbhwaGlQ_zc1-SP92mpdqv';

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


/* fetch functions using callApi */

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

function fetchAndDisplaySongsByArtist(id){
    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/artists/${id}/songs`;

    callApi(apiURL)
    .then(function(data) {
        displaySongsByArtist(data);
    });
}



/* display functions ..kind of referred in the fetch functions*/

function displaySongFull(data){
    //for looping out producers and writers
    const producersArray = data.response.song.producer_artists;
    const writersArray = data.response.song.writer_artists;
    
    //song info
    const song = data.response.song;
    const songTitleTextNode = document.createTextNode(song.title);
    songTitleHeading.appendChild(songTitleTextNode);

    //producer
    for(let producer of producersArray){
        const producerId = producer.id;
        const producerNameTextNode = document.createTextNode(producer.name);

        const li = document.createElement('li');
        li.appendChild(producerNameTextNode);

        li.addEventListener('click', function(){
            displaySongDiv.style.display = "none";
            displayArtistDiv.style.display = "block";
            fetchAndDisplayOneArtist(producerId);
        })
        
        producersUl.appendChild(li);
    }

    //writer
    for(let writer of writersArray){
        const writerId = writer.id;
        const writerNameTextNode = document.createTextNode(writer.name);

        const li = document.createElement('li');
        li.appendChild(writerNameTextNode);

        li.addEventListener('click', function(){
            displaySongDiv.style.display = "none";
            displayArtistDiv.style.display = "block";
            fetchAndDisplayOneArtist(writerId);
        })

        writersUl.appendChild(li);
    }
}



function displaySongsByArtist(data){
    songsByArtistArray = data.response.songs;

    for(let song of songsByArtistArray){
        songTitle = song.title;
        console.log(song.title + song.primary_artist.name);
    }
}

function displayArtist(data){
    const artist = data.response.artist;

    const artistNameTextNode = document.createTextNode(artist.name);
    
    artistNameHeading.appendChild(artistNameTextNode);
    artistImage.src = artist.image_url;

    fetchAndDisplaySongsByArtist(artist.id);
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

        const li = document.createElement('li');
        const img = document.createElement('img');

        const songInfoTextNode = document.createTextNode(`${songTitle} By ${songArtistName}`);
        img.src = songImgUrl;

        li.appendChild(img);
        li.appendChild(songInfoTextNode);

        //eventlistener so that when clicked we call api using the songId to get more info
        li.addEventListener('click', function(){
            searchResultsDiv.style.display = "none";
            displaySongDiv.style.display = "block";

            //to send parameter without calling the function this works
            //lke the function embedded in the anonymous function..(..??)
            fetchAndDisplayOneSong(songId)
        });

        //lastly append li to ul in DOM
        searchResultsUl.appendChild(li);
    }
}