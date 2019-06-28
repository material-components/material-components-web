### MDCDrawerAdapter

Method Signature | Description 
 --- | --- 
addClass | Adds a class to the root Element. 
elementHasClass | Returns true if the an element contains the given class. 
focusActiveNavigationItem | Focuses the active / selected navigation item. 
hasClass | Returns true if the root Element contains the given class. 
notifyClose | Emits a custom event "MDCDrawer:closed" denoting the drawer has closed. 
notifyOpen | Emits a custom event "MDCDrawer:opened" denoting the drawer has opened. 
releaseFocus | Releases focus trap from root element which was set by `trapFocus`and restores focus to where it was prior to calling `trapFocus`. 
removeClass | Removes a class from the root Element. 
restoreFocus | Restores focus to element previously saved with 'saveFocus'. 
saveFocus | Saves the focus of currently active element. 
trapFocus | Traps focus on root element and focuses the active navigation element. 

### MDCDrawer

Method Signature | Description 
 --- | --- 
emit | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data. 
listen | Wrapper method to add an event listener to the component's root element. This is most useful whenlistening for custom events. 
unlisten | Wrapper method to remove an event listener to the component's root element. This is most useful whenunlistening for custom events. 

### MDCDismissibleDrawerFoundation

Method Signature | Description 
 --- | --- 
handleKeydown | Keydown handler to close drawer when key is escape. 
handleTransitionEnd | Handles a transition end event on the root element. 

### MDCModalDrawerFoundation

Method Signature | Description 
 --- | --- 
handleKeydown | Keydown handler to close drawer when key is escape. 
handleScrimClick | Handles click event on scrim. 
handleTransitionEnd | Handles a transition end event on the root element. 
