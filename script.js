/* =========================================
   LOADING SCREEN
========================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 1000);

});


/* =========================================
   COUNTDOWN
========================================= */

/*
   GANTI TANGGAL DI SINI

   Format:

   YYYY-MM-DDTHH:MM:SS

   Contoh:
   2027-11-16T00:00:00

*/

const anniversaryDate = new Date(
    "2026-12-12T00:00:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const distance = anniversaryDate - now;


    if (distance <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }


    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );


    document.getElementById("days").innerText =
        String(days).padStart(2, "0");

    document.getElementById("hours").innerText =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").innerText =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerText =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================
   MUSIC
========================================= */

const musicButton = document.getElementById("musicButton");
const music = document.getElementById("backgroundMusic");
const musicIcon = document.getElementById("musicIcon");

const interactionEvents = ["click", "touchstart", "pointerdown", "scroll", "keydown"];

function handleFirstInteraction() {
    music.play().catch(() => {});
}

function setupInteractionAutoPlay() {
    interactionEvents.forEach(evt => {
        window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
    });
}

function removeInteractionAutoPlay() {
    interactionEvents.forEach(evt => {
        window.removeEventListener(evt, handleFirstInteraction);
    });
}

// Update tampilan tombol saat musik mulai berputar
music.addEventListener("play", () => {
    musicIcon.innerText = "Ⅱ";
    musicButton.classList.add("playing");
    removeInteractionAutoPlay();
});

// Update tampilan tombol saat musik dijeda
music.addEventListener("pause", () => {
    musicIcon.innerText = "♪";
    musicButton.classList.remove("playing");
});

// Listener untuk interaksi pertama pengguna jika autoplay dicegah browser
setupInteractionAutoPlay();

// Fungsi untuk mencoba memutar audio
function tryAutoPlay() {
    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Jika diblokir oleh browser autoplay policy, akan otomatis diputar saat user pertama kali interaksi/scroll/klik
        });
    }
}

// Coba langsung putar musik saat script dieksekusi
tryAutoPlay();

// Coba lagi saat seluruh asset dan halaman selesai dimuat
window.addEventListener("load", () => {
    tryAutoPlay();
});

// Kontrol manual tombol musik
musicButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (music.paused) {
        music.play().catch(() => {});
    } else {
        music.pause();
    }
});


/* =========================================
   SCROLL REVEAL
========================================= */

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


document
    .querySelectorAll(
        ".section-number, .section-header, .timeline-item, .photo, .letter-wrapper, .count-box"
    )
    .forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", function(e) {

            e.preventDefault();

            const target =
                document.querySelector(
                    this.getAttribute("href")
                );

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });