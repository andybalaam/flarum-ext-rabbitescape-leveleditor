import { extend } from 'flarum/extend';
import Post from 'flarum/components/Post';


function loadLevelEditor(viewDiv) {
    return function() {
        // Find the nearby ```rel code block
        var c = viewDiv.parentNode.querySelector("code.language-rel");
        if (!c) {;
            return;  // Nothing to do if there isn't one
        }

        if (typeof(Elm) == "undefined") {
            // The Elm script tag was loaded for a different post,
            // but has not executed yet.  Try again in a bit.
            setTimeout(loadLevelEditor(viewDiv), 100);
            return;
        }

        c.style.display = "none";
        var showCode = document.createElement("a");
        showCode.style.fontSize = "75%"
        showCode.innerHTML = "&lt;show code&gt;";
        showCode.onclick = function() {
            if (c.style.display == "none") {
                showCode.innerHTML = "&lt;hide code&gt;";
                c.style.display = "inherit";
            } else {
                c.style.display = "none";
                showCode.innerHTML = "&lt;show code&gt;";
            }
        };
        c.parentNode.appendChild(showCode)

        // Run the Elm program, which replaces that div
        var app = Elm.Main.init({
            node: viewDiv,
            flags: {
                worldText: c.innerHTML,
                mode: "View",
                urlPrefix: "/rabbit-escape/level-editor/"
            }
        });
    };
};

function findOrCreateStyleLink() {
    if (!document.getElementById("level-editor-style")) {
        var style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "/rabbit-escape/level-editor/style.css";
        style.id = "level-editor-style";
        document.head.appendChild(style);
    }
}

function findOrCreateScriptLink(callback) {
    if (document.getElementById("level-editor-script")) {
        callback();
    } else {
        var script = document.createElement("script");
        script.onload = callback;
        script.src = "/rabbit-escape/level-editor/level-editor.js";
        script.id = "level-editor-script";
        document.head.appendChild(script);
    }
}

function prepLevelEditor(viewDiv) {
    findOrCreateStyleLink();
    findOrCreateScriptLink(loadLevelEditor(viewDiv));
}

app.initializers.add('rabbitescape-leveleditor', function() {
    extend(Post.prototype, 'view', function(article) {
        var div = article.children[0];
        if (typeof(div.children) == "undefined") {
            return;  // This was a "retain" - do nothing, even though we'd
                     // actually like to update here.
        }
        var headerAndBody = div.children[1];
        headerAndBody.splice(1, 0, m('div', {config: prepLevelEditor}));
    });
});
