// Watch Page JavaScript - La Casa de Papel

document.addEventListener('DOMContentLoaded', function () {

    // ======= Audio Elements ======= //
    const likeSound = document.getElementById('likeSound');
    const dislikeSound = document.getElementById('dislikeSound');
    const favoriteSound = document.getElementById('favoriteSound');

    // Set volume for all sounds
    if (likeSound) likeSound.volume = 0.5;
    if (dislikeSound) dislikeSound.volume = 0.5;
    if (favoriteSound) favoriteSound.volume = 0.5;

    // Function to play sound
    function playSound(audioElement) {
        if (audioElement) {
            try {
                audioElement.currentTime = 0;
                const playPromise = audioElement.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Son joué avec succès');
                        })
                        .catch(error => {
                            console.log('Erreur de lecture audio:', error);
                        });
                }
            } catch (e) {
                console.error('Erreur lors de la lecture du son:', e);
            }
        }
    }

    // ======= Global Selectors ======= //
    const seasonButtons = document.querySelectorAll('.season-btn');
    const episodeCards = document.querySelectorAll('.episode-card');

    // ======= Season Selector Logic ======= //
    function showSeason(seasonNumber) {
        console.log(`Affichage de la Saison ${seasonNumber}`);
        episodeCards.forEach(card => {
            if (card.dataset.season === seasonNumber) {
                card.style.display = "flex";
                card.style.opacity = "1";
                card.style.transform = "none";
                card.style.visibility = "visible";
            } else {
                card.style.display = "none";
            }
        });
    }

    seasonButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            seasonButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const season = this.dataset.season;

            if (favoriteSound) playSound(favoriteSound);
            showSeason(season);
        });
    });

    // ======= Video Player Logic (Inline) ======= //
    const videoPlayerArea = document.getElementById('videoPlayerArea');
    const mainVideoPlayer = document.getElementById('mainVideoPlayer');
    const currentVideoTitle = document.getElementById('currentVideoTitle');
    const currentVideoDesc = document.getElementById('currentVideoDesc');

    window.playEpisode = function (videoSrc, title, description) {
        console.log("Play triggered for:", videoSrc);

        const area = document.getElementById('videoPlayerArea');
        const player = document.getElementById('mainVideoPlayer');
        const titleEl = document.getElementById('currentVideoTitle');
        const descEl = document.getElementById('currentVideoDesc');

        if (!area || !player) {
            console.error("Video elements not found!");
            return;
        }

        // 1. Update text
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;

        // 2. Set source
        player.src = videoSrc;

        // 3. Force show
        area.classList.remove('hidden');
        area.style.display = 'block';

        // 4. Scroll
        area.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 5. Play
        player.load();
        player.play().catch(err => {
            console.warn("Autoplay block, please click play manually", err);
        });
    };


    // ======= Animations ======= //
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero
        gsap.from('.watch-poster', { duration: 1, x: -100, opacity: 0 });
        gsap.from('.watch-details', { duration: 1, x: 100, opacity: 0, delay: 0.3 });

        // Show season buttons and episodes grid immediately visible
        gsap.set('.season-btn, .episode-card', { opacity: 1, y: 0 });
    }

    // ======= Like/Dislike ======= //
    const likeBtn = document.querySelector('.btn-like');
    const dislikeBtn = document.querySelector('.btn-dislike');
    const favoriteBtn = document.querySelector('.btn-favorite');

    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            if (dislikeBtn) dislikeBtn.classList.remove('active');
            if (this.classList.contains('active')) playSound(likeSound);
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            if (likeBtn) likeBtn.classList.remove('active');
            if (this.classList.contains('active')) playSound(dislikeSound);
        });
    }

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            if (this.classList.contains('active')) playSound(favoriteSound);
        });
    }

    // ======= Splash Screen ======= //
    const splash = document.querySelector('.splash');
    if (splash) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            splash.classList.add('zoom-out');
            document.body.style.overflow = '';
            setTimeout(() => {
                splash.style.display = 'none';
                // Trigger initial show
                showSeason("1");
            }, 500);
        }, 700);
    } else {
        showSeason("1");
    }

    // ======= Smooth Scroll ======= //
    window.scrollToEpisodes = function () {
        document.getElementById('episodes').scrollIntoView({ behavior: 'smooth' });
    };

});
