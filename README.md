# HTML Editor

Small editor app for writing and locally saving HTML. 
The app uses webpack to build the components for distribution and deployment.
The code itself is written in Typescript.
The app uses the Monaco library for creating the editor.

## Features
Besides the editor, the app has these features: 

### Buttons
  - **Save**: saves the entire HTML inside the editor and puts it into local storage. The stored code is saved and rerendered in editor upon page reload
  - **Copy**: copies entire editor content and puts it into the clipboard
  - **Paste**: inserts  the text from clipboard at the current caret position inside the editor.
  - **Insert Image**: inserts the `<img>` tag with default image size and placeholder `src`

### Customization Panel
The customization offers checkboxes to show or hide each button listed above. By default, all buttons are enabled. Enabling and disabling the buttons also allows to reorder them according to user preference.

Persistency for the customization preferences persistent upon page reload is under development.
    
## Setup and Usage
 1. Clone the Git repository
 1. Install the dependencies with ``npm i``
 1. Run ``npm start`` to launch the development server
 1. Open the app on [http://localhost:8080](http://localhost:8080)
 1. Run ``npm run build`` to build for distribution. The build is found in the ``dist`` directory.
