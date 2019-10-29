if (!window.console) {
    window.console = {};
}
if (!window.console.log) {
    window.console.log = function (msg) {
    };
}

var _t = null;  // 保存页面模块对象
var appName = '虎甲律师问答'; // 项目名称
var appToken = 'HJLAWYER';
var audioCanPlay = true;

var global = {
    tel: '0755-123456',
    testUserInfo: {id: 1, username: "wakaka", pic: "/static/images/avatar.jpg"},
    page: 'pageNo',                      // 分页页码字段
    rows: 'pageSize',                       // 分页每页条数字段
    defaultRows: 10,
    defaultPage: 1,
    token: appToken + '_TOKEN',             // 与后端交互的token名称字段
    account: appToken + '_ACCOUNT',         // 登录后本地保存用户名字段
    backToken:  'LOGIN_ACCESS_TOKEN',       // 后端授权需要携带的cookie名称
    userInfoToken: appToken + '_USERINFO',  // 登录的用户信息
    areaCookie: 'thisArea',                 // 当前城市cookie名称
    requestAreaCookie: 'AREA_ACCESS_TOKEN',
    defaultArea: {"id": "440300", "name": "深圳"},
    userInfo: {},                           // 登录的用户信息
    autoSearch: false,                      // 基础页搜索，控制是否 改变值后立即搜索 的开关
    expires: 30,                            // 本地cookie保存时长
    lang: {},                               // 全部语言库对象
    btn: {},                                // 语言库中按钮的对象
    msg: {},                                // 语言库中提示信息的对象
    placeholder: {},                        // 语言库中提示文字的对象
    text: {},                               // 语言库中文本内容的对象
    rs: {},                                 // 语言库中数组的对象
    LOADING_URL: [],                        // 请求中的URL数组
    menus: [],                              // 目录,
    smsTime: 60
}