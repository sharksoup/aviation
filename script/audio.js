document.addEventListener('DOMContentLoaded', function() {
    // Аудиофайлы для каждого плеера (относительные пути из папки проекта)
    const audioTracks = {
        'audioPlayer1': {
            src: '/media/su34/rita.mp3',
            title: 'Речевой модуль РИ-65 "Рита"',
            artist: ''
        }
        // Можно добавить другие плееры:
        // 'audioPlayer2': {
        //     src: 'audio/another_track.mp3',
        //     title: 'Другой трек',
        //     artist: 'Другой исполнитель'
        // }
    };
    
    // Инициализация всех плееров на странице
    for (const playerId in audioTracks) {
        if (document.getElementById(playerId)) {
            initAudioPlayer(playerId, audioTracks[playerId]);
        }
    }
});

function initAudioPlayer(playerId, trackInfo) {
    const player = document.getElementById(playerId);
    const audio = player.querySelector('.audio-player__audio');
    const playButton = player.querySelector('.audio-player__play-button');
    const progressBar = player.querySelector('.audio-player__progress-bar');
    const timeDisplay = player.querySelector('.audio-player__time');
    const repeatButton = player.querySelector('.audio-player__repeat-button');
    const volumeButton = player.querySelector('.audio-player__volume-button');
    const volumeBar = player.querySelector('.audio-player__volume-bar');
    const titleElement = player.querySelector('.audio-player__title');
    const artistElement = player.querySelector('.audio-player__artist');
    
    // Установка информации о треке
    titleElement.textContent = trackInfo.title;
    artistElement.textContent = trackInfo.artist;
    
    // Установка источника аудио (относительный путь)
    audio.src = trackInfo.src;
    
    // Обработчик ошибок загрузки аудио
    audio.addEventListener('error', function() {
        console.error('Ошибка загрузки аудио:', trackInfo.src);
        alert('Аудиофайл не найден по указанному пути: ' + trackInfo.src);
    });
    
    // Воспроизведение/пауза
    playButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error('Ошибка воспроизведения:', error);
            });
            player.classList.add('audio-player--playing');
            player.classList.remove('audio-player--ended');
        } else {
            audio.pause();
            player.classList.remove('audio-player--playing');
        }
    });
    
    // Обновление прогресса
    audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        
        if (!isNaN(duration)) {
            progressBar.value = (currentTime / duration) * 100;
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
    });
    
    // Перемотка при изменении прогресс-бара
    progressBar.addEventListener('input', function() {
        const seekTime = audio.duration * (progressBar.value / 100);
        audio.currentTime = seekTime;
    });
    
    // Кнопка повтора
    repeatButton.addEventListener('click', function() {
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error('Ошибка воспроизведения:', error);
        });
        player.classList.add('audio-player--playing');
        player.classList.remove('audio-player--ended');
    });
    
    // Управление громкостью
    volumeBar.addEventListener('input', function() {
        audio.volume = volumeBar.value;
        updateVolumeIcon();
    });
    
    // Кнопка mute/unmute
    volumeButton.addEventListener('click', function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeBar.value = 0;
        } else {
            audio.volume = 1;
            volumeBar.value = 1;
        }
        updateVolumeIcon();
    });
    
    // Обработка окончания аудио
    audio.addEventListener('ended', function() {
        player.classList.add('audio-player--ended');
        player.classList.remove('audio-player--playing');
    });
    
    // Форматирование времени в минуты:секунды
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Обновление иконки громкости
    function updateVolumeIcon() {
        const volumeIcon = volumeButton.querySelector('.volume-icon');
        if (audio.volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (audio.volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
    
    // Инициализация громкости
    audio.volume = volumeBar.value;
    updateVolumeIcon();
}