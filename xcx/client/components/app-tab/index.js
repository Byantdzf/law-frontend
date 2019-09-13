Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: { 
    equal: Boolean,
    align: {
      type: String,
      value: 'center'
    },
    items: {
      type:Array,
      value:[]
    },
    current: String,
    classNames: String
  },
  data: {
    overflow: false,
    parentWidth: 0,
    childWidth: 0,
    scrollLeft: 0
  },
  ready(){
    !this.properties.current && 
    this.properties.items.length > 0 && 
    this.setData({
      current: this.properties.items[0].id
    });
    let parentWidth = 0;
    let childWidth = 0;
    let query = wx.createSelectorQuery().in(this);
    query.select('.scroll-view').boundingClientRect();
    query.selectAll('.scroll-view-item').boundingClientRect().exec(r=>{
      parentWidth = r[0].width || 0;
      let childs = r[1] || [];
      childs.forEach(child => {
        childWidth += child.width;
      });
      this.setData({
        parentWidth,
        childWidth
      });
      if(childWidth > parentWidth){
        this.setData({
          overflow:true
        });
      }
    });
  },
  methods:{
    itemTap(ev){
      let { id } = ev.currentTarget.dataset;
      this.setData({
        current: id
      });
      this.triggerEvent('change', id);
    },
    scroll(ev){
      this.setData({
        scrollLeft:ev.detail.scrollLeft
      });
    }
  }
})