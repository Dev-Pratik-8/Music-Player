
console.log("Lets Write JavaScript");

let currSong = new Audio();
let songs;
let currFolder;



function secondsToMinutesSeconds (seconds) {
    if (isNaN(seconds) || seconds < 0) {
    return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String (remainingSeconds).padStart (2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

    }


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}`)

    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            // after getting song from fetch storing it in array
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    songUL.innerHTML = "";

    for (const song of songs) {
        // adding songs in the playlist
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="">${song.replaceAll("%20", " ")}</div>
                                <div class="">Pratik</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">

                            </div></li>`
    }

    // Attaching event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( e =>{
        
        e.addEventListener("click", element =>{

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs;
}



const playMusic = (track, pause = false) =>{
    // let audio = new Audio()
    currSong.src = `/${currFolder}/` + track
    if(!pause){

        currSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"



    
}

async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // get the meta data for the folder

            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jfif" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }



    // loading playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(e, e.dataset, e.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            // songs = await getSongs(`songs/${e.dataset.folder}`)
            // item.dataset.folder
        })
    })
}

async function main() {

    await getSongs("songs/LOFI")
    // console.log(songs);
    playMusic(songs[0], true)
    

    // Diplay all albums
    displayAlbums()

    // Attaching event listener to prev, play, next
    play.addEventListener("click", ()=>{

        if(currSong.paused){
            currSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currSong.pause()
            play.src = "img/play.svg"
        }
    })

    // listening for time update event
    currSong.addEventListener("timeupdate", ()=>{
        // console.log(currSong.currentTime, currSong.duration);
        document.querySelector(".songtime").innerHTML =  `${secondsToMinutesSeconds(currSong.currentTime)} / ${secondsToMinutesSeconds(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime/currSong.duration)*100 + "%"
    })

    // Adding an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = (currSong.duration * percent) / 100
    })

    // Adding event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    // Adding event listener to close hamburger
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // Adding event listener to previous
    document.querySelector("#previous").addEventListener("click", ()=>{
        console.log("previous was clicked");
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if((index-1) >= length){

            playMusic(songs[index-1])
        }
    })

    // Adding event listener to next
    document.querySelector("#next").addEventListener("click", ()=>{
        console.log("next was clicked");
        // console.log(currSong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){

            playMusic(songs[index+1])
        }
    })

    // Adding an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currSong.volume = parseInt(e.target.value)/100
        if(currSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    })

    // Adding event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{

        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10

        }
    })
    


    // var audio = new Audio(songs[2])
    // audio.play();
}
main()