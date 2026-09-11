// @ts-nocheck

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");

let W = 0;
let H = 0;

let particles = [];
let rain = [];
let stars = [];

let started = false;
let finalHeart = false;

const mobile = window.innerWidth < 700;

const PARTICLES = mobile ? 1400 : 2400;


/* =====================================
   START SCREEN
===================================== */

const start = document.createElement("div");

start.id = "startScreen";

start.innerHTML = `
    <div class="startContent">

        <div class="startHeart">❤️</div>

        <div class="startTitle">
            For Buggu
        </div>

        <button id="startButton">
            TAP TO START
        </button>

    </div>
`;

document.body.appendChild(start);


/* =====================================
   START SCREEN CSS
===================================== */

const style = document.createElement("style");

style.textContent = `

#startScreen {
    position: fixed;
    inset: 0;
    z-index: 99999;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        radial-gradient(
            circle,
            rgba(255,0,100,.12),
            #050005 55%,
            #000 100%
        );

    transition: opacity .5s ease;
}

.startContent {
    text-align: center;
}

.startHeart {
    font-size: 70px;

    margin-bottom: 15px;

    filter:
        drop-shadow(0 0 15px #ff1680);

    animation:
        heartbeat 1.1s infinite;
}

.startTitle {
    color: white;

    font-family: Arial, sans-serif;

    font-size: 28px;

    font-weight: bold;

    letter-spacing: 2px;

    margin-bottom: 25px;

    text-shadow:
        0 0 12px #ff1680;
}

#startButton {

    border: 1px solid #ff3b98;

    background:
        rgba(255,0,100,.12);

    color: white;

    padding:
        14px 28px;

    border-radius: 30px;

    font-size: 14px;

    font-weight: bold;

    letter-spacing: 2px;

    box-shadow:
        0 0 18px
        rgba(255,0,100,.25);
}

@keyframes heartbeat {

    0%,100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.12);
    }

}

`;

document.head.appendChild(style);


/* =====================================
   RESIZE
===================================== */

function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );

    canvas.width =
        Math.floor(W * dpr);

    canvas.height =
        Math.floor(H * dpr);

    canvas.style.width =
        W + "px";

    canvas.style.height =
        H + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createRain();
    createStars();
}

window.addEventListener(
    "resize",
    resize
);


/* =====================================
   STARS
===================================== */

function createStars() {

    stars = [];

    for (
        let i = 0;
        i < (mobile ? 70 : 120);
        i++
    ) {

        stars.push({

            x: Math.random() * W,

            y: Math.random() * H,

            size:
                .4 +
                Math.random() * 1.3,

            alpha:
                .05 +
                Math.random() * .3,

            speed:
                .001 +
                Math.random() * .003
        });
    }
}


function drawStars() {

    for (const s of stars) {

        s.alpha += s.speed;

        if (
            s.alpha > .4 ||
            s.alpha < .05
        ) {
            s.speed *= -1;
        }

        ctx.globalAlpha =
            s.alpha;

        ctx.fillStyle =
            "#ffb5d5";

        ctx.beginPath();

        ctx.arc(
            s.x,
            s.y,
            s.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}


/* =====================================
   MATRIX RAIN
===================================== */

const chars =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}$#@";


function createRain() {

    rain = [];

    for (
        let i = 0;
        i < (mobile ? 35 : 60);
        i++
    ) {

        rain.push({

            x:
                Math.random() * W,

            y:
                Math.random() * H -
                500,

            speed:
                .8 +
                Math.random() * 2,

            length:
                7 +
                Math.floor(
                    Math.random() * 10
                )
        });
    }
}


function drawRain() {

    ctx.save();

    ctx.font =
        "11px monospace";

    ctx.textAlign =
        "center";

    for (const r of rain) {

        for (
            let j = 0;
            j < r.length;
            j++
        ) {

            const y =
                r.y -
                j * 13;

            if (
                y < -10 ||
                y > H + 10
            ) {
                continue;
            }

            ctx.fillStyle =
                "rgba(255,35,125," +
                Math.max(
                    .01,
                    .13 -
                    j * .012
                ) +
                ")";

            const char =
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ];

            ctx.fillText(
                char,
                r.x,
                y
            );
        }

        r.y += r.speed;

        if (
            r.y >
            H + 150
        ) {

            r.y =
                -Math.random() * 400;

            r.x =
                Math.random() * W;
        }
    }

    ctx.restore();
}


/* =====================================
   BACKGROUND
===================================== */

function drawBackground() {

    const g =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            0,
            W / 2,
            H / 2,
            Math.max(W, H) * .75
        );

    g.addColorStop(
        0,
        "rgba(255,0,100,.07)"
    );

    g.addColorStop(
        .4,
        "rgba(120,0,70,.035)"
    );

    g.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = g;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


/* =====================================
   MAKE TEXT
===================================== */

function makeTextPoints(text) {

    const off =
        document.createElement(
            "canvas"
        );

    const octx =
        off.getContext("2d");

    const fontSize =
        Math.min(
            W * .30,
            210
        );

    octx.font =
        "bold " +
        fontSize +
        "px Arial";

    const width =
        octx.measureText(text).width;

    off.width =
        Math.ceil(
            width + 50
        );

    off.height =
        Math.ceil(
            fontSize * 1.4
        );

    octx.font =
        "bold " +
        fontSize +
        "px Arial";

    octx.textAlign =
        "center";

    octx.textBaseline =
        "middle";

    octx.fillStyle =
        "#ffffff";

    octx.fillText(
        text,
        off.width / 2,
        off.height / 2
    );

    const data =
        octx.getImageData(
            0,
            0,
            off.width,
            off.height
        );

    const points = [];

    const gap =
        mobile ? 3 : 2.5;

    for (
        let y = 0;
        y < off.height;
        y += gap
    ) {

        for (
            let x = 0;
            x < off.width;
            x += gap
        ) {

            const index =
                (
                    Math.floor(y) *
                    off.width +
                    Math.floor(x)
                ) * 4;

            if (
                data.data[index + 3] >
                100
            ) {

                points.push({

                    x:
                        W / 2 -
                        off.width / 2 +
                        x,

                    y:
                        H / 2 -
                        off.height / 2 +
                        y
                });
            }
        }
    }

    return points;
}


