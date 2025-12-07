document.addEventListener('click', function(e) {
    
    if(e.target.tagName === 'BUTTON'){
        
        let menu = document.querySelector(".nav-menu");
        menu.classList.toggle("invisible");

    }

    if (e.target.tagName === 'BODY') {
        let menu = document.querySelector(".nav-menu");
        menu.classList.add("invisible");
    }

});