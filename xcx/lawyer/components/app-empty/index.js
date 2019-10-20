Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: { 
    tips:{
      type:String,
      value:'暂无数据'
    },
    iconClass:{
      type:String,
      value:''
    },
    imgSrc:{
      type: String,
      value: '/static/images/default/noData.jpg'
    }
  }
})