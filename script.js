// Instanciate class with  picker size in pixels
const redColorPicker = new RedColorPicker(101, 101);
const container = document.querySelector('#color-container');

// Add picker to page
redColorPicker.addPicker(container);
