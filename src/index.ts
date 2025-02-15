import * as monaco from "monaco-editor";
import "./index.css";
import * as Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

interface Option {
    label: string;
    id: string;
    checked: boolean;
    tag: HTMLElement;
}

// @ts-ignore
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId: string, label: string): string {
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

// Array with properties used for handling buttons and costumization
let options: Option[] = [
    { label: "Save", id: "save", checked: true, tag: undefined },
    { label: "Copy", id: "copy", checked: true, tag: undefined },
    { label: "Paste", id: "paste", checked: true, tag: undefined },
    {
        label: "Insert image",
        id: "img",
        checked: true,
        tag: undefined,
    },
];

// Loader that checks for local storage and loads the saved data if any into the editor
window.addEventListener("load", () => {
    let records: string = JSON.parse(localStorage.getItem("HTMLData"));
    if (records) {
        editor.setValue(records);
    }
    let customRecords = JSON.parse(localStorage.getItem("options"));
    if (customRecords) {
        options = customRecords;
    }
    //inserting buttons on each page load according the customization preferences
    insertButtons();
    insertCustomization();
});

//function for creating buttons
const createTag = (
    tagName: string,
    className: string,
    label: string
): HTMLElement => {
    const element: HTMLElement = document.createElement(tagName);
    element.innerText = label;
    element.className = className;
    return element;
};

//container div
const container: HTMLDivElement = createTag(
    "div",
    "container",
    ""
) as HTMLDivElement;
document.body.appendChild(container);

const insertButtons = () => {
    //adding buttons into container
    options.forEach((option) => {
        option.tag = createTag("button", "button", option.label);
        if (option.checked) {
            container.appendChild(option.tag);
        }
    });
};

//function that creates the customization form
const createForm = (): HTMLElement => {
    //form
    const form: HTMLElement = document.createElement("form");
    form.className = "customization";

    //header
    const title: HTMLElement = document.createElement("div");
    title.innerText = "Customize buttons";
    title.style.borderBottom = "solid 1px";
    form.appendChild(title);

    //checkboxes
    options.forEach((option) => {
        const div: HTMLElement = document.createElement("div");
        div.style.padding = "2px";
        div.style.display = "flex";

        //input
        const input: HTMLInputElement = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", option.id);
        input.checked = option.checked;

        //label
        const label: HTMLLabelElement = document.createElement("label");
        label.setAttribute("for", option.label);
        label.innerText = option.label;

        div.appendChild(input);
        div.appendChild(label);
        form.appendChild(div);

        //checkbox listener that removes or inserts the buttons
        input.addEventListener("click", () => {
            options.forEach((option) => {
                if (option.checked) {
                    container.removeChild(option.tag);
                }
            });
            option.checked = !option.checked;

            options.forEach((option) => {
                if (option.checked) {
                    container.appendChild(option.tag);
                }
            });
            //storing the data that deals with buttons to local storage (work in progress)
            localStorage.setItem("options", JSON.stringify(options));
        });
    });

    return form;
};

//adding customization form to the side of container div
const insertCustomization = () => {
    const customization: HTMLElement = createForm();
    container.appendChild(customization);

    //this line keeps the div at customization form height even whene ther are no buttons
    container.style.height = customization.offsetHeight + "px";
};

//instructions div
const instructions: HTMLDivElement = createTag(
    "div",
    "instructions",
    "You can enter the HTML in the editor below"
) as HTMLDivElement;
document.body.appendChild(instructions);

//div that will contain monaco editor
const editorDiv: HTMLDivElement = createTag(
    "div",
    "editorDiv",
    ""
) as HTMLDivElement;
document.body.appendChild(editorDiv);

//default code upon first page load
let MonacoData: string = ["<html>", "</html>"].join("\n");

//putting monaco editor into the editorDiv
const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(
    editorDiv,
    {
        value: MonacoData,
        language: "html",
        automaticLayout: true,
        theme: "vs-dark",
    }
);

//BUTTON LISTENERS
//save
options[0].tag.addEventListener("click", () => {
    const HTMLData: string = editor.getValue();
    //deals with empty editor condition
    if (HTMLData == "") {
        //notification toast
        Toastify({
            text: "Nothing to save!",
            duration: 800,
            gravity: "top",
            position: "center",
            backgroundColor:
                "linear-gradient(to right,rgb(221, 80, 24),rgb(224, 29, 39))",
            stopOnFocus: false,
        }).showToast();

        //puts the focus on last known caret position
        editor.focus();
        return;
    }

    // gets the HTML from editor and puts it in ls
    localStorage.setItem("HTMLData", JSON.stringify(HTMLData));
    Toastify({
        text: "Saved to local storage 🎉",
        duration: 800,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: false,
    }).showToast();

    editor.focus();
});

//copy: copies everything inside the editor and stores it on clipboard
options[1].tag.addEventListener("click", () => {
    const text: string = editor.getValue();
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

//paste
options[2].tag.addEventListener("click", async () => {
    try {
        //reads the clipboard and finds the caret position
        const text: string = await navigator.clipboard.readText();
        const position: monaco.Position | null = editor.getPosition();

        //inserts text at the caret position
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

//insert generic image html at current caret position
options[3].tag.addEventListener("click", () => {
    const imgTag: string = `<img src="placeholder.jpg" alt="placeholder image" width="500" height="600">\n`;
    const position: monaco.Position | null = editor.getPosition();
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