/* =====================================
   CREATE PARTICLES
===================================== */

function createParticles(points) {

    particles = [];

    if (!points.length) {
        return;
    }

    const amount =
        Math.min(
            points.length,
            PARTICLES
        );

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const t =
            points[
                Math.floor(
                    Math.random() *
                    points.length
                )
            ];

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            Math.max(W, H) *
            (
                .4 +
                Math.random() * .6
            );

        particles.push({

            x:
                W / 2 +
                Math.cos(angle) *
                distance,

            y:
                H / 2 +
                Math.sin(angle) *
                distance,

            tx: t.x,

            ty: t.y,

            size:
                .7 +
                Math.random() * 1.5,

            alpha:
                .5 +
                Math.random() * .5,

            speed:
                .06 +
                Math.random() * .035
        });
    }
}


/* =====================================
   SHOW TEXT
===================================== */

function showText(text) {

    finalHeart = false;

    createParticles(
        makeTextPoints(text)
    );
}


/* =====================================
   EXPLODE
===================================== */

function explode() {

    for (const p of particles) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const force =
            150 +
            Math.random() * 400;

        p.tx =
            p.x +
            Math.cos(angle) *
            force;

        p.ty =
            p.y +
            Math.sin(angle) *
            force;
    }
}


/* =====================================
   HEART
===================================== */

function makeHeartPoints() {

    const points = [];

    const size =
        Math.min(
            W * .62,
            440
        );

    for (
        let y = -1.25;
        y <= 1.15;
        y += mobile ? .025 : .018
    ) {

        for (
            let x = -1.25;
            x <= 1.25;
            x += mobile ? .025 : .018
        ) {

            const equation =
                Math.pow(
                    x * x +
                    y * y -
                    1,
                    3
                )
                -
                x * x *
                Math.pow(y, 3);

            if (equation <= 0) {

                points.push({

                    x:
                        W / 2 +
                        x *
                        size *
                        .47,

                    y:
                        H / 2 -
                        y *
                        size *
                        .40
                });
            }
        }
    }

    return points;
}


function showHeart() {

    finalHeart = true;

    createParticles(
        makeHeartPoints()
    );
}


/* =====================================
   DRAW PARTICLES
===================================== */

function drawParticles() {

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    for (const p of particles) {

        p.x +=
            (p.tx - p.x) *
            p.speed;

        p.y +=
            (p.ty - p.y) *
            p.speed;

        ctx.globalAlpha =
            p.alpha;

        ctx.fillStyle =
            finalHeart
                ? "#ff3b98"
                : "#ffe2ed";

        ctx.fillRect(
            p.x,
            p.y,
            p.size,
            p.size
        );
    }

    ctx.restore();
}


/* =====================================
   FINAL TEXT
===================================== */

function drawFinalText() {

    if (!finalHeart) {
        return;
    }

    ctx.save();

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    const size =
        Math.min(
            W * .047,
            30
        );

    ctx.font =
        "bold " +
        size +
        "px Arial";

    ctx.fillStyle =
        "#ffffff";

    ctx.shadowColor =
        "#ff2585";

    ctx.shadowBlur =
        12;

    ctx.fillText(
        "I Love You Buggu",
        W / 2,
        H / 2
    );

    ctx.restore();
}


/* =====================================
   ANIMATION
===================================== */

function animate() {

    ctx.fillStyle =
        "#020002";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    drawStars();

    drawRain();

    drawParticles();

    drawFinalText();

    requestAnimationFrame(
        animate
    );
}


/* =====================================
   SEQUENCE
===================================== */

function runSequence() {

    /* 3 */

    showText("3");

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("2");
        }, 250);

    }, 1500);


    /* 1 */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("1");
        }, 250);

    }, 3000);


    /* YOU */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("You");
        }, 300);

    }, 4500);


    /* ARE */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("Are");
        }, 300);

    }, 6300);


    /* MY */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("My");
        }, 300);

    }, 8100);


    /* LOVE */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showText("Love");
        }, 300);

    }, 9900);


    /* HEART */

    setTimeout(() => {

        explode();

        setTimeout(() => {
            showHeart();
        }, 700);

    }, 12200);
}


/* =====================================
   TAP TO START
===================================== */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        function () {

            if (started) {
                return;
            }

            started = true;

            /*
               Start animation
               immediately.
            */

            runSequence();

            /*
               Start song 2.6 sec later.
               Song ~10.4 sec.
               Animation ~13 sec.
            */

            setTimeout(
                function () {

                    if (
                        bgMusic &&
                        typeof bgMusic.play ===
                        "function"
                    ) {

                        bgMusic.currentTime = 0;

                        bgMusic.play()
                            .catch(
                                function (error) {
                                    console.log(
                                        "Audio error:",
                                        error
                                    );
                                }
                            );
                    }

                },
                2600
            );

            start.style.opacity = "0";

            setTimeout(
                function () {
                    start.remove();
                },
                500
            );
        }
    );


/* =====================================
   START
===================================== */

resize();

animate();