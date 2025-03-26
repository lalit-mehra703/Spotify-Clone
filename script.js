console.log("Lets write JavaScript");
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds) || seconds<0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinute = String(minutes).padStart(2,'0');
    const formattedSecond = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinute}:${formattedSecond}`;

}
async function getSongs(){

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    
    let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
            
            // let  a= "http://127.0.0.1:3000/songs/Janam-Janam-Tu-Hi-Mere-Paas-Maa.mp3"
            // a.split("Tu")
            //output -> (2) ['http://127.0.0.1:3000/songs/Janam-Janam-', '-Hi-Mere-Paas-Maa.mp3']
        }
    }
    return songs
}

const playMusic = (track,pause = false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/"+track;
    if(!pause){
        currentSong.play()
        Play.src = "pause.svg"                               
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML ="00:00/00:00"
}

async function main() {
    let songs = await getSongs()
    console.log(songs)
    playMusic(songs[0],true)
    
    // show all the song in the playlist 
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // console.log(songUl)
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML+ `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Lucky</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="https://cdn.hugeicons.com/icons/play-circle-02-stroke-sharp.svg" alt="play-circle-02" width="32" height="32">
                            </div> </li>`;
    }

    // Attack an event listener to each song 

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })

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
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =  (currentSong.currentTime/ currentSong.duration)*100 +"%";
    })

    //Add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime = (currentSong.duration*percent)/100
    })

}
main()