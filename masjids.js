$(document).ready(function () {

var sideBar = document.getElementById('sidebar');

fetch('https://us-central1-cogent-tine-336309.cloudfunctions.net/mosque_get')
  .then(response => response.json())
  .then(data => { 
    let mosques = data['mosques'];
    
        for (var i =0; i < mosques.length; i++){
          console.log(mosques[i]['id'])
          $("#sidebar").append(` <li class="nav-item">
        <a href="#" class="nav-link link-dark" onclick="loadElement(this)" data-id="` + mosques[i]['id'] + `" data-name="`+ mosques[i]['name'] +`">
          <svg class="bi me-2" width="16" height="16"><use xlink:href="#home"/></svg>
          `+ mosques[i]['name'] +`
        </a>
      </li>`);
        }
  
  })
  
})