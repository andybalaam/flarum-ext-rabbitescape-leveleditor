import { extend } from 'flarum/extend';
import Post from 'flarum/components/Post';


var editorId = 0;

function prepLevelEditor(eid){

    var loadLevelEditor = function(){
        var c = document.querySelector("code.language-rel");
        if (!c) {;
            return;
        }
        var div = document.getElementById(eid);
        if (!div) {
            div = document.createElement("div");
            div.id = eid;
            c.parentNode.appendChild(div);
        }
        var app = Elm.Main.init({
            node: div,
            flags: {
                worldText: c.innerHTML,
                mode: "View",
                urlPrefix: "/rabbit-escape/level-editor/",
                id: eid,
            }
        });
    };

    return function() {
        if (!document.getElementById("level-editor-style")) {
            var style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = "/rabbit-escape/level-editor/style.css";
            style.id = "level-editor-style";
            document.head.appendChild(style);
        }
        if (!document.getElementById("level-editor-script")) {
            var script = document.createElement("script");
            script.onload = loadLevelEditor;
            script.src = "/rabbit-escape/level-editor/level-editor.js";
            script.id = "level-editor-script";
            document.head.appendChild(script);
        } else {
            loadLevelEditor();
        }
    }
}

app.initializers.add('rabbitescape-leveleditor', function() {
    extend(Post.prototype, 'view', function(vdom) {
        editorId++;
        var eid = 'leveleditor' + editorId;
        vdom.children.push(m('div', {id: eid, config: prepLevelEditor(eid)}));
    });
});
