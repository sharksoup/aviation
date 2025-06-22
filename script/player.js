document.addEventListener('DOMContentLoaded', function() {
    // Видеофайлы для каждого плеера (относительные пути из папки проекта)
    const videoSources = {
        'player1': '/media/su34/su34_ooes.mp4', // Путь к видеофайлу относительно HTML-файла
        // Можно добавить другие плееры: 'player2': 'videos/another_video.mp4'
        'player2': '/media/tu22m3/tu22m3_takeoff_video.mp4', // Путь к видеофайлу относительно HTML-файла
        // Можно добавить другие плееры: 'player2': 'videos/another_video.mp4'
        'player3': '/media/su35/su35_video.mp4' // Путь к видеофайлу относительно HTML-файла
        // Можно добавить другие плееры: 'player2': 'videos/another_video.mp4'
    };
    
    // Инициализация всех плееров на странице
    for (const playerId in videoSources) {
        if (document.getElementById(playerId)) {
            initVideoPlayer(playerId, videoSources[playerId]);
        }
    }
});

function initVideoPlayer(playerId, videoSrc) {
    const player = document.getElementById(playerId);
    const video = player.querySelector('.video-player__video');
    const playButton = player.querySelector('.video-player__play-button');
    const progressBar = player.querySelector('.video-player__progress-bar');
    const timeDisplay = player.querySelector('.video-player__time');
    const repeatButton = player.querySelector('.video-player__repeat-button');
    
    // Установка источника видео (относительный путь)
    video.src = videoSrc;
    
    // Обработчик ошибок загрузки видео
    video.addEventListener('error', function() {
        console.error('Ошибка загрузки видео:', videoSrc);
        alert('Видео не найдено по указанному пути: ' + videoSrc);
    });
    
    // Воспроизведение/пауза
    playButton.addEventListener('click', function() {
        if (video.paused) {
            video.play().catch(error => {
                console.error('Ошибка воспроизведения:', error);
            });
            player.classList.add('video-player--playing');
            player.classList.remove('video-player--ended');
        } else {
            video.pause();
            player.classList.remove('video-player--playing');
        }
    });
    
    // Обновление прогресса
    video.addEventListener('timeupdate', function() {
        const currentTime = video.currentTime;
        const duration = video.duration;
        
        if (!isNaN(duration)) {
            progressBar.value = currentTime / duration * 100;
            
            // Форматирование времени
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
    });
    
    // Перемотка при изменении прогресс-бара
    progressBar.addEventListener('input', function() {
        const seekTime = video.duration * (progressBar.value / 100);
        video.currentTime = seekTime;
    });
    
    // Кнопка повтора
    repeatButton.addEventListener('click', function() {
        video.currentTime = 0;
        video.play().catch(error => {
            console.error('Ошибка воспроизведения:', error);
        });
        player.classList.add('video-player--playing');
        player.classList.remove('video-player--ended');
    });
    
    // Обработка окончания видео
    video.addEventListener('ended', function() {
        player.classList.add('video-player--ended');
        player.classList.remove('video-player--playing');
    });
    
    // Форматирование времени в минуты:секунды
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
}