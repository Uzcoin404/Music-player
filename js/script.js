const loader = document.querySelector('.loader');
const vLines = document.querySelector('#vertical-lines');
window.addEventListener('load', function(){
    loader.style.display = 'none';
});
let vLength = screen.width > 1366 ? 150 : screen.width > 768 ? 90 : 40;
for (let i = 0; i < vLength; i++) {
    let vLine = `<div class="vertical"></div>`;
    vLines.insertAdjacentHTML('beforeend', vLine);
}
const main = document.querySelector('main');
const audio = document.querySelector('.audio');
const play = document.querySelector('.play_icon');
const audioRange = document.querySelector('.audio_range');
const root = document.querySelector(':root');
let onEqualizer = false;
let musicIndex = checkCookie('music-index') ? getCookie('music-index') : 0;
function getCookie(cName) {
    let name = cName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}
function checkCookie(name) {
    let cName = getCookie(name);
    if (cName != '' && cName != undefined) {
        return true;
    } else{
        return false;
    }
}
function musicPlayer() {
    let isPlay = false;
    let playlistLoop = true;
    let musicLoop = false;
    let randomPlay = false;
    let isDown = false;
    let isLove = false;
    let audioCurrentTime = 0;
    const musicPlayer = document.querySelector('.musicPlayer'),
          audioList = document.querySelector('.music_list'),
          audioForward = document.querySelector('.audio_forward'),
          audioBackward = document.querySelector('.audio_backward'),
          audioListIcon = document.querySelector('.audio_list_icon'),
          listMusics = document.querySelector('.list_musics'),
          musicImg = document.querySelector('.music_img'),
          musicName = document.querySelector('.music_name'),
          artistName = document.querySelector('.artist_name'),
          controlIndicator = document.querySelector('.controlIndicator'),
          settingsItem = document.querySelector('.settings_item'),
          btn = document.querySelectorAll('.anm_btn'),
          audioSpendTime = document.querySelector('.audio_spendTime'),
          audioRemainingTime = document.querySelector('.audio_remainingTime'),
          playAgain = document.querySelector('.audio_playAgain'),
          progressBar = document.querySelector('.progress_bar'),
          thumb = document.querySelector('.thumb'),
          love = document.querySelector('.love_icon'),
          daysToExpire = new Date(2147483647 * 1000).toUTCString();
    if (checkCookie('music-index')) {
        audio.src = getCookie('music-path');
        musicImg.src = getCookie('music-img');
        root.style.setProperty('--background', `url('${musicList[musicIndex].img}')`);
        artistName.innerHTML = getCookie('music-artist');
        musicName.innerHTML = getCookie('music-name');
        getCookie('music-love') ? isLove = true : isLove = false;
        getCookie('music-love') ? love.classList.add('active') : love.classList.remove('active');
        settingsItem.href = getCookie('music-path');
    }
    window.addEventListener('load', musicDetails());
    function musicDetails() {
        audio.src = musicList[musicIndex].src;
        musicImg.src = musicList[musicIndex].img;
        document.querySelector('.background').src = musicList[musicIndex].img;
        artistName.innerHTML = musicList[musicIndex].artist;
        musicName.innerHTML = musicList[musicIndex].name;
        musicList[musicIndex].love ? isLove = true : isLove = false;
        musicList[musicIndex].love ? love.classList.add('active') : love.classList.remove('active');
        settingsItem.href = musicList[musicIndex].src;
        document.cookie = `music-index=${musicIndex}; expires=${daysToExpire}`;
        document.cookie = `music-name=${musicList[musicIndex].name}; expires=${daysToExpire}`;
        document.cookie = `music-artist=${musicList[musicIndex].artist}; expires=${daysToExpire}`;
        document.cookie = `music-img=${musicList[musicIndex].img}; expires=${daysToExpire}`;
        document.cookie = `music-path=${musicList[musicIndex].path}; expires=${daysToExpire}`;
        document.cookie = `music-love=${musicList[musicIndex].love}; expires=${daysToExpire}`;
    }
    for (let i = 0; i < musicList.length; i++) {
        let listLi = `  <li music-index="${i}">
                            <div class="list_music_left">
                                <span class="music_number">${i+1}</span>
                                <div class="music_list_img"><img src="${musicList[i].img}" alt="" class="music_image"></div>
                            </div>
                            <div class="list_music_right">
                                <div class="list_music_info">
                                    <h4 class="list_music_name">${musicList[i].name}</h4>
                                    <p class="list_music_artist"><i class="fas fa-cloud-music"></i> ${musicList[i].artist}</p>
                                </div>
                                <audio class="music-${i}" src="${musicList[i].src}" hidden></audio>
                                <span class="music_list_time"><i class="fas fa-waveform"></i> <p id="time-${i}"></p></span>
                            </div>
                        </li>`;
        listMusics.insertAdjacentHTML("beforeend", listLi);
        let musicListAudio = listMusics.querySelector(`.music-${i}`);
        let musicListTime = listMusics.querySelector(`#time-${i}`);
        musicListAudio.addEventListener('loadeddata', ()=>{
            let audioDurationMin = Math.floor(musicListAudio.duration / 60);
            let audioDurationSec = Math.floor(musicListAudio.duration % 60);
            musicListTime.innerHTML = `${audioDurationMin < 10 ? "0" + audioDurationMin : audioDurationMin}:${audioDurationSec < 10 ? "0" + audioDurationSec : audioDurationSec}`;
        });
    }
    const allLi = listMusics.querySelectorAll('li');
    function removePlaying() {
        for (let i = 0; i < allLi.length; i++) {
            allLi[i].classList.remove('playing');
        }
    }
    for (let j = 0; j < allLi.length; j++) {
        let musicNumber = allLi[j].getAttribute('music-index');
        allLi[j].addEventListener('click', function(){
            removePlaying();
            this.classList.add('playing');
            musicIndex = musicNumber;
            musicDetails();
            audioPlay();
        });
    }

    audioForward.addEventListener('click', function(){
        if (!isDown) {   
            if (musicLoop) {
                audio.currentTime = 0;
                audio.play();
            } if(playlistLoop){
                musicIndex++;
                musicIndex > musicList.length - 1 ? musicIndex = 0 : musicIndex = musicIndex;
            }
            if (randomPlay) {   
                let randomIndex = Math.floor(Math.random() * musicList.length);
                do {
                    randomIndex = Math.floor(Math.random() * musicList.length);
                } while (musicIndex == randomIndex);
                musicIndex = randomIndex;
                audio.currentTime = 0;
            }
        }
        musicDetails();
        audioPlay();
        audio.playbackRate = speedIndicator;
        controlIndicator.innerHTML = `Playing: ${musicList[musicIndex].name}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });
    audioBackward.addEventListener('click', function(){
        if (!isDown) {   
            if (musicLoop) {
                audio.currentTime = 0;
                audio.play();
            } if(playlistLoop){
                musicIndex--;
                musicIndex < 0 ? musicIndex = musicList.length - 1 : musicIndex = musicIndex;
            } if (randomPlay) {   
                let randomIndex = Math.floor(Math.random() * musicList.length);
                do {
                    randomIndex = Math.floor(Math.random() * musicList.length);
                } while (musicIndex == randomIndex);
                musicIndex = randomIndex;
                audio.currentTime = 0;
            }
        }
        musicDetails();
        audioPlay();
        audio.playbackRate = speedIndicator;
        controlIndicator.innerHTML = `Playing: ${musicList[musicIndex].name}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });

    play.addEventListener('click', function(){
        if (!isPlay) {
            audioPlay();
        } else{
            audioPause();
        }
    });
    function audioPlay(){
        isPlay = true;
        audio.play();
        musicPlayer.classList.add('play');
        onEqualizer = true;
        setEqualizer();
    }
    function audioPause(){
        isPlay = false;
        audio.pause();
        musicPlayer.classList.remove('play');
        onEqualizer = false;
        setEqualizer();
    }
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function(){
            this.classList.add('animate');
            setTimeout(() => {
                this.classList.remove('animate');
            }, 500);
        });
    }
    audio.addEventListener("ended", function(){
        if (!isDown) {   
            if (musicLoop) {
                audio.play();
            } if(playlistLoop){
                audioForward.click();
            }
            if (randomPlay) {   
                let randomIndex = Math.floor(Math.random() * musicList.length);
                do {
                    randomIndex = Math.floor(Math.random() * musicList.length);
                } while (musicIndex == randomIndex);
                musicIndex = randomIndex;
                audio.currentTime = 0;
                musicDetails();
                audioPlay();
            }
            audio.playbackRate = speedIndicator;
        }
    });
    if (checkCookie('audio-range')) {
        audioCurrentTime = getCookie('audio-range');
        audio.currentTime = getCookie('audio-range');
        rangeSlider();
    }
    audio.addEventListener('timeupdate',function(){
        let audioMinutes = Math.floor(audio.currentTime / 60);
        let audioSeconds = Math.floor(audio.currentTime % 60);
        audioSpendTime.innerHTML = `${audioMinutes < 10 ? "0" + audioMinutes : audioMinutes}:${audioSeconds < 10 ? "0" + audioSeconds : audioSeconds}`
        audio.addEventListener('loadeddata', ()=>{
            let audioDurationMin = Math.floor(audio.duration / 60);
            let audioDurationSec = Math.floor(audio.duration % 60);
            audioRemainingTime.innerHTML = `${audioDurationMin < 10 ? "0" + audioDurationMin : audioDurationMin}:${audioDurationSec < 10 ? "0" + audioDurationSec : audioDurationSec}`;
        });
        if (!isDown) {
            audioRange.value = (audio.currentTime / audio.duration) * 100;
            document.cookie = 'audio-range=' + audioCurrentTime;
            rangeSlider();
        }
    });
    let isChange = false;
    let isMove = false;
    audioRange.value = 0;
    function rangeSlider() {
        let value = audioRange.value;
        thumb.style.left = value + '%';
        progressBar.style.width = value + '%';
        progressBar.style.width = audio.currentTime;
        thumb.style.left = audio.currentTime;
        document.cookie = `audio-range=${audioCurrentTime}; expires=${daysToExpire}`;
    };
    audioRange.addEventListener('input', rangeSlider());
    audioRange.addEventListener('mousedown', function(e){
        isDown = true;
        if (isDown) {
            audioCurrentTime = (e.offsetX / this.offsetWidth) * audio.duration;
            rangeSlider();
        }
    });
    audioRange.addEventListener('mousemove', function(e){
        isMove = true;
        if (isDown && isMove) {
            audioCurrentTime = (e.offsetX / this.offsetWidth) * audio.duration;
            rangeSlider();
        }
    });
    audioRange.addEventListener('mouseup', function(){
        isDown = false;
        isMove = false;
        audio.currentTime = audioCurrentTime;
        audioPlay();
    });
    audioRange.addEventListener('touchstart', function(e){
        isDown = true;
        if (isDown) {
            let rect = e.target.getBoundingClientRect();
            audioCurrentTime = ((e.targetTouches[0].pageX - rect.left) / this.offsetWidth) * audio.duration;
            rangeSlider();
        }
    });
    audioRange.addEventListener('touchmove', function(e){
        isMove = true;
        if (isDown && isMove) {
            let rect = e.target.getBoundingClientRect();
            audioCurrentTime = ((e.targetTouches[0].pageX - rect.left) / this.offsetWidth) * audio.duration;
            rangeSlider();
        }
    });
    audioRange.addEventListener('touchend', function(){
        isDown = false;
        isMove = false;
        audio.currentTime = audioCurrentTime;
        audioPlay();
    });

    playAgain.addEventListener('click', function(){
        if (this.getAttribute('title') == 'Playlist looped') {
            musicLoop = true;
            randomPlay = false;
            playlistLoop = false;
            this.setAttribute('title', 'Music looped');
            this.querySelector('i').className = 'far fa-repeat looped';
            controlIndicator.innerHTML = "Music looped";
        } else if (this.getAttribute('title') == 'Music looped') {
            randomPlay = true;
            musicLoop = false;
            playlistLoop = false;
            this.setAttribute('title', 'Random play');
            this.querySelector('i').className = 'far fa-repeat random';
            controlIndicator.innerHTML = "Random play";
        } else if (this.getAttribute('title') == 'Random play') {
            playlistLoop = true;
            randomPlay = false;
            musicLoop = false;
            this.setAttribute('title', 'Playlist looped');
            this.querySelector('i').className = 'far fa-repeat playlist';
            controlIndicator.innerHTML = "Playlist looped";
        }
        musicPlayer.classList.add('indi');
        musicLove();
    });
    document.addEventListener('click', function(e){
        if (e.target == audioListIcon || e.target == audioListIcon.querySelector('i')) {
            audioList.classList.add('show');
        } else {
            audioList.classList.remove('show');
        }
    });
    // Audio functions
    const shortcuts = document.querySelector('.shortcuts'),
          volumeIcon = document.querySelector('.volume_icon'),
          volumeRange = document.querySelector('.volume_range'),
          volumeThumb = document.querySelector('.volume_thumb'),
          volumeBar = document.querySelector('.volume_bar'),
          speedPlus = document.querySelector('#speed_plus'),
          speedMinus = document.querySelector('#speed_minus'),
          speedIndi = document.querySelector('.speed_indi'),
          colorIcon = document.querySelector('.color_icon'),
          colors = document.querySelectorAll('.colors'),
          colorPicker = document.querySelector('.color_picker');
    audio.volume = 0.5;
    let audioVolume = 0.50;
    // audio volume
    function volumeSlider() {
        let value = volumeRange.value;
        volumeThumb.style.bottom = value + '%';
        volumeBar.style.height = value + '%';
    };
    function muteControl() {
        if(audio.volume > 0.10) {
            audioVolume = volumeRange.value / 100;
        } if(audio.volume > 0){
            volumeIcon.classList.remove('active');
        } if (audio.volume == 0) {
            volumeIcon.classList.add('active');
        }
    }
    function setVolume() {
        audio.volume = volumeRange.value / 100;
        volumeSlider();
        muteControl();
    }
    volumeRange.addEventListener('click', function(){
        audio.volume = volumeRange.value / 100;
        volumeSlider();
        muteControl();
    });
    volumeRange.addEventListener('mousedown', function(){
        isChange = true;
    });
    volumeRange.addEventListener('mousemove', function(){
        if (isChange) {  
            setVolume();
        }
    });
    volumeRange.addEventListener('mouseup', function(){
        isChange = false;
        controlIndicator.innerHTML = `Volume: ${Math.round(audio.volume * 100)}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });
    volumeRange.addEventListener('touchstart', function(){
        isChange = true;
        if (isChange) {  
            setVolume();
        }
    });
    volumeRange.addEventListener('touchmove', function(){
        if (isChange) {  
            setVolume();
        }
    });
    volumeRange.addEventListener('touchend', function(){
        isChange = false;
        controlIndicator.innerHTML = `Volume: ${Math.round(audio.volume * 100)}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });
    volumeIcon.addEventListener('click', function(){
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.classList.add('active');
            audio.volume = 0;
            volumeRange.value = 0;
            volumeSlider();
            controlIndicator.innerHTML = `Music muted`;
            musicPlayer.classList.add('indi');
            musicLove();
        } else{
            this.classList.remove('active');
            audio.volume = audioVolume;
            volumeRange.value = audioVolume * 100;
            volumeSlider();
        }
    });
    function volumeController(plusOrMinus) {
        let currentVolume = audio.volume;
        if (plusOrMinus == 'plus' && currentVolume+0.1 <= 1) {
            audio.volume += 0.1;
            volumeRange.value = audio.volume * 100;
            volumeSlider();
            audio.volume > 0.01 ? volumeIcon.classList.remove('active') : '';
            controlIndicator.innerHTML = `Volume: ${Math.round(audio.volume * 100)}`;
            musicPlayer.classList.add('indi');
            musicLove();
        } else if(plusOrMinus == 'minus' && currentVolume-0.1 >= 0){
            audio.volume -= 0.1;
            volumeRange.value = audio.volume * 100;
            volumeSlider();
            controlIndicator.innerHTML = `Volume: ${Math.round(audio.volume * 100)}`;
            musicPlayer.classList.add('indi');
            musicLove();
            audio.volume < 0.01 ? volumeIcon.click() : '';
        }
    }
    function musicLove() {
        setTimeout(() => {
            musicPlayer.classList.remove('indi');
        }, 1500);
    }
    love.addEventListener('click', function(){
        this.classList.toggle('active');
        if(this.classList.contains('active')){
            isLove = true;
            musicList[musicIndex].love = true;
            this.setAttribute('title', 'You loved this Music');
            controlIndicator.innerHTML = "You loved this Music";
            musicPlayer.classList.add('indi');
            musicLove();
        } else {
            isLove = false;
            musicList[musicIndex].love = false;
            this.setAttribute('title', "You don't love this music");
            controlIndicator.innerHTML = "You don't love this music";
            musicPlayer.classList.add('indi');
            musicLove();
        }
    });
    // Colors
    checkCookie('color') ? root.style.setProperty('--color', getCookie('color')) : '';
    for (let i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', function(){
            colorChanger(colors[i]);
            let docStyle = getComputedStyle(document.documentElement)
            let rootValue = docStyle.getPropertyValue('--color');
            document.cookie = `color=${rootValue}; expires=${daysToExpire}`;
        });      
    }; 
    function colorChanger(color){
        if (color.classList.contains('cGreen')) {
            root.style.setProperty('--color', '#00a800');
        } else if(color.classList.contains('cBlack')){
            root.style.setProperty('--color', '#161616');
        } else if(color.classList.contains('cDblue')){
            root.style.setProperty('--color', '#222c3f');
        } else if(color.classList.contains('cPurple')){
            root.style.setProperty('--color', '#b100b1');
        } else if(color.classList.contains('cBlue')){
            root.style.setProperty('--color', '#0044ff');
        } else if(color.classList.contains('cCrimson')){
            root.style.setProperty('--color', '#ff1040');
        } else if(color.classList.contains('cAqua')){
            root.style.setProperty('--color', '#00bac0');
        } else if(color.classList.contains('cOrange')){
            root.style.setProperty('--color', '#ff9100');
        } else {
            root.style.setProperty('--color', '#161b22');
        }
        controlIndicator.innerHTML = `Color changed to ${root.style.getPropertyValue('--color')}`;
        musicPlayer.classList.add('indi');
        musicLove();
    };
    colorPicker.addEventListener('input', function(){
        if (this.value != 'undefined') {    
            root.style.setProperty('--color', this.value);
            controlIndicator.innerHTML = `Color changed to ${this.value}`;
            musicPlayer.classList.add('indi');
            musicLove();
            document.cookie = `color=${this.value}; expires=${daysToExpire}`;
        }
    });
    // audio speed
    let speedIndicator = 1;
    speedPlus.addEventListener('click', function(){
        if (speedIndicator < 4) {
            speedIndicator += 0.5;
        }
        speedIndi.innerHTML = speedIndicator;
        audio.playbackRate = speedIndicator;
        controlIndicator.innerHTML = `Playback speed: ${speedIndicator}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });
    speedMinus.addEventListener('click', function(){
        if (speedIndicator > 0.5) {
            speedIndicator -= 0.5;
        }
        speedIndi.innerHTML = speedIndicator;
        audio.playbackRate = speedIndicator;
        controlIndicator.innerHTML = `Playback speed: ${speedIndicator}`;
        musicPlayer.classList.add('indi');
        musicLove();
    });

    function shortcutsClassChecker(e) {
        let shortcutsClassList = ['shortcuts_list', 'shortcuts_icon', 'shortcuts', 'shortcut', 'shortcuts_title'];
        for (let i = 0; i < shortcutsClassList.length; i++) {
            if (e.classList.contains(shortcutsClassList[i])) {
                return true;
            }
        }
    }
    document.addEventListener('click', function(e){
        if (shortcutsClassChecker(e.target) || e.target.className == 'fas fa-info') {
            shortcuts.classList.add('show');
        } else{
            shortcuts.classList.remove('show');
        }
    });

    // keyboard & shortcuts
    document.addEventListener('keyup', function(e){
        if (e.keyCode == 32) {
            play.click();
        } else if (e.keyCode == 37) {
            audioBackward.click();
        } else if (e.keyCode == 39) {
            audioForward.click();
        } else if (e.keyCode == 80) {
            audioListIcon.click();
        } else if (e.keyCode == 76) {
            love.click();
        } else if (e.keyCode == 86) {
            volumeIcon.click();
        } else if (e.keyCode == 68) {
            document.querySelector('.audio_download').click();
        } else if (e.keyCode == 73) {
            document.querySelector('.shortcuts_icon').click();
        } if (e.ctrlKey && e.altKey && e.keyCode == 77) {
            speedMinus.click();
        } if (e.ctrlKey && e.altKey && e.keyCode == 80) {
            speedPlus.click();
        } if (e.ctrlKey && e.shiftKey && (e.keyCode == 109 || e.keyCode == 189)) {
            volumeController('minus');
        } if (e.ctrlKey && e.shiftKey && (e.keyCode == 107 || e.keyCode == 187)) {
            volumeController('plus');
        } 
    });
}
musicPlayer();
let lines = document.querySelectorAll('.vertical');
function setEqualizer() {
    if (onEqualizer) {   
        for (let i = 0; i < lines.length; i += 1) {
            let line = lines[i];
            line.style.animation = `equalizer ${Math.random() * (0.8 - 0.3) + 0.3}s ease infinite`;
            line.style.animationDirection = 'alternate-reverse';
        }
    } else{
        for (let i = 0; i < lines.length; i += 1) {
            let line = lines[i];
            line.style.animation = `equalizer ${Math.random() * (0.8 - 0.3) + 0.3}s ease`;
            line.style.animationDirection = 'alternate-reverse';
        }
    }
}