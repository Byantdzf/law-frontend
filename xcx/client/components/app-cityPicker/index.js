// components/app-timePicker/index.js
const cityCode = require('../../static/data/city')
const cityList = cityCode.default.cityCode

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        selectArea: {
            type: Array,
            value: []
        },
        isHome: Boolean,
    },

    /**
     * 组件的初始数据
     */
    data: {
        cityObj: [cityList, cityList[0].city],
        selectCity: null,
        cityIndex: [0, 0],
    },
    ready() {
        this.init(this.properties.selectArea)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        init() {
            let selectArea = this.properties.selectArea || []
                let cityIndex = []
                if (selectArea.length) {
                let pIndex = cityList.findIndex(items => {
                    return items.name == selectArea[0]
                })
                let city = cityList[pIndex].city || []
                let cIndex = city.findIndex(items => {
                    return items.name == selectArea[1]
                })
                cityIndex = [pIndex, cIndex]

                let cityObj = this.data.cityObj
                cityObj[1] = city

                let selectCity = [cityObj[0][cityIndex[0]], cityObj[0][cityIndex[0]]['city'][cityIndex[1]]]

                this.setData({
                    cityObj,
                    cityIndex,
                    selectCity
                })
            }
        },
        bindMultiPickerChange(e) {
            let cityIndex = e.detail.value || []
            let cityObj = this.data.cityObj
            this.setData({
                cityIndex,
                selectCity: [cityObj[0][cityIndex[0]], cityObj[0][cityIndex[0]]['city'][cityIndex[1]]]
            })
            this.triggerEvent('change', this.data.selectCity);
        },
        bindMultiPickerColumnChange(e) {
            let cityObj = this.data.cityObj
            let cityIndex = this.data.cityIndex
            cityIndex[e.detail.column] = e.detail.value;

            if (e.detail.column == 0) {
                cityObj[1] = cityObj[0][e.detail.value]['city'] || []
                cityIndex[1] = 0
            }
            this.setData({
                cityObj,
                cityIndex,
                selectCity: [cityObj[0][cityIndex[0]], cityObj[1][cityIndex[1]]]
            })
        }
    }
})
