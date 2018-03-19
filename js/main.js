const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const requestHeading = document.getElementById('requestHeading');

const searchResultsUl = document.getElementById('searchResultsUl');

const notSearchResultsDiv = document.getElementById('notSearchResultsDiv');

const artistInfoDiv = document.getElementById('artistInfoDiv');
const songsByArtistUl = document.getElementById('songsByArtistUl');

const creditsDiv = document.getElementById('creditsDiv');
const producersUl = document.getElementById('producersUl');
const writersUl = document.getElementById('writersUl');



                      /* eventlistener */

searchButton.addEventListener('click', function() {
    notSearchResultsDiv.style.display = "none";
    removeChildren(searchResultsUl);

    const searchQuery = searchInput.value;
    const apiURL = `https://cors-anywhere.herokuapp.com/https://api.genius.com/search?q=${searchQuery}`;

        callApi(apiURL)
        .then(function(data) {
            displaySearchResults(data);
        });

    searchInput.value = "";
})



//call to the api.. static value for myToken.. 
//sending in special apiURL: info about what you want to fetch from where
//handle the data using json
function callApi(apiURL){
    //access token for security
    const myToken = 'vN_Jt2wAaah9EyS3NzUFAuW7G_uL43l7lIkWU22Ohwebb9oLbxfzwZa1mEgKpnzV';

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




/***** fetch functions using callApi */

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




 /**** display functions ..kind of referred in the fetch functions*/

function displaySearchResults(data){
    requestHeading.innerHTML = "Your search results";
    const searchResultsArray = data.response.hits;

    for(searchResult of searchResultsArray){
        //store songId to make a new call to API for more info(prod. + writer names) if user click this.. 
        const songId = searchResult.result.id;

        //store other info to be displayed in DOM
        const songTitle = searchResult.result.title;
        const songArtistName = searchResult.result.primary_artist.name;
        const songImgUrl = searchResult.result.song_art_image_thumbnail_url;

        const li = document.createElement('li');
        li.innerHTML =
            `
            <img class="leftUlContent" src="` + songImgUrl + `" alt="">
            <div class="rightUlContent">
                <h3>${songTitle}</h3>
                <p>By ${songArtistName}<p>
            </div>
            <div class="clear"></div>
            `
        ;
        
        //eventlistener so that when clicked we call api using the songId to get more info
        li.addEventListener('click', function(){

            //to send parameter without calling the function this works
            //lke the function embedded in the anonymous function..(..??)
            fetchAndDisplayOneSong(songId)
        });

        //lastly append li to ul in DOM
        searchResultsUl.appendChild(li);
    }
}



function displaySongFull(data){
    notSearchResultsDiv.style.display = "block";
    creditsDiv.style.display = "block";
    artistInfoDiv.style.display = "none";
    searchResultsUl.innerHTML = "";
    songsByArtistUl.innerHTML = "";

    //for looping out producers and writers
    const producersArray = data.response.song.producer_artists;
    const writersArray = data.response.song.writer_artists;
    
    //song info
    const song = data.response.song;
    requestHeading.innerHTML = `${song.title} By ${song.primary_artist.name}`

    //clear producersUl
    removeChildren(producersUl);
    //clear producersUl
    removeChildren(writersUl);

    //producer
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

    //writer
    for(let writer of writersArray){
        const writerId = writer.id;
        const writerNameTextNode = document.createTextNode(writer.name);

        const li = document.createElement('li');
        li.appendChild(writerNameTextNode);

        li.addEventListener('click', function(){
            fetchAndDisplayOneArtist(writerId);
        })

        writersUl.appendChild(li);
    }
}

//HUR GÖRA MED ARTISTIMAGE
function displayArtist(data){
    artistInfoDiv.innerHTML = "";
    artistInfoDiv.style.display = "block";
    notSearchResultsDiv.style.display = "block";
    creditsDiv.style.display = "none";

    const artist = data.response.artist;

    requestHeading.innerHTML = artist.name;

    const artistImage = document.createElement('img');

    artistImage.src = artist.image_url;
    artistInfoDiv.appendChild(artistImage);

    fetchAndDisplaySongsByArtist(artist.id);
}



function displaySongsByArtist(data){
    songsByArtistArray = data.response.songs;

    for(let song of songsByArtistArray){
        const songTitle = song.title;
        const songArtistName = song.primary_artist.name;
        const songImgUrl = song.song_art_image_thumbnail_url;

        const li = document.createElement('li');
        li.innerHTML =
            `
            <img class="leftUlContent" src="` + songImgUrl + `" alt="">
            <div class="rightUlContent">
                <h3>${songTitle}</h3>
                <p>By ${songArtistName}<p>
            </div>
            <div class="clear"></div>
            `
        ;

        //eventlistener so that when clicked we call api using the songId to get more info
        li.addEventListener('click', function(){

            //to send parameter without calling the function this works
            //lke the function embedded in the anonymous function..(..??)
            fetchAndDisplayOneSong(song.id)
        });

        songsByArtistUl.appendChild(li);
    }
}



function removeChildren(parentToRemoveFrom){
    while (parentToRemoveFrom.firstChild) {
    parentToRemoveFrom.removeChild(parentToRemoveFrom.firstChild);
    }
}