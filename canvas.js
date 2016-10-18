document.addEventListener("DOMContentLoaded", function() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;

        redraw();
    }
})