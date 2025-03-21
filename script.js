console.log("Lets write JavaScript");

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

async function main() {
    let songs = await getSongs()
    console.log(songs)
    
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // console.log(songUl)
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML+ `<li>${song.replaceAll("-", " ")}</li>`;
    }

    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
    // let duration = audio.duration;
    console.log(audio.duration,audio.currentSrc,audio.currentTime);
  // The duration variable now holds the duration (in seconds) of the audio clip
});

}

main()