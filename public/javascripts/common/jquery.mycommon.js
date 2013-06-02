$.fn.fadeInWithDelay = function(){
    var delay = 0;
    return this.each(function(){
        $(this).delay(delay).animate({opacity:1}, 200);
        delay += 100;
    });
};