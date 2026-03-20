var curpage = 1;
var sliding = false;
var click = true;
var left = document.getElementById("left");
var right = document.getElementById("right");
var pagePrefix = "slide";
var transitionPrefix = "circle";
var svg = true;
var totalPages = 8; // Updated for your 8 screenshots

function leftSlide() {
    if (click) {
        if (curpage == 1) curpage = totalPages + 1;
        sliding = true;
        curpage--;
        svg = true;
        click = false;
        for (k = 1; k <= totalPages; k++) {
            var a1 = document.getElementById(pagePrefix + k);
            a1.className += " tran";
        }
        setTimeout(() => { move(); }, 200);
        setTimeout(() => {
            for (k = 1; k <= totalPages; k++) {
                var a1 = document.getElementById(pagePrefix + k);
                a1.classList.remove("tran");
            }
        }, 1400);
    }
}

function rightSlide() {
    if (click) {
        if (curpage == totalPages) curpage = 0;
        sliding = true;
        curpage++;
        svg = false;
        click = false;
        for (k = 1; k <= totalPages; k++) {
            var a1 = document.getElementById(pagePrefix + k);
            a1.className += " tran";
        }
        setTimeout(() => { move(); }, 200);
        setTimeout(() => {
            for (k = 1; k <= totalPages; k++) {
                var a1 = document.getElementById(pagePrefix + k);
                a1.classList.remove("tran");
            }
        }, 1400);
    }
}

function move() {
    if (sliding) {
        sliding = false;
        if (svg) {
            for (j = 1; j <= 9; j++) {
                var c = document.getElementById(transitionPrefix + j);
                c.classList.remove("steap");
                c.setAttribute("class", transitionPrefix + j + " streak");
            }
        } else {
            for (j = 10; j <= 18; j++) {
                var c = document.getElementById(transitionPrefix + j);
                c.classList.remove("steap");
                c.setAttribute("class", transitionPrefix + j + " streak");
            }
        }
        setTimeout(() => {
            for (i = 1; i <= totalPages; i++) {
                if (i == curpage) {
                    var a = document.getElementById(pagePrefix + i);
                    a.className += " up1";
                } else {
                    var b = document.getElementById(pagePrefix + i);
                    b.classList.remove("up1");
                }
            }
            sliding = true;
        }, 600);
        setTimeout(() => { click = true; }, 1700);

        setTimeout(() => {
            if (svg) {
                for (j = 1; j <= 9; j++) {
                    var c = document.getElementById(transitionPrefix + j);
                    c.classList.remove("streak");
                    c.setAttribute("class", transitionPrefix + j + " steap");
                }
            } else {
                for (j = 10; j <= 18; j++) {
                    var c = document.getElementById(transitionPrefix + j);
                    c.classList.remove("streak");
                    c.setAttribute("class", transitionPrefix + j + " steap");
                }
                sliding = true;
            }
        }, 850);
        setTimeout(() => { click = true; }, 1700);
    }
}

left.onmousedown = () => { leftSlide(); };
right.onmousedown = () => { rightSlide(); };

document.onkeydown = e => {
    if (e.keyCode == 37) { leftSlide(); }
    else if (e.keyCode == 39) { rightSlide(); }
};