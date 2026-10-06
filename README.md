# bsavinson.github.io

Personal website, served by GitHub Pages at https://bsavinson.github.io.

Plain HTML, CSS and JavaScript — no build step or dependencies.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Refresh the browser after editing a file.

## Edit content

The homepage is `index.html`. `writing/index.html` is a Writing page that isn't linked yet (it's marked `noindex`); when the first post goes up, add an About/Writing nav to the homepage header and remove the `noindex` tag. Styles live in `styles.css`; colours are defined as variables at the top for both light and dark themes (dark follows the visitor's OS setting). `main.js` draws the Lorenz attractor.

## Deploy

GitHub Pages publishes the `main` branch of the `bsavinson/bsavinson.github.io` repository. Pushing to `main` updates the live site, usually within a minute.
