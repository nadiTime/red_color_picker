class RedColorPicker {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.startingColor = 'hsl(0, 50%, 50%)';
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

    // Bubble
    const bubble = document.createElement('div');
    bubble.id = 'bubble';
    bubble.classList.add('hidden');

    // Append  all
    appendTo.append(canvas);
    appendTo.append(preview);
    appendTo.append(form);
    appendTo.prepend(bubble);

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
    for (let i = 0; i < lRange; i++) {
      let s = 0;
      for (let j = 0; j < sRange; j++) {
        context.fillStyle = `hsl(0,${s}%,${l}%)`;
        context.fillRect(j, i, 1, 1);
        s++;
      }
      l--;
    }
  }

  _attachEvents(appendTo, canvas, preview, hslInput) {
    const bubble = document.querySelector('#bubble');

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
