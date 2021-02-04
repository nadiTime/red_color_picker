class RedColorPicker {
  constructor(options = { width: 101, height: 101, addBubble: false }) {
    this.width = options.width;
    this.height = options.height;
    this.startingColor = 'hsl(0, 50%, 50%)';
    this.addBubble = options.addBubble;
  }

  addPicker(appendTo) {
    // Create preview
    const preview = document.createElement('div');
    preview.id = 'color-picker-preview';
    preview.classList.add('mb-1');

    // Create form
    const form = document.createElement('form');
    const hslInput = document.createElement('input');
    hslInput.id = 'hsl-input';
    hslInput.setAttribute('type', 'text');
    form.append(hslInput);

    // Create container
    const colorPickerConatainer = document.createElement('div');
    colorPickerConatainer.id = 'color-picker-container';

    // Set canvas id annd classes
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = 'color-picker';
    canvas.classList.add('mb-1');

    // Append  all
    appendTo.append(canvas);
    appendTo.append(preview);
    appendTo.append(form);

    // Bubble
    if (this.addBubble) {
      const bubble = document.createElement('div');
      bubble.id = 'bubble';
      bubble.classList.add('hidden');
      appendTo.prepend(bubble);
    }

    // Starting color
    preview.style.backgroundColor = this.startingColor;
    hslInput.value = this.startingColor;

    this._paintCanvas(canvas);
    this._attachEvents(appendTo, canvas, preview, hslInput);
  }

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

  _attachEvents(appendTo, canvas, preview, hslInput) {
    const bubble = document.querySelector('#bubble');

    if (this.addBubble) {
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
