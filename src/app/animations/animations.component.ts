import { Component } from '@angular/core';

@Component({
  selector: 'app-animations',
  templateUrl: './animations.component.html',
  styleUrl: './animations.component.scss'
})
export class AnimationsComponent {
  series = [
    { "movieImage": "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg", "name": "Game of Thrones", "class": "A" },
    { "movieImage": "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg", "name": "Braking Bad", "class": "B" },
    { "movieImage": "https://resizing.flixster.com/0xxuABVVuzJrUT130WFHKE-irEg=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vNzUyMTFhOTktZTU4Ni00ODkyLWJlYjQtZTgxYTllZmU2OGM0LmpwZw==", "name": "Stranger Things", "class": "C" },
    { "movieImage": "https://fr.web.img6.acsta.net/c_310_420/pictures/21/05/12/16/22/0714838.jpg", "name": "Loki", "class": "D" },
    { "movieImage": "https://mykadri.tv/uploads/posts/2023-06/medium/weo5pzsz3mf4eznvy2r1oznx266.jpg", "name": "La Brea", "class": "E" },
    { "movieImage": "https://m.media-amazon.com/images/M/MV5BMTViNTY2MjMtYmUwOC00ZGYxLThjOWEtYjNjZWU3MTYwYzZmXkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg", "name": "Avatar: The Last Airbender", "class": "F" }
  ];
}
