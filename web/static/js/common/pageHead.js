var random = new Date().getTime().toString() + (Math.floor(Math.random() * 90000) + 10000).toString();

document.write('<link rel="icon" href="/static/images/favicon.ico?_t=' + random + '" />');
document.write('<link rel="shortcut icon" href="/static/images/favicon.ico?_t=' + random + '" />');
document.write('<link rel="stylesheet" href="/static/js/plugin/layui/css/layui.css?_t=' + random + '" />');
document.write('<link href="/static/css/font-awesome.min.css" rel="stylesheet"></link>');
document.write('<link href="/static/css/main.css?_t=' + random + '" rel="stylesheet"></link>');