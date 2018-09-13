import { extend } from 'flarum/extend';
import Post from 'flarum/components/Post';


var inlineCode = (
    'function elmEditor() {' +
    '    var c = document.querySelector("code.language-rel");' +
    '    c.style.display = "none";' +
    '    var app = Elm.Main.init({' +
    '        node: document.getElementById("relXXX"),' +
    '        flags: c.innerHTML' +
    '    });' +
    '}' +
    'var script = document.createElement("script");' +
    'script.onload = elmEditor;' +
    'script.src = "/rabbit-escape/level-editor/level-editor.js";' +
    'document.head.appendChild(script);' +
    'var style = document.createElement("link");' +
    'style.rel = "stylesheet";' +
    'style.href = "/rabbit-escape/level-editor/style.css";' +
    'document.head.appendChild(style);' +
    ''
);


app.initializers.add('rabbitescape-leveleditor', function() {
    extend(Post.prototype, 'view', function(vdom) {
        vdom.children.push(m('div', {id: 'relXXX'}));
        vdom.children.push(
            m('script', inlineCode)
        );
    });
});
