function formatTime(date) {  
  var year = date.getFullYear()  
  var month = date.getMonth() + 1  
  var day = date.getDate()  
  
  var hour = date.getHours()  
  var minute = date.getMinutes()  
  var second = date.getSeconds()  
  
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')  
}  
  
function formatNumber(n) {  
  n = n.toString()  
  return n[1] ? n : '0' + n  
}

const obj2str = o => Object.prototype.toString.call(o)
const isPlainObject = o => obj2str(o) === '[object Object]'
const isArray = o => obj2str(o) === '[object Array]'
const isNumber = o => obj2str(o) === '[object Number]'
const isString = o => obj2str(o) === '[object String]'

// 个位数补零
const zeroPadding = n => (+n > 9 ? n : "0" + +n)

// 获取时间戳
// getTimestamp([2019, 1, 1]) => 1546272000000 or getTimestamp(['2019', '01', '01', '00', '00']) => 1546272000000
// getTimestamp('2019年1月1日') => 1546272000000 or getTimestamp('2019年01月01日 00:00:00') => 1546272000000
// getTimestamp('2019-1-1') => 1546272000000 or getTimestamp('2019-01-01 00:00:00') => 1546272000000
// getTimestamp('2019/1/1') => 1546272000000 or getTimestamp('2019/01/01 00:00:00') => 1546272000000
// getTimestamp('2019,1,1') => 1546272000000 or getTimestamp('2019,01,01 00:00:00') => 1546272000000
const getTimestamp = date => {
  if (typeof date == "number") {
    return date;
  } else if (date instanceof Date) {
    return date.getTime()
  } else if (typeof date == "string" || Array.isArray(date)) {
    let dates = []
    if (typeof date == "string") {
      dates = date.split(/[^0-9]/).filter(v => v)
    } else {
      dates = date
    }
    let [y, M = 0, D = 1, h = 0, m = 0, s = 0] = dates
    const zp = n => (+n > 9 ? n : "0" + +n)
    return new Date(
      `${y}/${zp(M)}/${zp(D)} ${zp(h)}:${zp(m)}:${zp(s)}`
    ).getTime()
  } else {
    return new Date().getTime()
  }
}
  
module.exports = {  
  formatTime: formatTime,
  isPlainObject,
  isArray,
  isNumber,
  isString,
  zeroPadding,
  getTimestamp
} 