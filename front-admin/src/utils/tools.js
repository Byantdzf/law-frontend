
const obj2str = o => Object.prototype.toString.call(o)
const isPlainObject = o => obj2str(o) === '[object Object]'
const isArray = o => obj2str(o) === '[object Array]'
const isNumber = o => obj2str(o) === '[object Number]'
const isString = o => obj2str(o) === '[object String]'

const treeToList = (data, newArr, pid) => {

  newArr = newArr || []

  data.forEach(function (t) {
    if (!t.parentId && t.parentId != 0) {
      t.parentId = pid
    }

    t.menuName = t.menuName || t.text
    newArr.push(t)

    if (t.children && t.children.length) {
      treeToList(t.children, newArr, t.id)
    }
  })

  return newArr
}

const compare = (property, reverse) => {
  return function (a, b) {
    if (reverse) {
      return b[property] - a[property]
    } else {
      return a[property] - b[property]
    }
  }
}

// 生成数据树
const getTreeData = obj => {
  let datas = []
  let pid = 'parentId'
  let cid = 'id'

  if (Object.prototype.toString.call(obj) == '[object Object]') {
    datas = obj.list || []
    pid = obj.pid || pid
    cid = obj.cid || cid
  } else if (Object.prototype.toString.call(obj) == '[object Array]') {
    datas = obj
  } else {
    throw new Error('参数必须是Object或者Array！')
  }

  let temptree = [], tree = [], items = []

  for (let i in datas) {

    if (!temptree[datas[i][cid]]) {
      let trow = {
        ...datas[i],
        children: []
      }

      temptree[datas[i][cid]] = trow

      items.push(trow)

    }
  }
  
  for (let j in items) {
    if (temptree[items[j][pid]]) {
      temptree[items[j][pid]]["children"].push(temptree[items[j][cid]])
    } else {
      tree.push(temptree[items[j][cid]])
    }
  }

  temptree = null
  items = null

  return tree
}

// 数组转map 
const arr2map = (data, key = 'code') => {
  let arr = [].concat(data)

  return arr.reduce((res, cur) => {
    res[cur[key]] = cur
    return res
  }, {})
}

// 数组转map 
const str2arr = (val, sq = ',') => {
  if (isString(val) || isNumber(val)) {
    return String(val).split(sq).filter(v => v)
  } else {
    return []
  }
}

// 数组排序
const arrSort = (data, field, reverse) => data.sort(compare(field, reverse))

const getRootPid = (data) => {
  let rootId = ''

  data.forEach(function (t) {
    if (rootId || rootId === 0) {
      rootId = rootId < t.parentId ? rootId : t.parentId
    } else {
      rootId = t.parentId
    }
  })

  return rootId
}

// ex: getQueryString('k1', '?k1=v1&k2=v2') => v1
const getQueryString = (name, str) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  const search = location.hash.split('?')[1] || ''
  const r = (str || '?' + search).substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

const getOffsetTopByBody = el => {
  let offsetTop = 0
  while (el && el.tagName !== 'BODY') {
    offsetTop += el.offsetTop
    el = el.offsetParent
  }
  return offsetTop
}

export {
  isPlainObject,
  isArray,
  isNumber,
  isString,
  treeToList,
  getTreeData,
  arr2map,
  str2arr,
  arrSort,
  getRootPid,
  getQueryString,
  getOffsetTopByBody
}