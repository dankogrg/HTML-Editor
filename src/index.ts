import * as monaco from "monaco-editor";
import "./index.css";
import * as Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// @ts-ignore
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === "json") {
            return "./json.worker.bundle.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
            return "./css.worker.bundle.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return "./html.worker.bundle.js";
        }
        if (label === "typescript" || label === "javascript") {
            return "./ts.worker.bundle.js";
        }
        return "./editor.worker.bundle.js";
    },
};

let MonacoData = ["<html>", "<div>", "</div>", "</html>"].join("\n");

window.addEventListener("load", () => {
    let records = JSON.parse(localStorage.getItem("HTMLData"));
    if (records) {
        editor.setValue(records);
    }
    console.log(MonacoData);
});

const createTag = (tagName: string, className: string, label: string) => {
    const element = document.createElement(tagName);
    element.innerText = label;
    element.className = className;
    return element;
};

const container = createTag("div", "container", "");
document.body.appendChild(container);

const save = container.appendChild(createTag("button", "button", "Save"));
const copy = container.appendChild(createTag("button", "button", "Copy"));
const paste = container.appendChild(createTag("button", "button", "Paste"));
const insertPic = container.appendChild(
    createTag("button", "button", "Insert image")
);

const editorDiv = createTag("div", "editorDiv", "");
document.body.appendChild(editorDiv);

const editor = monaco.editor.create(editorDiv, {
    value: MonacoData,
    language: "html",
    automaticLayout: true,
    theme: "vs-dark",
});

save.addEventListener("click", () => {
    const HTMLData = editor.getValue();
    localStorage.setItem("HTMLData", JSON.stringify(HTMLData));
    Toastify({
        text: "Saved to local storage 🎉",
        duration: 800,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: false,
    }).showToast();
});

copy.addEventListener("click", () => {
    const text = editor.getValue();
    navigator.clipboard.writeText(text);
    Toastify({
        text: "HTML copied! 🎉",
        duration: 800,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: false,
    }).showToast();
});

paste.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();

        const position = editor.getPosition();

        editor.executeEdits("", [
            {
                range: new monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                ),
                text: text,
                forceMoveMarkers: true,
            },
        ]);
        editor.focus();
    } catch (error) {}
});

insertPic.addEventListener("click", () => {
    const imgTag = `<img src="placeholder.jpg" alt="placeholder image" width="500" height="600">\n`;
    const position = editor.getPosition();
    editor.executeEdits("", [
        {
            range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            text: imgTag,
            forceMoveMarkers: true,
        },
    ]);
    editor.focus();
});
