console.log("Welcome to Swara Box");

// Initialize variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songListContainer = document.getElementById('songListContainer');
let next = document.getElementById('next');
let previous = document.getElementById('previous');
let volumeControl = document.getElementById('volumeControl');
let recommendationElement = document.getElementById('recommendation'); // Updated reference
let recommendButton = document.getElementById("recommendButton");

// Songs array
let songs = [
    { songName: "India’s Relations With International Countries, Foreign Policies Explained By Dr. Jaishankar", filePath: "songs/7.mp3", coverPath: "images/7.jpg" },
    { songName: "TRS , Mahabharath Decoded", filePath: "songs/14.mp3", coverPath: "images/15.jpg" },
    { songName: "Whats Really Hapenning in Manipur", filePath: "songs/20.mp3", coverPath: "images/21.jpg" },
   
];

// Function to recommend a random song
function recommendSong() {
    if (!recommendationElement) {
        console.error("Recommendation element not found in the DOM.");
        return;
    }

    let randomIndex = Math.floor(Math.random() * songs.length); // Get a random index
    let recommendedSong = songs[randomIndex]; // Select a random song

    // Display the recommended song
    recommendationElement.innerHTML = `
        <div class="recommended-song">
            <img src="${recommendedSong.coverPath}" alt="${recommendedSong.songName}">
            <h3>${recommendedSong.songName}</h3>
        </div>
    `;

    // Ensure no duplicate listeners
    recommendationElement.onclick = () => {
        songIndex = randomIndex;
        playSelectedSong();
    };
}

// Add event listener to the recommend button
if (recommendButton) {
    recommendButton.addEventListener("click", recommendSong);
} else {
    console.error("Recommend button not found in the DOM.");
}

// Automatically recommend a song when the page loads
window.onload = () => {
    populateSongs();
    recommendSong();
};

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase(); // Get search input and convert to lowercase
    const songItems = document.querySelectorAll("#songListContainer .songItem"); // Select all song items

    songItems.forEach((item) => {
        const songTitle = item.textContent.toLowerCase(); // Get the text content of the song and convert to lowercase
        if (songTitle.includes(searchQuery)) {
            item.style.display = "block"; // Show matching songs
        } else {
            item.style.display = "none"; // Hide non-matching songs
        }
    });
});

// Populate songs dynamically
function populateSongs() {
    songListContainer.innerHTML = songs.map((song, i) => `
        <div class="songItem" data-index="${i}">
            <img src="${song.coverPath}" alt="${song.songName}">
            <span class="songName">${song.songName}</span>
            <span class="timestamp"><i class="far fa-play-circle"></i></span>
        </div>
    `).join('');

    document.querySelectorAll('.songItem').forEach((item, index) => {
        item.addEventListener('click', () => {
            songIndex = index;
            playSelectedSong();
        });
    });
}

function playSelectedSong() {
    audioElement.src = songs[songIndex].filePath;
    masterSongName.textContent = songs[songIndex].songName;
    audioElement.play();
    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
    gif.style.opacity = 1;
}

// Handle play/pause button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
});

// Next button functionality
next.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSelectedSong();
});

// Previous button functionality
previous.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSelectedSong();
});

// Set initial volume
audioElement.volume = volumeControl.value / 100;
volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value / 100;
    console.log(`Volume set to: ${audioElement.volume}`);
});

// Update progress bar as the song plays
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

// Seek to a different part of the song
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});
