Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    show: Boolean,
    inline: Boolean,
    fixed: Boolean,
    mask: Boolean,
    type: {
      type: String,
      value: 'ring'
    },
    background: {
      type: String,
      value: "rgba(0, 64, 237, 0.1)"
    },
    borderColor: {
      type: String,
      value: "#999"
    },
    borderWidth: {
      type: Number,
      value: 10
    },
    size: {
      type: Number,
      value: 80
    },
    text: String,
    textColor: {
      type: String,
      value: "#666666"
    }
  },
  data: {
    className: '',
    baseStyles: '',
    bgShadow: '',
    ringStyles: '',
    ringShadow: '',
    circleMainStyles: ''
  },
  attached() {
    const _data = this.data
    const baseStyles = `width: ${_data.size}rpx; height: ${_data.size}rpx;`
    let classNames = [
      _data.inline ? 'is-inline' : '',
      _data.fixed ? 'is-fixed' : '',
      _data.mask ? 'has-mask' : ''
    ].filter(v => !!v);

    this.setData({
      baseStyles,
      className: classNames.join(' '),
      bgShadow: _data.type === 'ring' ? `box-shadow: inset 0 0 0 ${_data.borderWidth}rpx ${_data.background};` : '',
      ringStyles: `clip: rect(0, ${_data.size}rpx, ${_data.size}rpx, ${_data.size / 2}rpx);${baseStyles}`,
      ringShadow: `box-shadow: inset 0 0 0 ${_data.borderWidth}rpx ${_data.borderColor};`,
      circleMainStyles: `width: ${_data.borderWidth}rpx; height: ${_data.size / 4}rpx; border-radius: ${_data.borderWidth}rpx; background: ${_data.borderColor};`
    })
  },
  methods: {
    
  }
})