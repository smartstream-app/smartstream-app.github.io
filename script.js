// -------------------------------------------------
// ------------------ Utilities --------------------
// -------------------------------------------------

const wrap = (n, max) => (n + max) % max;
const lerp = (a, b, t) => a + (b - a) * t;

const genId = (() => {
    let count = 0;
    return () => { return (count++).toString(); };
})();

class Raf {
    constructor() {
        this.rafId = 0;
        this.raf = this.raf.bind(this);
        this.callbacks = [];
        this.start();
    }
    start() { this.raf(); }
    stop() { cancelAnimationFrame(this.rafId); }
    raf() {
        this.callbacks.forEach(({ callback, id }) => callback({ id }));
        this.rafId = requestAnimationFrame(this.raf);
    }
    add(callback, id) { this.callbacks.push({ callback, id: id || genId() }); }
    remove(id) { this.callbacks = this.callbacks.filter((callback) => callback.id !== id); }
}

class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    set(x, y) { this.x = x; this.y = y; }
    lerp(v, t) {
        this.x = lerp(this.x, v.x, t);
        this.y = lerp(this.y, v.y, t);
    }
}

const vec2 = (x = 0, y = 0) => new Vec2(x, y);

function tilt(node, options) {
    let { trigger, target } = resolveOptions(node, options);
    let lerpAmount = 0.06;
    const rotDeg = { current: vec2(), target: vec2() };
    const bgPos = { current: vec2(), target: vec2() };

    let rafId;

    function ticker({ id }) {
        rafId = id;
        rotDeg.current.lerp(rotDeg.target, lerpAmount);
        bgPos.current.lerp(bgPos.target, lerpAmount);

        for (const el of target) {
            el.style.setProperty("--rotX", rotDeg.current.y.toFixed(2) + "deg");
            el.style.setProperty("--rotY", rotDeg.current.x.toFixed(2) + "deg");
            el.style.setProperty("--bgPosX", bgPos.current.x.toFixed(2) + "%");
            el.style.setProperty("--bgPosY", bgPos.current.y.toFixed(2) + "%");
        }
    }

    const onMouseMove = ({ offsetX, offsetY }) => {
        lerpAmount = 0.1;
        for (const el of target) {
            const ox = (offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
            const oy = -(offsetY - el.clientHeight * 0.5) / (Math.PI * 4);
            rotDeg.target.set(ox, oy);
            bgPos.target.set(-ox * 0.3, oy * 0.3);
        }
    };

    const onMouseLeave = () => {
        lerpAmount = 0.06;
        rotDeg.target.set(0, 0);
        bgPos.target.set(0, 0);
    };

    const addListeners = () => {
        trigger.addEventListener("mousemove", onMouseMove);
        trigger.addEventListener("mouseleave", onMouseLeave);
    };

    const init = () => {
        addListeners();
        raf.add(ticker);
    };

    init();
    return {};
}

function resolveOptions(node, options) {
    return {
        trigger: options?.trigger ?? node,
        target: options?.target ? (Array.isArray(options.target) ? options.target : [options.target]) : [node]
    };
}

// -----------------------------------------------------

const raf = new Raf();
let currentIndex = 0;
let totalSlides = 8; // Adapted for your 8 screenshots

function init() {
    const loader = document.querySelector(".loader");
    const slides = [...document.querySelectorAll(".slide")];
    const slidesInfo = [...document.querySelectorAll(".slide-info")];
    const buttons = {
        prev: document.querySelector(".slider--btn__prev"),
        next: document.querySelector(".slider--btn__next")
    };

    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";

    slides.forEach((slide, i) => {
        const slideInner = slide.querySelector(".slide__inner");
        const slideInfoInner = slidesInfo[i].querySelector(".slide-info__inner");
        tilt(slide, { target: [slideInner, slideInfoInner] });
    });

    buttons.prev.addEventListener("click", change(-1));
    buttons.next.addEventListener("click", change(1));
}

function setup() {
    const loaderText = document.querySelector(".loader__text");
    const images = [...document.querySelectorAll(".slide--image")];
    const totalImages = images.length;
    let loadedImages = 0;
    let progress = { current: 0, target: 0 };

    if (totalImages === 0) {
        init();
        return;
    }

    images.forEach((image) => {
        imagesLoaded(image, (instance) => {
            if (instance.isComplete) {
                loadedImages++;
                progress.target = loadedImages / totalImages;
            }
        });
    });

    raf.add(({ id }) => {
        progress.current = lerp(progress.current, progress.target, 0.06);
        const progressPercent = Math.round(progress.current * 100);
        loaderText.textContent = `${progressPercent}%`;

        if (progressPercent >= 99) {
            init();
            raf.remove(id);
        }
    });
}

function change(direction) {
    return () => {
        const slides = [...document.querySelectorAll(".slide")];
        const slideInfos = [...document.querySelectorAll(".slide-info")];
        const slideBgs = [...document.querySelectorAll(".slide__bg")];

        // Clear all states
        slides.forEach(el => { el.removeAttribute("data-current"); el.removeAttribute("data-next"); el.removeAttribute("data-previous"); });
        slideInfos.forEach(el => { el.removeAttribute("data-current"); el.removeAttribute("data-next"); el.removeAttribute("data-previous"); });
        slideBgs.forEach(el => { el.removeAttribute("data-current"); el.removeAttribute("data-next"); el.removeAttribute("data-previous"); });

        // Calculate new indices for 8 slides
        currentIndex = wrap(currentIndex + direction, totalSlides);
        const nextIndex = wrap(currentIndex + 1, totalSlides);
        const prevIndex = wrap(currentIndex - 1, totalSlides);

        // Apply new states
        slides[currentIndex].setAttribute("data-current", "");
        slideInfos[currentIndex].setAttribute("data-current", "");
        slideBgs[currentIndex].setAttribute("data-current", "");

        slides[nextIndex].setAttribute("data-next", "");
        slideInfos[nextIndex].setAttribute("data-next", "");
        slideBgs[nextIndex].setAttribute("data-next", "");

        slides[prevIndex].setAttribute("data-previous", "");
        slideInfos[prevIndex].setAttribute("data-previous", "");
        slideBgs[prevIndex].setAttribute("data-previous", "");

        // Handle Z-Indexing for overlapping
        slides.forEach(s => s.style.zIndex = "0");
        slides[currentIndex].style.zIndex = "20";
        if (direction === 1) {
            slides[prevIndex].style.zIndex = "10";
            slides[nextIndex].style.zIndex = "30";
        } else {
            slides[prevIndex].style.zIndex = "30";
            slides[nextIndex].style.zIndex = "10";
        }
    };
}

// Start
setup();