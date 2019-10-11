const { getTimestamp, zeroPadding } = require('../../utils/tools.js')

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    className: String,
    // value的type是Number时，单位秒
    value: {
      type: [Number, String, Date],
      required: true
    },
    format: {
      type: String,
      value: "hh时mm分ss秒"
    }
  },
  data: {
    splitors: [],
    items: []
  },
  methods: {
    initCountdown(val) {
      if (typeof val === "number") {
        this.timestp = val;
      } else {
        const start = getTimestamp();
        const end = getTimestamp(val);
        this.timestp = (end - start) / 1000;
      }
      this.openTimer();
    },
    getDatetimeVal(a, b, p) {
      const s = Math.floor(this.timestp / (a || 1));
      const val = b ? s % b : s;
      return p - 1 ? zeroPadding(val) : val;
    },
    updateItems() {
      let items = [];
      this["d+"] = this.getDatetimeVal(60 * 60 * 24, 0, this.obj["d+"]);
      this["h+"] = this.getDatetimeVal(60 * 60, 24, this.obj["h+"]);
      this["m+"] = this.getDatetimeVal(60, 60, this.obj["m+"]);
      this["s+"] = this.getDatetimeVal(1, 60, this.obj["s+"]);
      for (let k in this.obj) {
        if (this.obj[k]) {
          items.push({
            key: k,
            value: this[k]
          });
        }
      }
      this.setData({ items });
    },
    openTimer() {
      this.closeTimer();
      this.timer = setInterval(() => {
        if (this.timestp > 1) {
          this.timestp -= 1;
        } else {
          this.timestp = 0;
          this.closeTimer();
          this.data.value && this.triggerEvent("timeup", 0);
        }
        this.updateItems();
        this.triggerEvent("change", this.timestp);
      }, 1000);
    },
    closeTimer() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    }
  },
  attached() {
    let fmt = this.data.format || "";
    this.timestp = 0;
    this.obj = {
      "d+": 0,
      "h+": 0,
      "m+": 0,
      "s+": 0
    };
    for (let k in this.obj) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        this.obj[k] = RegExp.$1.length;
        fmt = fmt.replace(RegExp.$1, "");
      }
    }
    this.setData({
      splitors: fmt.split("")
    });
    this.initCountdown(this.data.value);
  },
  detached() {
    this.closeTimer();
  }
})