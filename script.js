/* =========================================
   DATE CONFIGURATION
   Ganti tanggal di sini: YYYY-MM-DDTHH:MM:SS
========================================= */

const anniversaryDateStr = "2026-12-12T00:00:00";
const anniversaryDateObj = new Date(anniversaryDateStr);
const anniversaryDate = anniversaryDateObj.getTime();

// Tampilkan teks tanggal target secara otomatis di lock screen
const gateDateText = document.getElementById("gateTargetDateText");
if (gateDateText) {
    gateDateText.innerText = anniversaryDateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* =========================================
   GATE / LOCK SCREEN
========================================= */

const gateOverlay = document.getElementById("gateOverlay");
const gateInitial = document.getElementById("gateInitial");
const gateDateAnimation = document.getElementById("gateDateAnimation");
const gateCountdown = document.getElementById("gateCountdown");
const btnMasuk = document.getElementById("btnMasuk");
const btnBukaSekarang = document.getElementById("btnBukaSekarang");
const btnKembaliGate = document.getElementById("btnKembaliGate");
const gateUnlockArea = document.getElementById("gateUnlockArea");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

// Fungsi memutar musik
function playMusic() {
    if (music) {
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }
}

// Kunci scroll halaman saat awal
document.body.classList.add("gate-locked");

// Parameter URL untuk testing/preview (misal: ?preview=true)
const urlParams = new URLSearchParams(window.location.search);
const isPreview = urlParams.has("preview") || urlParams.has("bypass") || urlParams.has("open");

// Fungsi membuka website (masuk ke beranda)
function unlockWebsite() {
    if (gateOverlay) {
        gateOverlay.classList.add("unlocked");
    }
    document.body.classList.remove("gate-locked");

    // Pastikan musik tetap berputar saat web terbuka
    playMusic();
}

// Fungsi animasi tanggal berjalan selama 2 detik
function runDateAnimation(onComplete) {
    if (!gateDateAnimation) {
        if (onComplete) onComplete();
        return;
    }

    gateInitial.classList.add("hidden");
    gateDateAnimation.classList.remove("hidden");

    const animDay = document.getElementById("animDay");
    const animMonth = document.getElementById("animMonth");
    const animYear = document.getElementById("animYear");
    const animLine = document.getElementById("gateAnimLine");
    const animLabel = document.getElementById("animDateLabel");
    const dateDisplay = document.querySelector(".gate-date-display");

    const targetDay = String(anniversaryDateObj.getDate()).padStart(2, "0");
    const targetMonth = String(anniversaryDateObj.getMonth() + 1).padStart(2, "0");
    const targetYear = String(anniversaryDateObj.getFullYear());

    if (animLine) {
        animLine.style.width = "0%";
        setTimeout(() => {
            animLine.style.width = "100%";
        }, 20);
    }

    const duration = 2000; // Tepat 2 detik
    const startTime = performance.now();

    const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Angka tahun mengunci di 1400ms
        if (elapsed < 1400) {
            const randomYear = 2020 + Math.floor(Math.random() * 7);
            if (animYear) animYear.innerText = randomYear;
        } else {
            if (animYear) animYear.innerText = targetYear;
        }

        // Angka bulan mengunci di 1700ms
        if (elapsed < 1700) {
            const randomMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
            if (animMonth) animMonth.innerText = randomMonth;
        } else {
            if (animMonth) animMonth.innerText = targetMonth;
        }

        // Angka tanggal mengunci di 2000ms
        if (elapsed < 2000) {
            const randomDay = String(1 + Math.floor(Math.random() * 31)).padStart(2, "0");
            if (animDay) animDay.innerText = randomDay;
        } else {
            if (animDay) animDay.innerText = targetDay;
        }

        if (progress >= 1) {
            clearInterval(interval);
            if (animDay) animDay.innerText = targetDay;
            if (animMonth) animMonth.innerText = targetMonth;
            if (animYear) animYear.innerText = targetYear;

            if (dateDisplay) {
                dateDisplay.classList.add("final-glow");
            }
            if (animLabel) {
                animLabel.innerText = "HARI SPESIAL KITA ♡";
                animLabel.style.color = "white";
            }

            // Setelah animasi 2 detik selesai, jeda halus 350ms sebelum masuk beranda
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 350);
        }
    }, 45);
}

