let video;
jQuery(document).ready(function($) {
    video = document.getElementById('video');
    video.style.display = 'none';
    document.getElementById("button").addEventListener("click", function() {
        video = document.getElementById('video');
        if(video.style.display == 'none') {
            video.style.display = 'block';
            var elem = video;
            var fullscreen = elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
            fullscreen.call(elem);
        }
        else video.style.display = 'none';
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e)
        {
            console.log(e);
        });
    });
});