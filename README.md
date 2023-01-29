# Docsify Live Demo

[![License][license-image]][license-url] ![GitHub top language][language-image] ![Size][size-image] ![Last Commit][commit-image]

A docsify plugin to showcase frontend code and let client interact with the code...

## Usage

To integrate this plugin into your docsify documentation, first let assume that your documentation folder `docs` has the following structure:

```
docs/
├── .nojekyll
├── index.html
├── README.md
├── assets/
│   ├── live-demo.css
│   └── live-demo.js
└── ... other files and dirs
```

With these assumption in mind

-   Add the `live-demo.css` file into to `header` section of the `index.html` file:
    `<link rel="stylesheet" href="./assets/live-demo.css" />`

-   Add the `live-demo.js` file at the bottom of the body section of `index.html` file. Make sure to add this after the `docsify` script:
    `<script src="./assets/live-demo.js"></script>`

-   Now to add a live demo container at any desired location in your mardown files, place the following snippet at the location

```markdown
<code class="live-demo" data-height=700>
    <!-- Add your initial html code here -->
    <script>
        // If needed place your javascript code here
    </script>
</code>
```

The `data-height` specifies the height (in px) of the demo container, which defaults to `500`.

To demo any library, copy the files over into the `assets` subfolder of the documentation folder. Then configure the `live demo plugin` to load the library assets by editing script section of the `index.html` file as follow:

```js
window.$docsify = {
    // ...
    // optional unless you have javascript or css files that need to be included
    liveDemo: {
        assets: [
            {
                type: "script",
                src: "./assets/my-lib.js",
            },
            {
                type: "style",
                src: "./assets/my-lib.css",
            },
        ],
    },
};
```

You can use your library in the live demo code block. E.g.

```markdown
<code class="live-demo" data-height=700>
    <!-- Make your modifications here to test this library -->
    <div id="main-container">
        <p>loading...</p>
    </div>
    <script>
        // Invoke the library
        const myLib = new MyLib();
        myLib.doSomething();
        // Do more things
        // Select the main container. 
        const $mainContainer = document.querySelector('#main-container');
        // Add a time element to the main container
        const $time = document.createElement("time");
        $time.textContent = (new Date()).toISOString();
        $mainContainer.append($time);
    </script>
</code>
```

## Example

Running the following script will automatically open a new tab in the browser and start the example app on port 8183.

```bash
cd example
npm install
npm run doc
```

## License

See [LICENSE][license-url].

## Copyright

Copyright &copy; 2022. Kossi D. T. Saka.

[license-image]: https://img.shields.io/github/license/kossidts/docsify-live-demo
[license-url]: https://github.com/kossidts/docsify-live-demo/blob/master/LICENSE
[size-image]: https://img.shields.io/github/repo-size/kossidts/docsify-live-demo?color=light
[commit-image]: https://img.shields.io/github/last-commit/kossidts/docsify-live-demo
[language-image]: https://img.shields.io/github/languages/top/kossidts/docsify-live-demo?color=yellow
