(function() {
    var animInterval;

    theSVG = document.getElementById("pcbtraces").getSVGDocument();
    twoStop = theSVG.getElementById("stop1055");
    threeStop = theSVG.getElementById("stop1061");

    let pausedFrames = 0;

    function reset() {
        pausedFrames = 0;

        twoStop.setAttribute("offset", "0");
        threeStop.setAttribute("offset", "0");
    }

    function frame() {
        let twoStopOff = parseFloat(twoStop.getAttribute("offset"));
        let threeStopOff = parseFloat(threeStop.getAttribute("offset"));

        if (threeStopOff < 1) {
            threeStop.setAttribute("offset", threeStopOff + 0.05);
            return;
        /* } else if (pausedFrames < 1) {
            pausedFrames++;
            return; */
        } else if (twoStopOff < 1) {
            twoStop.setAttribute("offset", twoStopOff + 0.025);
            return;
        } else {
            clearInterval(animInterval);
        }
    }

    function center() {
        let logo = document.getElementById("logo");
        let pcbElement = document.getElementById("pcbtraces");

        let ydiff = ((logo.clientHeight/2) - (pcbElement.clientHeight/2))/2;
        pcbElement.style.top = Math.round(ydiff) + "px";
    }

    function startAnim() {
        reset();
        animInterval = setInterval(frame, 60);
    }

    center();
    startAnim();
    document.getElementById("logo").addEventListener("mouseover",startAnim);
})();
