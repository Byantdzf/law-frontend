
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    readonly: Boolean,
    value: {
      type: [String, Number],
      value: 0
    },
    icons: {
      type: Array,
      value: []
    },
    size: {
      type: [String, Number],
      value: 20
    },
    max: {
      type: Number,
      value: 5
    },
    imgs: {
      type: Array,
      value: ['./static/icon-star.png', './static/icon-star-hl.png']
    }
  },
  data: {
    levels: [],
    itemStyles: ''
  },
  methods: {
    handlerClick(e) {
      if (this.data.readonly) return;
      const { item: value } = e.currentTarget.dataset;
      this.setData({ value });
      this.triggerEvent("change", value);
    }
  },
  attached() {
    let levels = [];

    for (let i = 1; i <= this.data.max; i++) {
      levels.push(i);
    }

    let itemStyles = "";
    let n = "";

    if (typeof this.data.size === "number") {
      n = this.data.size + "px";
    } else {
      n = this.data.size;
    }

    itemStyles = `width: ${n}; height: ${n}; font-size: ${n};`;

    this.setData({ levels, itemStyles });
  }
})