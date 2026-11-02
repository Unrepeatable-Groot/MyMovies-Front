# MyMovies Frontend

MyMovies is a Georgian movie streaming catalog. This repository contains the Angular frontend, which lets visitors browse films, series and animations, sign up, comment, react to titles and build a personal list of favorites. It talks to a separate backend API.

## What Visitors Can Do

The home page highlights the newest additions and the most popular titles for each of the three categories: films, series and animations. Each row shows a few cards at once and scrolls sideways with arrow buttons. On smaller screens fewer cards are visible at a time and the arrows page through the rest.

Each category has its own page with a paginated grid of cards, newest first. A search box in the header finds titles by name from anywhere on the site.

Opening a card leads to the title's page. It shows the banner, card image and details such as year, genre, director, cast and description, along with a row of similar titles from the same category. Signed-in users can like or dislike the title, add it to their favorites, and take part in the comment section. Comments have a live character counter, a limit of 999 characters and basic validation before anything is sent to the server. Users can edit or delete their own comments, and admins can delete anyone's. Admin and Owner names appear in gold.

## Accounts and Profile

The login page has Login and Register tabs. Registration asks for a username, an email and a password, then opens a small window where the user enters the 5-digit code sent to their email. A "Forgot password?" flow guides users through entering their email, confirming a code and choosing a new password, then signs them in.

Once signed in, a round profile button with the user's picture appears in the header. The profile page shows the user's name, email and role, and lets them edit their profile and picture, change their email and change their password through modal windows. Below that is their list of favorites with a counter showing how many of the 50 allowed slots are used.

## Admin Tools

Admins and the Owner see extra controls. The profile page shows an "Add Movie" button that opens a form where they choose a category (film, series or animation) and fill in the title, images, genre, year, director, actors, description and IMDB rating. On each title's page they can open an edit form pre-filled with the existing details, or delete the title after confirming in a pop-up. These pages are only reachable by users with the right role, and the backend enforces the same rules.

## How It Is Built

The app is built with Angular and SCSS, with Font Awesome icons. An authentication service handles login, registration, token storage and role checks. The user id and role are read from the JWT, and the profile picture is fetched from the API and shared with the header so it updates immediately after login, logout or a profile change. API addresses live in Angular's environment files, so switching between the local and production backend only means changing one value. Layouts are responsive, with breakpoints around 1100, 780 and 576 pixels.

## Hosting

The frontend is hosted on Netlify and the backend API runs on Render. The production environment file points to the Render URL, and the backend allows the Netlify origin through its CORS policy. Because Angular is a single-page app, Netlify needs a redirect rule that sends all routes to the index page so that direct links and page refreshes work.
