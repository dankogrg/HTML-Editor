HTML EDITOR

small editor app for writing and locally saving HTML. 
App uses webpack to build the components for distribution and deployment
code has the variables, functions etc defined in with typescript
monaco editor package library for creating the editor
Editor is main thing, but it has added features: 
  - BUTTONS:
      -SAVE: saves the entire HTML inside the editor and puts it to local storage, stored code is saved and rerendered in editor upon page refresh
      -COPY: copies entire HTML and puts it to clipboard
      -PASTE: inserts (pastes) the text from clipboard at the current caret position inside the editor. Text after the pasted text gets moved forward for the amount of characters the pasted text contains
      -INSERT IMAGE: inserts the <img> tag with default img size and placeholder "src"

- CUSTOMIZATION PANEL: has the checkboxes for each button. unchecking the box removes the referenced button, and checking inserts it. by default, all the boxes are checked. Advvantage of this feature is that you can
  arrange the order of the buttons according to preference; disadvantage is the lack of fixed order of the buttons that you can always rely upon staying the same independently of your toggle/untoggle actions.

  I wil try to make the costumization preferences also permanent upon page reload. I'm currently having issues with succesfull parsing from local storage and insertion of data into the code
    
SETUP: after cloning run `npm i`  to install the dependencies, then `npm start`  to run in dev mode. Run `npm run build` to build for distribution.
