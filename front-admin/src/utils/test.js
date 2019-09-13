
const test = {
	// 组合校验 ，每个item必须指明type -- string 、 number 、mobile、password
	all(arr = []) {
		let tasks = [];
		arr.forEach(task => {
			let {	type } = task;
			tasks.push(this[type](task))
		});
		return Promise.all(tasks);
	},
	// 字符串校验
	string(_options = {}) {
		let {
			label = '', // 需校验的label名称
			value, // 需校验的value 
			min = 0, // 需校验的value 的最小长度 默认0 
			max = 0, // 需校验的value 的最大长度 默认不限，传0则代表不限
			filters = [], // 过滤某一项
			required = true // 是否必须
		} = _options;
		if(max !== 0 && max < min) {
			throw new Error(`max:${max}小于min:${min}`);
		}
		return new Promise((resolve, reject) => {
			if(!value) {
				required ? reject({
					code: 1,
					message: `${label}不能为空！`
				}) : resolve({
					code: 0,
					message: ''
				});
			} else {
				if(value && typeof value == 'string' && !filters.includes(value)) {
					if(value.length >= min && (value.length <= max || max == 0)) {
						resolve({
							code: 0,
							message: ''
						});
					} else {
						if(value.length < min) {
							reject({
								code: 3,
								message: `${label}不能少于${min}个字符！`
							});
						} else {
							reject({
								code: 4,
								message: `${label}不能多于${max}个字符！`
							});
						}
					}
				} else {
					if(filters.includes(value)) {
						reject({
							code: 7,
							message: `${label}的${value}不可用！`
						});
					} else {
						reject({
							code: 2,
							message: `${label}不是字符串！`
						});
					}
				}
			}
		});
	},
	// 数字校验
	number(_options = {}) {
		let {
			label = '', // 需校验的label名称
			value, // 需校验的value 
			min, // 需校验的value 的最小值 ，不传则代表不限
			max, // 需校验的value 的最大值，不传则代表不限
			filters = [], // 过滤某一项
			integer = false, // 是否整型
			required = true // 是否必须
		} = _options;
		if(min !== undefined && max !== undefined && max < min) {
			throw new Error(`max:${max}小于min:${min}`);
		}
		return new Promise((resolve, reject) => {
			function minOrMax() {
				if(min == undefined && max == undefined) {
					resolve({
						code: 0,
						message: ''
					});
				} else if(min == undefined && max !== undefined) {
					if(value > max) {
						reject({
							code: 4,
							message: `${label}不能大于${max}！`
						});
					} else {
						resolve({
							code: 0,
							message: ''
						});
					}
				} else if(min !== undefined && max == undefined) {
					if(value < min) {
						reject({
							code: 3,
							message: `${label}不能小于${min}！`
						});
					} else {
						resolve({
							code: 0,
							message: ''
						});
					}
				} else {
					if(value < min || value > max) {
						reject({
							code: 5,
							message: `${label}不能小于${min}且不能大于${max}！`
						});
					} else {
						resolve({
							code: 0,
							message: ''
						});
					}
				}
			}
			
			if(typeof(value) == 'string') {
				value = Number(value) || value
			}
			if(!value && String(value) !== '0') {
				required ? reject({
					code: 1,
					message: `${label}不能为空！`
				}) : resolve({
					code: 0,
					message: ''
				});
			} else {
				if(Number.isFinite(value) && !filters.includes(value)) {
					if(integer && Number.isInteger(value)) {
						minOrMax();
					} else {
						if(integer) {
							reject({
								code: 6,
								message: `${label}不是整数！`
							});
						} else {
							minOrMax();
						}
					}
				} else {
					if(Number.isFinite(value)) {
						reject({
							code: 7,
							message: `${label}的${value}不可用！`
						});
					} else {
						reject({
							code: 2,
							message: `${label}不是数字！`
						});
					}
				}
			}
		});
	},
	// 校验手机号
	mobile(_options = {}) {
		let {
			label = '手机号码', // 需校验的label名称
			value, // 需校验的value 
			filters = [], // 过滤某一项
			required = true // 是否必须
		} = _options;
		return new Promise((resolve, reject) => {
			if(!value) {
				required ? reject({
					code: 1,
					message: `${label}不能为空！`
				}) : resolve({
					code: 0,
					message: ''
				});
			} else {
				let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if(reg.test(value) && !filters.includes(value)) {
					resolve({
						code: 0,
						message: ''
					});
				} else {
					if(filters.includes(value)) {
						reject({
							code: 7,
							message: `${label}为${value}不可用！`
						});
					} else {
						reject({
							code: 2,
							message: `${label}格式不正确！`
						});
					}
				}
			}
		});
	},
	// 密码校验
	password(_options = {}) {
		let {
			label = '密码', // 需校验的label名称
			value, // 需校验的value 
			min = 6, // 需校验的value 的最小长度 默认6 
			max = 18, // 需校验的value 的最大长度 默认18，传0则代表不限
			rule = 1, // 校验规则 1 字母加数字 2 字母，数字或者下划线 3 
			filters = [], // 过滤某一项
			required = true // 是否必须
		} = _options;
		if(max !== 0 && max < min) {
			throw new Error(`max:${max}小于min:${min}`);
		}
		const reg = {
			1: /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/,
			2: /^[a-zA-Z0-9_]{1,}$/
		}[rule];
		return new Promise((resolve, reject) => {
			if(!value) {
				required ? reject({
					code: 1,
					message: `${label}不能为空！`
				}) : resolve({
					code: 0,
					message: ''
				});
			} else {
				if(reg.test(value) && !filters.includes(value)) {
					if(value.length >= min && (value.length <= max || max == 0)) {
						resolve({
							code: 0,
							message: ''
						});
					} else {
						if(value.length < min) {
							reject({
								code: 3,
								message: `${label}不能少于${min}个字符！`
							});
						} else {
							reject({
								code: 4,
								message: `${label}不能多于${max}个字符！`
							});
						}
					}
				} else {
					if(filters.includes(value)) {
						reject({
							code: 7,
							message: `${label}不可用！`
						});
					} else {
						let msg = '';
						switch(rule) {
							case 1:
								msg = `${label}由字母和数字组成！`;
								break;
							case 2:
								msg = `${label}由字母，数字或者下划线组成！`;
								break;
						}
						reject({
							code: 2,
							message: msg
						});
					}
				}
			}
		});
	}
}

export default test
