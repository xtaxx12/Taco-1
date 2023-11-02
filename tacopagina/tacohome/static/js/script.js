let searchBtn = document.querySelector('#search-btn');
let searchForm = document.querySelector('.header .search-form');

searchBtn.onclick = () =>{
   searchBtn.classList.toggle('fa-times');
   searchForm.classList.toggle('active');
   menuBtn.classList.remove('fa-times');
   navbar.classList.remove('active');
}

let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');

menuBtn.onclick = () =>{
   menuBtn.classList.toggle('fa-times');
   navbar.classList.toggle('active');
   searchBtn.classList.remove('fa-times');
   searchForm.classList.remove('active');
}

window.onscroll = () =>{
   searchBtn.classList.remove('fa-times');
   searchForm.classList.remove('active');
   menuBtn.classList.remove('fa-times');
   navbar.classList.remove('active');
}
function openModal(modalId) {
   var modal = document.getElementById(modalId);
   modal.style.display = "block";
}

function closeModal(modalId) {
   var modal = document.getElementById(modalId);
   modal.style.display = "none";
}

// Cierra el modal si el usuario hace clic fuera del contenido
window.onclick = function(event) {
   if (event.target.className === "modal") {
       event.target.style.display = "none";
   }
};