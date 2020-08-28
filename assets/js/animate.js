(function() {
    animInterval = 0;

    let pausedFrames = 0;

    function init() {
        theSVG = document.getElementById("pcbtraces").getSVGDocument();

        if (theSVG == null) {
            return;
        } else {
            twoStop = theSVG.getElementById("stop1055");
            threeStop = theSVG.getElementById("stop1061");

            startAnim();
            document.getElementById("logo").addEventListener("mouseover",startAnim);
        }
    }

    function reset() {
        pausedFrames = 0;

        twoStop.setAttribute("offset", "0");
        threeStop.setAttribute("offset", "0");
    }

    function frame() {
        let threeStopOff = parseFloat(threeStop.getAttribute("offset"));
        let twoStopOff = parseFloat(twoStop.getAttribute("offset"));

        if (threeStopOff < 1) {
            threeStop.setAttribute("offset", threeStopOff + 0.05);
        } else if (twoStopOff < 1) {
            twoStop.setAttribute("offset", twoStopOff + 0.05);
        } else {
            clearInterval(animInterval);
            animInterval = 0;
        }
    }

    function center() {
        let logo = document.getElementById("logo");
        let pcbElement = document.getElementById("pcbtraces");

        console.log(pcbElement.clientHeight);
        console.log(window.getComputedStyle(pcbElement).getPropertyValue('height'));

        let ydiff = ((pcbElement.clientHeight/2) - (logo.getBoundingClientRect().bottom - (logo.clientHeight/2)))
        pcbElement.style.top = Math.round(-1*ydiff) + "px";
    }

    function startAnim() {
        center();
        reset();
        if (animInterval != 0) {
            clearInterval(animInterval);
        }
        animInterval = setInterval(frame, 60);
    }

    animInterval = setTimeout(init, 60);
})();
