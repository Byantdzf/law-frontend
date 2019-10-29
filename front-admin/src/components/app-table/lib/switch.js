export default {
  name: 'app-table-switch',
  inheritAttrs: false,
  props: ['row', 'col', 'value', 'disabled', 'text','disabledRow'],
  data() {
    return {
      defaultVal: this.value,
      status:false,
    }
  },
  watch: {
    row: {
      handler: function() {
        this.defaultVal = this.value
      },
      deep: true
    }
  },
  methods: {
    handleChange(value) {
      this.defaultVal = value
      this.$emit('change', {
        value,
        row: this.row,
        col: this.col
      })
    }
  },
  render() {
    if (this.text) {
      return <span>{ this.text }</span>
    } else {
      let arr=this.disabledRow||[];
      if(arr.length>0){
        arr.map((obj)=>{
          Object.keys(obj).map((key)=>{
            if(obj[key]==this.row[key]){
              this.status=true;
            }
          })
        })
      }else {
        this.status=this.disabled;
      }
      return (
        <el-switch
          active-color="#409EFF"
          inactive-color="#C0CCDA"
          value={ this.defaultVal }
          disabled={ this.status }
          on-change={ (value) => this.handleChange(value) }
        >
        </el-switch>
      )
    }
  }
}