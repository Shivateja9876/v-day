let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()

    const music = document.getElementById('bg-music')
    music.volume = 0.3

    const musicToggle = document.getElementById('music-toggle')

    function updateMusicIcon() {
        musicToggle.textContent = musicPlaying ? '🔊' : '🔇'
    }

    async function tryStartMusic() {
        try {
            music.muted = true
            await music.play()
            music.muted = false
            musicPlaying = true
            updateMusicIcon()
            return true
        } catch {
            musicPlaying = false
            updateMusicIcon()
            return false
        }
    }

    tryStartMusic().then((started) => {
        if (started) {
            return
        }

        const resume = () => {
            music.muted = false
            music.play().then(() => {
                musicPlaying = true
                updateMusicIcon()
            }).catch(() => {
                musicPlaying = false
                updateMusicIcon()
            })
        }

        document.addEventListener('click', resume, { once: true })
        document.addEventListener('touchstart', resume, { once: true, passive: true })
        document.addEventListener('keydown', resume, { once: true })
    })

    window.toggleMusic = function toggleMusic() {
        if (musicPlaying) {
            music.pause()
            musicPlaying = false
            updateMusicIcon()
        } else {
            music.muted = false
            music.play().then(() => {
                musicPlaying = true
                updateMusicIcon()
            }).catch(() => {
                musicPlaying = false
                updateMusicIcon()
            })
        }
    }
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    // Initial big burst
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, 300)
}

