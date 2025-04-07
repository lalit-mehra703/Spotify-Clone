console.log("Lets write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds) || seconds<0){
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinute = String(minutes).padStart(2,'0');
    const formattedSecond = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinute}:${formattedSecond}`;

}
async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    
    songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
            
            // let  a= "http://127.0.0.1:3000/songs/Janam-Janam-Tu-Hi-Mere-Paas-Maa.mp3"
            // a.split("Tu")
            //output -> (2) ['http://127.0.0.1:3000/songs/Janam-Janam-', '-Hi-Mere-Paas-Maa.mp3']
        }
    }

    
    // show all the song in the playlist 
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // console.log(songUl)
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML+ `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Lucky</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play-circle-02" width="32" height="32">
                            </div> </li>`;
    }

    // Attack an event listener to each song 

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })

    return songs
}

const playMusic = (track,pause = false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/`+track;
    if(!pause){
        currentSong.play()
        Play.src = "pause.svg"                               
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML ="00:00/00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer  = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/songs")){
            console.log(e.href.split("/").slice(-2)[0])
            let folder = e.href.split("/").slice(-2)[0]
            //Get metadata of the folder 
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="circle-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"> 
                                <path d="M7.5241 19.0621C6.85783 19.4721 6 18.9928 6 18.2104V5.78956C6 5.00724 6.85783 4.52789 7.5241 4.93791L17.6161 11.1483C18.2506 11.5388 18.2506 12.4612 17.6161 12.8517L7.5241 19.0621Z" 
                                stroke="#000000" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                        </div>

                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    //Load the playlist whenever card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function main() {
    await getSongs("songs/ncs")
    console.log(songs)
    playMusic(songs[0],true)
    
    //Displaly all albums on the page
    displayAlbums()


    // Attach an event listner to play , next and previous 
    // id is called directly in javaScript 
    Play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            Play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            // Play.src = "https://cdn.hugeicons.com/icons/play-circle-02-stroke-sharp.svg"
            Play.src ="play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =  (currentSong.currentTime/ currentSong.duration)*100 +"%";
    })

    //Add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = (currentSong.duration*percent)/100
    })

    // Add an event listner for hamburger 
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="0"
    })

    // Add an event listner for close button 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listner for previous click

    Previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index-1)>= 0){
            playMusic(songs[index-1])
        }
    })
    
    //add an event listner for Next click
    Next.addEventListener("click",()=>{

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if ((index+1)<= songs.length){
            playMusic(songs[index+1])
        }
        
    })

    //Add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    //Add an event listner to mute the track

    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src .includes("volume.svg")){
            e.target.src =e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })

    

}
main()