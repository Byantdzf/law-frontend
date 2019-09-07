class PM{
  constructor(){
    this.$$cache = {};
  }

  add(page, name){
    let pagePath = name || this._getPagePath(page);
    this.$$cache[pagePath] = page;
  }

  get(pagePath){
    return this.$$cache[pagePath];
  }

  delete(page){
    try {
      let name = typeof page == 'string' ? page : this._getPagePath(page)
      delete this.$$cache[name];
    } catch(e){

    }
  }

  _getPagePath(page){
    return page.__route__;
  }
}

module.exports = new PM();