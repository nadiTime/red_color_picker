class ColorPickerHelpers {
  _paintCanvas(canvas) {
    // Color picker on any sized canvas
    const sRange = canvas.width;
    const lRange = canvas.height;

    const context = canvas.getContext('2d');

    // Draw color picker
    let l = lRange;
    for (let y = 0; y < lRange; y++) {
      let s = 0;
      const currentL = Math.round((l / sRange) * 100);
      for (let x = 0; x < sRange; x++) {
        const currentS = Math.round((s / sRange) * 100);
        context.fillStyle = `hsl(0,${currentS}%,${currentL}%)`;
        context.fillRect(x, y, 1, 1);
        s++;
      }
      l--;
    }
  }

  _attachEvents(canvas, preview, hslInput, bubble) {
    if (bubble) {
      canvas.addEventListener('mouseenter', () => {
        bubble.classList.remove('hidden');
      });

      canvas.addEventListener('mouseleave', () => {
        bubble.classList.add('hidden');
      });

      canvas.addEventListener('mousemove', (e) => {
        const { h, s, l } = this._getColorFromCoordinates(canvas, e);
        bubble.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
      });
    }

    canvas.addEventListener('click', (e) => {
      const { h, s, l } = this._getColorFromCoordinates(canvas, e);
      // Set preview
      preview.style.backgroundColor = `hsl(${h},${s}%,${l}%)`;
      // Set input
      hslInput.value = `hsl(0, ${s}%, ${l}%)`;
    });
  }

  _getColorFromCoordinates(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.bottom - e.clientY;

    return this._getHslColor(x, y);
  }

  _getHslColor(x, y) {
    const precX = Math.round((x / this.width) * 100);
    const precY = Math.round((y / this.height) * 100);
    const hsl = {
      h: 0,
      s: precX,
      l: precY,
    };
    return hsl;
  }
}

class RedColorPicker extends ColorPickerHelpers {
  constructor({ width = 101, height = 101, addBubble = false }) {
    super();
    this.width = width;
    this.height = height;
    this.startingColor = 'hsl(0, 50%, 50%)';
    this.addBubble = addBubble;

    // Create preview
    this.preview = document.createElement('div');
    this.preview.classList.add('color-picker-preview', 'mb-1');

    // Create form
    this.form = document.createElement('form');
    this.hslInput = document.createElement('input');
    this.hslInput.classList.add('hsl-input');
    this.hslInput.setAttribute('type', 'text');
    this.form.append(this.hslInput);

    // Create container
    this.colorPickerConatainer = document.createElement('div');
    this.colorPickerConatainer.classList.add('color-picker-container');

    // Set canvas id annd classes
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.classList.add('color-picker', 'mb-1');

    // Bubble
    this.bubble = null;
    if (this.addBubble) {
      this.bubble = document.createElement('div');
      this.bubble.classList.add('bubble', 'hidden');
    }
  }

  addPicker(appendTo) {
    // Append  all
    appendTo.append(this.canvas);
    appendTo.append(this.preview);
    appendTo.append(this.form);

    // Bubble
    if (this.addBubble) {
      appendTo.prepend(this.bubble);
    }

    // Starting color
    this.preview.style.backgroundColor = this.startingColor;
    this.hslInput.value = this.startingColor;

    this._paintCanvas(this.canvas);
    this._attachEvents(this.canvas, this.preview, this.hslInput, this.bubble);
  }
}
