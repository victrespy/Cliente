window.onload = function () {

    let contenedor = this.document.getElementsByClassName("contenedor")[0];
    contenedor.addEventListener('click', imgClick);

}

const imgClick = function (e) {

    if(e.target.tagName === "IMG") {

        let imagenes = document.querySelectorAll(".contenedor img");
        imagenes.forEach(element => {
            element.classList.remove("activo");
        });

        e.target.classList.add("activo");

        let source = e.target.getAttribute("src");

        let imgGrande = document.querySelector(".grande > div img");
        imgGrande.setAttribute("src", source);
    }
    

}