import { extend } from 'flarum/extend';
import Post from 'flarum/components/Post';
import ComposerBody from 'flarum/components/ComposerBody';


function loadLevelViewer(viewDiv) {
    return function() {
        if (typeof(Elm) == "undefined") {
            // The Elm script tag was loaded for a different post,
            // but has not executed yet.  Try again in a bit.
            setTimeout(loadLevelViewer(viewDiv), 100);
            return;
        }

        // Find the nearby ```rel code block
        var c = viewDiv.parentNode.querySelector("code.language-rel");
        if (!c) {;
            return;  // Nothing to do if there isn't one
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

function loadLevelEditor(showLink, editor, editorFullscreen, editorVdom) {
    return function() {
        if (typeof(Elm) == "undefined") {
            console.log("No Elm");
            // The Elm script tag was loaded for a different post,
            // but has not executed yet.  Try again in a bit.
            setTimeout(loadLevelEditor(showLink), 100);
            return;
        }

        // Find the nearby textarea
        var textarea = showLink.parentNode.parentNode.parentNode.querySelector(
            "textarea.Composer-flexible");
        if (!textarea) {;
            console.log("No textarea");
            return;  // Should not happen - there is no textarea.  Give up.
        }

        var postContents = textarea.value;
        var levelStart = postContents.indexOf("```rel\n");
        var worldText = "";
        if (levelStart == -1 ) {
            worldText = "###\n# #\n###"
        } else {
            var levelEnd = postContents.indexOf("```", levelStart + 7);
            if (levelEnd == -1) {
                levelEnd = postContents.length
            }
            worldText = postContents.substring(levelStart + 7, levelEnd);
        }

        // Run the Elm program
        var app = Elm.Main.init({
            node: editor,
            flags: {
                worldText: worldText,
                mode: "Edit",
                urlPrefix: "/rabbit-escape/level-editor/"
            }
        });
        app.ports.saveAndQuit.subscribe(function(data) {
            var level = "```rel\n"+ data + "\n```";
            var newValue = "";
            if (levelStart == -1) {
                newValue = level + postContents;
            }
            else {
                newValue = (
                    postContents.substring(0, levelStart) +
                    level +
                    postContents.substring(levelEnd + 3)
                );
            }

            editorVdom.setValue(newValue);
            editorFullscreen.style.visibility = "hidden";
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

function prepLevelViewer(viewDiv) {
    findOrCreateStyleLink();
    findOrCreateScriptLink(loadLevelViewer(viewDiv));
}

function prepShowLevelEditor(editorVdom) {
    return function (showLink) {
        showLink.onclick = function() {
            var editorFullscreen = document.createElement("div");
            var editor = document.createElement("div");
            document.body.appendChild(editorFullscreen);
            editorFullscreen.style.position = "fixed";
            editorFullscreen.style.top = "0px";
            editorFullscreen.style.left = "0px";
            editorFullscreen.style.bottom = "0px";
            editorFullscreen.style.right = "0px";
            editorFullscreen.style.zIndex = "2001";
            editorFullscreen.style.backgroundColor = "white";
            editorFullscreen.appendChild(editor)

            findOrCreateStyleLink();
            findOrCreateScriptLink(
                loadLevelEditor(
                    showLink,
                    editor,
                    editorFullscreen,
                    editorVdom
                )
            );
        }
    }
}


app.initializers.add('rabbitescape-leveleditor', function() {

    extend(Post.prototype, 'view', function(article) {
        var div = article.children[0];
        if (typeof(div.children) == "undefined") {
            return;  // This was a "retain" - do nothing, even though we'd
                     // actually like to update here.
        }
        var headerAndBody = div.children[1];
        headerAndBody.splice(1, 0, m('div', {config: prepLevelViewer}));
    });

    extend(ComposerBody.prototype, 'view', function(composer) {
        composer.children.unshift(
            m('div',
                m(
                    'div',
                    {style: "margin: 0.5em"},
                    m(
                        'a',
                        {config:prepShowLevelEditor(this.editor)},
                        "<show level editor>"
                    )
                )
            )
        );
    });

});
