
// Create an observeDOM method.
// Credit: https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj ) return;

    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }

    // browser support fallback
    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})()


function createShowCodeLink(codeNode) {

    if (codeNode.parentNode.getElementsByClassName("show-code").length > 0) {
        return;
    }

    codeNode.style.display = "none";
    var showCode = document.createElement("a");
    showCode.className = "show-code";
    showCode.style.fontSize = "75%"
    showCode.innerHTML = "&lt;show code&gt;";
    showCode.onclick = function() {
        if (codeNode.style.display == "none") {
            showCode.innerHTML = "&lt;hide code&gt;";
            codeNode.style.display = "inherit";
        } else {
            codeNode.style.display = "none";
            showCode.innerHTML = "&lt;show code&gt;";
        }
    };
    codeNode.parentNode.appendChild(showCode)
}


let post_bodies = null;
let composer_footers = null;
let login_modals = null;
let signup_modals = null;

function showLevelEditor(composer_footer) {
    console.log("Show level editor");

    const textarea = composer_footer.parentNode.querySelector("textarea.Composer-flexible");
    if (!textarea) {;
        console.log("No textarea");
        return;  // Should not happen - there is no textarea.  Give up.
    }

    const editorFullscreen = document.createElement("div");
    const editor = document.createElement("div");
    document.body.appendChild(editorFullscreen);
    editorFullscreen.style.position = "fixed";
    editorFullscreen.style.top = "0px";
    editorFullscreen.style.left = "0px";
    editorFullscreen.style.bottom = "0px";
    editorFullscreen.style.right = "0px";
    editorFullscreen.style.zIndex = "2001";
    editorFullscreen.style.backgroundColor = "white";
    editorFullscreen.appendChild(editor)

    const postContents = textarea.value;
    const levelStart = postContents.indexOf("```rel\n");
    let levelEnd;
    let worldText = "";
    if (levelStart == -1 ) {
        worldText = "###\n# #\n###"
        levelEnd = 0;
    } else {
        levelEnd = postContents.indexOf("```", levelStart + 7);
        if (levelEnd == -1) {
            levelEnd = postContents.length
        }
        worldText = postContents.substring(levelStart + 7, levelEnd);
    }

    // Run the Elm program
    const app = Elm.Main.init({
        node: editor,
        flags: {
            worldText: worldText,
            mode: "Edit",
            urlPrefix: "//artificialworlds.net/rabbit-escape/level-editor/"
        }
    });
    app.ports.saveAndQuit.subscribe(function(data) {
        const level = "```rel\n"+ data + "\n```\n";
        let newValue = "";
        if (levelStart == -1) {
            newValue = level + postContents;
        }
        else {
            newValue = (
                postContents.substring(0, levelStart) +
                level +
                postContents.substring(levelEnd + 4)
            );
        }

        textarea.value = newValue;
        setTimeout(() => textarea.dispatchEvent(new InputEvent("input")), 0);

        editorFullscreen.remove();
    });
}

function process_login_modal(login_modal) {
    console.log("Processing a login modal.");

    if (login_modal.querySelector("div.rabbit-footer")) {
        // We've already added something to this dialog
        return;
    }

    const footer = document.createElement("div");
    const link = document.createElement("a");
    footer.className = "Modal-footer rabbit-footer";
    footer.innerText = "Don't want to log in?  ";
    link.href = "//artificialworlds.net/rabbit-escape/level-editor";
    link.style.color = "red";
    link.innerText = "Just make a level without saving it on the forum";
    footer.appendChild(link);
    login_modal.querySelector(".Modal-footer").before(footer);
}

function process_composer_footer(composer_footer) {
    console.log("Processing a composer footer.");

    if (composer_footer.querySelector("li.rabbit-edit")) {
        // We have already processed this composer footer
        return;
    }

    const edit_li = document.createElement("li");
    const edit_button = document.createElement("button");
    const edit_img = document.createElement("img");

    edit_li.className = "rabbit-edit";
    edit_li.style.fontWeight = "bold";
    edit_button.className = "Button";
    edit_button.type = "button";
    edit_button.style.margin = "0.5em";
    edit_button.innerText = "Edit Level";
    edit_img.src = "//artificialworlds.net/rabbit-escape/level-editor/images/rabbit_stand_right.svg";
    edit_img.style.marginLeft = "0.7em";
    edit_img.style.marginBottom = "-0.3em";
    edit_img.style.height = "1.4em";

    edit_li.appendChild(edit_button);
    edit_button.appendChild(edit_img);
    edit_button.onclick = () => showLevelEditor(composer_footer);
    composer_footer.appendChild(edit_li);
}

function process_post_body(post_body) {
    console.log("Processing a post.");

    if (post_body.querySelector("a.show-code")) {
        // We have already processed this post
        return;
    }

    const level_code = post_body.querySelector("code.language-rel");
    if (!level_code) {
        // There is no code in this post
        return;
    }

    console.log("Found a level.");

    createShowCodeLink(level_code);

    const viewDiv = document.createElement('div');
    level_code.before(viewDiv);

    Elm.Main.init({
        node: viewDiv,
        flags: {
            worldText: level_code.innerHTML,
            mode: "View",
            urlPrefix: "//artificialworlds.net/rabbit-escape/level-editor/"
        }
    });
}

function check_for_new_posts() {
    if (post_bodies === null) {
        // This is a live collection, so it updates whenever something changes.
        post_bodies = document.getElementsByClassName("Post-body");
    }
    if (composer_footers === null) {
        composer_footers = document.getElementsByClassName("Composer-footer")
    }
    if (login_modals === null) {
        login_modals = document.getElementsByClassName("LogInModal")
    }
    if (signup_modals === null) {
        signup_modals = document.getElementsByClassName("SignUpModal")
    }

    for (const post_body of post_bodies) {
        process_post_body(post_body);
    }

    for (const composer_footer of composer_footers) {
        process_composer_footer(composer_footer);
    }

    for (const login_modal of login_modals) {
        process_login_modal(login_modal);
    }
    for (const signup_modal of signup_modals) {
        process_login_modal(signup_modal);
    }
}


function findOrCreateStyleLink() {
    if (!document.getElementById("level-editor-style")) {
        var style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "//artificialworlds.net/rabbit-escape/level-editor/style.css";
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
        script.src = "//artificialworlds.net/rabbit-escape/level-editor/level-editor.js";
        script.id = "level-editor-script";
        document.head.appendChild(script);
    }
}

function setup() {
    console.log("Checking whether level editor is loaded...");
    if (typeof(Elm) == "undefined") {
        console.log("No Elm");
        // The Elm script tag was loaded for a different post,
        // but has not executed yet.  Try again in a bit.
        setTimeout(setup, 100);
    } else {
        console.log("Level editor loaded. Checking for posts...");
        check_for_new_posts();
        observeDOM(document, check_for_new_posts);
    }
}

console.log("Loading level editor...");
findOrCreateStyleLink();
findOrCreateScriptLink(() => setTimeout(setup, 100));

