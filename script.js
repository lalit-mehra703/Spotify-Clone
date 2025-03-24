console.log("Lets write JavaScript");
let currentSong = new Audio();
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

const playMusic = (track)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/"+track;
    currentSong.play()
    Play.src = "pause.svg"
}

async function main() {
    let songs = await getSongs()
    console.log(songs)
    
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
    
}
main()