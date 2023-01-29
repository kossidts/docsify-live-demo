import "./styles.css";

const dependencies = [
    {
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/codemirror.min.js",
        id: "codemirror",
    },
    {
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/mode/css/css.min.js",
        parent_id: "codemirror",
    },
    {
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/mode/javascript/javascript.min.js",
        parent_id: "codemirror",
    },
    {
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/mode/xml/xml.min.js",
        parent_id: "codemirror",
    },
    {
        type: "script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/mode/htmlmixed/htmlmixed.min.js",
        parent_id: "codemirror",
    },
    {
        type: "style",
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/codemirror.min.css",
    },
    {
        type: "style",
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.2/theme/monokai.min.css",
    },
];

let script_assets = dependencies.filter(dependency => dependency.type === "script");
let style_assets = dependencies.filter(dependency => dependency.type === "style");
style_assets.forEach(dependency => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    dependency.type = "text/css";

    Object.keys(dependency).forEach(key => {
        link[key] = dependency[key];
    });
    document.head.append(link);
});

let loadedCount = 0;
const countLoaded = () => (loadedCount += 1);

const assets_loaded = () => loadedCount == script_assets.length;
const parents = [];
const children = [];
script_assets.forEach((dependency, index) => {
    let script = document.createElement("script");
    dependency.type = "text/javascript";

    Object.keys(dependency).forEach(key => {
        script[key] = dependency[key];
    });

    if (script.parent_id) {
        script.id = `${script.parent_id}-child${index}`;
        delete script.parent_id;
        children.push(script);
        script.onload = countLoaded;
    } else {
        if (script.id) {
            parents.push(script);
        } else {
            script.onload = countLoaded;
        }
        script.async = true;
        document.head.append(script);
    }
});

parents.forEach(script => {
    script.onload = () => {
        children
            .filter(child => child.id.split("-")[0] === script.id)
            .forEach(childscript => {
                document.head.append(childscript);
            });
        countLoaded();
    };
});

let timer = null;
function doneEach(assets) {
    if (!assets_loaded()) {
        return;
    }
    clearInterval(timer);
    const $liveDemo = document.querySelectorAll(".live-demo");
    $liveDemo.forEach($el => {
        let dataAttr = $el.dataset;
        let height = 500;
        if (dataAttr.height && !isNaN(parseInt(dataAttr.height, 10))) {
            height = parseInt(dataAttr.height, 10);
        }
        $el.style.height = height + "px";
        let $editor = $el.querySelector("textarea");
        let $preview = $el.querySelector(".preview");
        let mirrorEditor = CodeMirror.fromTextArea($editor, {
            lineNumbers: true,
            // matchBrackets: true,
            // autoCloseBrackets: true,
            mode: "htmlmixed", // "text/html", "javascript",
            theme: "monokai",
            // showCursorWhenSelecting: true,
            // enableCodeFolding: true,
            tabSize: 4,
        });
        let delay = null;
        mirrorEditor.on("change", function () {
            clearTimeout(delay);
            delay = setTimeout(() => {
                updatePreview($preview, mirrorEditor.getValue(), assets);
            }, 330);
        });
        setTimeout(() => {
            $el.classList.remove("hidden");
            updatePreview($preview, mirrorEditor.getValue(), assets);
        }, 330);
    });
}

function updatePreview($el, content, assets) {
    let $iframe = document.createElement("iframe");
    $iframe.onload = function () {
        let preview = $iframe.contentDocument || $iframe.contentWindow.document;
        preview.open();
        preview.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset=utf-8>
            <title>HTML5 canvas demo</title>
            <style>*, *::before, *::after{box-sizing: border-box;} img{max-width: 100%}</style>
            ${assets}
          </head>
          <body>
            ${content}
            </body>
            </html>
        `);
        preview.close();
    };
    $el.innerHTML = "";
    $el.appendChild($iframe);
}

function docsifyLiveDemo(hook, vm) {
    const liveDemoConfig = vm.config.liveDemo || {};

    console.log("globals..", liveDemoConfig);
    if (!liveDemoConfig.assets || !Array.isArray(liveDemoConfig.assets)) {
        liveDemoConfig.assets = [];
    }
    const assets = liveDemoConfig.assets.reduce((assets_str, current) => {
        if (current.type === "script") {
            return `${assets_str}<script type="text/javascript" src="${current.uri}"></script>`;
        } else if (current.type === "style") {
            return `${assets_str}<link rel="stylesheet" href="${current.uri}" type="text/css">`;
        }
    }, "");

    hook.afterEach(function (html, next) {
        html = html.replace(
            /<code class="live-demo"(.*?)>(.*?)<\/code>/gms,
            '<div class="live-demo hidden" $1><textarea class="editor">$2</textarea><div class="preview"></div></div>'
        );

        next(html);
    });

    hook.doneEach(function () {
        // Invoked each time after the data is fully loaded, no arguments,
        timer = setInterval(doneEach, 200, assets);
        console.log("DoneEach");
    });
}

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [].concat(window.$docsify.plugins || [], docsifyLiveDemo);
