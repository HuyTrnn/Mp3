/* Task 
1. render song --- done
2. scroll top ---done
3. play/ pause / seek --done
4. CD rotate -- done
5. Next/ prev -- done
6. Random   -- done
7. Next / repeat if end 
8. Active song
9. scroll song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_Learn'

const player = $('.player');
const heading = $('header h2');
const cdthumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Cháu đích tôn',
            author: 'Kidz',
            image: './assets/imgs/chaudichton.jpg',
            path: './assets/music/chaudichton.mp3'
        },
        {
            name: 'Hà Nội xịn',
            author: 'LK',
            image: './assets/imgs/hanoixin.jpg',
            path: './assets/music/hanoixin.mp3'
        },
        {
            name: 'Chìm sâu',
            author: 'MCK',
            image: './assets/imgs/chimSau.jpg',
            path: './assets/music/chimsau.mp3'
        },
        {
            name: 'Quan hệ rộng',
            author: 'Bình Gold',
            image: './assets/imgs/qhrong.jpg',
            path: './assets/music/qhrong.mp3'
        },
        {
            name: 'Cua',
            author: 'HIEUTHUHAI',
            image: './assets/imgs/cua.jpg',
            path: './assets/music/cua.mp3'
        },
        {
            name: 'Cháu đích tôn',
            author: 'Kidz',
            image: './assets/imgs/chaudichton.jpg',
            path: './assets/music/chaudichton.mp3'
        },
        {
            name: 'Hà Nội xịn',
            author: 'LK',
            image: './assets/imgs/hanoixin.jpg',
            path: './assets/music/hanoixin.mp3'
        },
        {
            name: 'Chìm sâu',
            author: 'MCK',
            image: './assets/imgs/chimSau.jpg',
            path: './assets/music/chimsau.mp3'
        },
        {
            name: 'Quan hệ rộng',
            author: 'Bình Gold',
            image: './assets/imgs/qhrong.jpg',
            path: './assets/music/qhrong.mp3'
        },
        {
            name: 'Cua',
            author: 'HIEUTHUHAI',
            image: './assets/imgs/cua.jpg',
            path: './assets/music/cua.mp3'
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb"
                style="background-image: url('${song.image}')"> 
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playList.innerHTML = htmls.join('\n');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent : function () {
        const _this = this;
        const cdwidth = cd.offsetWidth;
        const isRandom = false;
        const isRepeat = false;

        // CD rotate
        const  cdRotate = cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 20000,
            iterations: Infinity
        })
        cdRotate.pause();
        
        // Handle zoom or out cd
        document.onscroll = function () {
            const cdscrolltop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cdwidth - cdscrolltop;
            
            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0;
            cd.style.opacity = newCdwidth / cdwidth;
        }
        
        //Handle play btn
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {              
                audio.play();
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdRotate.play();
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdRotate.pause();
        }

        // get time
        audio.ontimeupdate = function () {
            if(audio.duration){
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
        }

        // seeking
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Next / prev position
        nextBtn.onclick = nextSong = function () {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
            _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        }
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
            _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();

        }

        // Random song when turn on
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);    
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Repeat song

        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);    
            repeatBtn.classList.toggle('active', _this.isRepeat)
            
        }

        // Next song when song end
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play();
            } else {

                nextSong();
            }
        }

            // Click on playList
        playList.onclick = function (e) {
            const nodeSong = e.target.closest('.song:not(.active)')
            if(nodeSong || e.target.closest('.option')){
                // Handle when click on song
                if(nodeSong) {
                    _this.currentIndex= Number(nodeSong.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Handle when click on option
                if(e.target.closest('.option')) {

                }
            }
        }
    },

    scrolltoActiveSong: function () {
        setTimeout(() => {
            if(this.currentIndex === 0 || this.currentIndex === 1 || this.currentIndex === 2) {
                $('.song.active').scrollIntoView(
                    {
                        behavior: 'smooth',
                        block: 'center'
                    })
            } else {
                $('.song.active').scrollIntoView(
                    {
                        behavior: 'smooth',
                        block: 'nearest'
                    })
            }
        }, 100)
    },

    loadCurrentSong : function () {
        
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src =this.currentSong.path;
    },

    loadConfig : function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Load config into app
        this.loadConfig();
        // Define properties for object
        this.defineProperties();
        // listen and handle event in DOM
        this.handleEvent();
        
        // Get first song in UI when start
        this.loadCurrentSong();
        
        this.render();

        
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);

    }
}

app.start()