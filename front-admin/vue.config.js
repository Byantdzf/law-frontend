
module.exports = {
  productionSourceMap: false,

  devServer: {
     port: "8012",
     proxy: "http://testadmin2.pt.mytriptest.com"
    // proxy: "http://devadmin2.ptdev.mytriptest.com"
    // port: "9012",
    // proxy: "http://192.168.0.42:2900"
    // proxy: "http://192.168.0.52:8073"
  },

  assetsDir: 'static'
}