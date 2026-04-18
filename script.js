const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "pleaaseee",
    "pakkaaa?",
    "inkosari alochinchu",
    "place nee istam bakery aina okayy :)",
    "ok anu :(",
    "nen malli adga mari nee istam",
    "Last chance.",
    "You still cannot catch me."
]

const yesTeasePokes = [
    "Try saying no first. I dare you.",
    "Go on, hit no once.",
    "You are missing the fun part.",
    "Click no. Just once."
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')
const MUSIC_START_DELAY_MS = 12000

function updateMusicIcon() {
    musicToggle.textContent = musicPlaying ? '🔊' : '🔇'
}

async function tryStartMusic() {
    try {
        // Start muted first to satisfy autoplay rules, then unmute.
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

music.volume = 0.3
setTimeout(() => {
    tryStartMusic().then((started) => {
        if (started) {
            return
        }

        // Fallback: attempt playback on first user interaction.
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
}, MUSIC_START_DELAY_MS)

window.addEventListener('pageshow', () => {
    if (!musicPlaying) {
        tryStartMusic()
    }
})

function toggleMusic() {
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

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