// Event klik tombol MASUK di layar awal blank hitam
if (btnMasuk) {
    btnMasuk.addEventListener("click", () => {
        // Langsung putar musik seketika saat tombol MASUK dipencet
        playMusic();

        // Jalankan animasi tanggal selama 2 detik terlebih dahulu
        runDateAnimation(() => {
            const now = new Date().getTime();
            const distance = anniversaryDate - now;

            if (distance <= 0 || isPreview) {
                // Setelah animasi 2 detik, langsung masuk ke beranda
                unlockWebsite();
            } else {
                // Belum tanggalnya: tampilkan hitungan mundur & pesan, web tetap terkunci
                gateDateAnimation.classList.add("hidden");
                gateCountdown.classList.remove("hidden");
                updateCountdown();
            }
        });
    });
}

// Event klik tombol BUKA SEKARANG jika hitungan mundur sudah selesai
if (btnBukaSekarang) {
    btnBukaSekarang.addEventListener("click", () => {
        playMusic();
        unlockWebsite();
    });
}

// Event tombol kembali ke tampilan MASUK
if (btnKembaliGate) {
    btnKembaliGate.addEventListener("click", () => {
        if (music) music.pause();
        gateCountdown.classList.add("hidden");
        if (gateDateAnimation) {
            gateDateAnimation.classList.add("hidden");
            const dateDisplay = document.querySelector(".gate-date-display");
            if (dateDisplay) dateDisplay.classList.remove("final-glow");
            const animLine = document.getElementById("gateAnimLine");
            if (animLine) animLine.style.width = "0%";
            const animLabel = document.getElementById("animDateLabel");
            if (animLabel) {
                animLabel.innerText = "Mengingat kembali setiap hari bersamamu...";
                animLabel.style.color = "";
            }
        }
        gateInitial.classList.remove("hidden");
    });
}


/* =========================================
   COUNTDOWN TIMER
========================================= */

function updateCountdown() {
    const now = new Date().getTime();
    const distance = anniversaryDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const gateDaysEl = document.getElementById("gateDays");
    const gateHoursEl = document.getElementById("gateHours");
    const gateMinutesEl = document.getElementById("gateMinutes");
    const gateSecondsEl = document.getElementById("gateSeconds");

    if (distance <= 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minutesEl) minutesEl.innerText = "00";
        if (secondsEl) secondsEl.innerText = "00";

        if (gateDaysEl) gateDaysEl.innerText = "00";
        if (gateHoursEl) gateHoursEl.innerText = "00";
        if (gateMinutesEl) gateMinutesEl.innerText = "00";
        if (gateSecondsEl) gateSecondsEl.innerText = "00";

        // Tampilkan tombol buka di lock screen jika waktu sudah tiba
        if (gateUnlockArea) {
            gateUnlockArea.classList.remove("hidden");
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const strDays = String(days).padStart(2, "0");
    const strHours = String(hours).padStart(2, "0");
    const strMinutes = String(minutes).padStart(2, "0");
    const strSeconds = String(seconds).padStart(2, "0");

    if (daysEl) daysEl.innerText = strDays;
    if (hoursEl) hoursEl.innerText = strHours;
    if (minutesEl) minutesEl.innerText = strMinutes;
    if (secondsEl) secondsEl.innerText = strSeconds;

    if (gateDaysEl) gateDaysEl.innerText = strDays;
    if (gateHoursEl) gateHoursEl.innerText = strHours;
    if (gateMinutesEl) gateMinutesEl.innerText = strMinutes;
    if (gateSecondsEl) gateSecondsEl.innerText = strSeconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================
   MUSIC
========================================= */

const interactionEvents = ["click", "touchstart", "pointerdown", "scroll", "keydown"];

function handleFirstInteraction() {
    if (document.body.classList.contains("gate-locked")) {
        return;
    }
    playMusic();
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
if (music) {
    music.addEventListener("play", () => {
        if (musicIcon) musicIcon.innerText = "Ⅱ";
        if (musicButton) musicButton.classList.add("playing");
        removeInteractionAutoPlay();
    });

    // Update tampilan tombol saat musik dijeda
    music.addEventListener("pause", () => {
        if (musicIcon) musicIcon.innerText = "♪";
        if (musicButton) musicButton.classList.remove("playing");
    });
}

// Listener untuk interaksi pertama pengguna jika autoplay dicegah browser
setupInteractionAutoPlay();

// Fungsi untuk mencoba memutar audio
function tryAutoPlay() {
    if (document.body.classList.contains("gate-locked")) {
        return;
    }
    playMusic();
}

// Kontrol manual tombol musik
if (musicButton) {
    musicButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (music && music.paused) {
            playMusic();
        } else if (music) {
            music.pause();
        }
    });
}


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