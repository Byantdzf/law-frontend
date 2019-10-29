<template>
	<el-form
		:class="['app-form', `align-${ config.align }`]"
		:inline="config.inline"
		:model="form"
		:rules="rules"
		:label-width="config.labelWidth"
		:label-position="config.labelPosition"
		ref="form"
	>
		<el-form-item 
			v-for="(item, index) in showItems"
			:class="[`app-form-item__${ item.type }`, { required: item.required }, item.class]" 
			:key="'formItem_' + index" 
			:label-width="item.labelWidth"
			:style="`width:${ item.itemWidth || config.itemWidth };`"
		>
			<span slot="label" v-html="item.label"></span>
			<keep-alive>
				<component 
					:is="getFormItemComponent(item)"
					v-model="form[item.field]"
					v-bind="getBindProps(item, index)"
					v-on="item.on"
					ref="formItem"
					@change="formChange" 
				/>
			</keep-alive>
		</el-form-item>
		<slot name="default" />
		<el-form-item 
			v-if="showBtns"
			class="app-form__btns" 
			:style="`width:${ config.btnItemWidth || config.itemWidth };`"
		>
			<slot name="append">
				<el-button 
					v-for="(item, index) in formBtns"
					:class="item.class || ''" 
					:type="item.type"
					:size="item.size || ''"
					:key="index" 
					@click="onButtonClick(item)"
				>
					{{ item.label }}
				</el-button>
			</slot>
		</el-form-item>
	</el-form>
</template>

<script>
	import Components from './components.js'
	import { cloneDeep, isArray, isString, isNumber, isPlainObject, isFunction, merge } from 'lodash-es'
	export default {
		name: 'app-form',
		mixins: [Components],
		props: {
			init: Object,
			items: Array,
			btns: Array,
			resave: Boolean
		},
		data(){
			return {
				// el-form 表单校验
				rules: {},
				// 用于与子组件交互的form
				form: {},
				// 用于保存初始值的form
				formCache: null,
				formItems: [],
				saveCache: this.resave
			}
		},
		computed: {
			// 表单全局配置
			config() {
				let opt = {
					inline: true,
					size: 'small',
					align: 'left',
					itemWidth: '',
					btnItemWidth: '',
					labelWidth: '90px',
					labelPosition: 'right',
					// 字段取值映射  这里是全局的字段映射  优先级小于item的 |
					// { id: ['lineCode', 'xxxx'], name: ['xxxx', 'aaa'] }
					fieldMaps: {}
				}
				return Object.assign(opt, this.init)
			},
			// 表单按钮
			formBtns() {
				return this.btns.reduce((res, cur)=>{
					let {
						code,
						label = '',
						size = this.config.size,
						type = ['reset', 'clear', 'cancel'].includes(cur.code) ? '' : 'primary'
					} = cur;

					cur = { code, label, size, type }

					res.push(cur)
					
					return res
				},[])
			},
			// 表单关联关系
			formLinkMaps() {
				return [...this.formItems].reduce((res, cur) => {
					if(cur.hasOwnProperty('links') && cur.field) {
						res[cur.field] = cur.links
					}
					return res
				}, {})
			},
			// 这里是form最后的取值规则
			formData() {
				let obj = {}, form = cloneDeep(this.form)

				obj = [...this.formItems].reduce((res, cur) => {
					let formValue = this.getValByCompare(form[cur.field], '')
					
					if (isArray(cur.field) || (isString(cur.field) && ~cur.field.indexOf(','))) {
						let fields = isArray(cur.field) ? cur.field : cur.field.split(',')
						
						fields.forEach((k, i) => {
							let [key, newKey] = this.getValueKeyName(k)
							
							if (isString(formValue) || isNumber(formValue)) {
								res[key] = isNumber(formValue) ? formValue : formValue.split(',')[i]
							} else if(isPlainObject(formValue)) {
								res[key] = this.getValByCompare(formValue[newKey], formValue[key])
							} else if(isArray(formValue) && formValue.length) {
								if (formValue.every(v => isPlainObject(v))) {
									res[key] = formValue.map(v => this.getValByCompare(v[newKey], v[key]))
								} else if(formValue.every(v => isArray(v))) {
									res[key] = formValue.map(v => v[i])
								} else {
									res[key] = formValue[i] ? this.getValByCompare(formValue[i][newKey], formValue[i]) : formValue[i]
								}
							} else {
								res[key] = ''
							}
						})
					} else {
						let [key, newKey] = this.getValueKeyName(cur.field)

						// res[key] = this.getValByCompare(formValue[newKey], formValue)

						if (newKey && isPlainObject(formValue)) {
							res[key] = formValue[newKey]
						} else {
							res[key] = formValue
						}
					}

					return res
				}, {})

				let tmp = {}

				for (let k in obj) {
					!k && delete obj[k]
					if (k && ~k.indexOf('.')) {
						merge(tmp, this.getObjByPath(k, obj[k]))
						delete obj[k]
					}
				}
				
				return merge(obj, tmp)
			},
			showItems() {
				return this.formItems.filter(v => v.show)
			},
			showBtns() {
				return (this.$slots && this.$slots.append) || this.formBtns.length
			}
		},
		watch: {
			// 重新覆盖formCache
			resave: function(newval) {
				this.saveCache = newval
			},
			items: function(newval) {
				this.initFormItems(newval, (items) => {
					this.updateForm(items)
				})
			}
		},
		methods: {
			// 初始化form items
			initFormItems(items = [], cb) {
				this.formItems = cloneDeep(items).map(v => {

					v.size = v.size || this.config.size

					v.type = this.formTypeMaps[v.type] || v.type || 'txt'

					!v.hasOwnProperty('show') && (v.show = true)

					isNumber(v.field) && (v.field = String(v.field))

					isArray(v.field) && (v.value = v.value || [])

					return v
				})

				isFunction(cb) && cb(this.formItems)
			},
			// 更新form item
			updateFormItem(arg1, arg2, arg3) {
				if (isArray(arg1) && arg1.every(v => isPlainObject(v))) {
					this.initFormItems(arg1, (items) => {
						this.updateForm(items)
					})
				} else {
					let idx, field, type, cacheVal = ''
					
					if (isString(arg1)) {
						this.formItems.forEach((v, i) => {
							v.field === arg1 && (idx = i)
							if(v.field === arg1) {
								idx = i
								type = v.type
							}
						})
						field = arg1
					} else if(isNumber(arg1)) {
						idx = arg1
						field = this.formItems[idx].field
						type = this.formItems[idx].type
					} else if(isArray(arg1) && arg1.every(v => isString(v))) {
						this.formItems.forEach((v, i) => {
							if(isArray(v.field) && v.field.every((v, i) => v == arg1[i])) {
								idx = i
								type = v.type
							}
						})
						field = arg1
					}

					if (['select', 'radio'].includes(type) && this.formCache) {
						cacheVal = this.formCache[field] || ''
					}

					if (isPlainObject(arg2)) {
						this.formItems[idx] = arg2
						this.form[field] = this.getValByCompare(arg2.value, cacheVal)
					} else if(isString(arg2)) {
						this.formItems[idx][arg2] = arg3
						arg2 === 'value' && (this.form[field] =  this.getValByCompare(arg3, cacheVal))
					}
				}
			},
			// 更新表单
			updateForm(items) {
				this.form = items.reduce((res, cur) => {

					if (cur.prepend && cur.prepend.field) {
						res[cur.prepend.field] = cur.prepend.value
					}
					if (cur.append && cur.append.field) {
						res[cur.append.field] = cur.append.value
					}

					res[cur.field] = cur.value

					return res
				}, {})

				// 是否保存重置初始form
				if (this.saveCache || !this.formCache) {
					this.formCache = cloneDeep(this.form)
					this.saveCache = false
					this.$emit('update:resave', false)
				}
			},
			// 获取field 映射的 value key
			getValueKeyName(field = '') {
				try {
					let arr = field.split('|')
					let	f = arr[0]
					let	s = arr[1] || ''
					let	maps = this.config.fieldMaps || {}

					if(!s) {
						for(let k in maps) {
							~maps[k].indexOf(f) && (s = k)
						}
					}

					return [f, s]
				} catch (error) {
					throw new Error(error)
				}
			},
			// 通过两个值比较，取值（v1 为非且不等于0时取 v2 否则取 v1）
			getValByCompare(v1, v2) {
				return v1 || v1 === 0 ? v1 : v2
			},
			// 表单item获取绑定参数
			getBindProps(node, index) {
				let props = { ...node, index }
				delete props.label
				delete props.value
				delete props.class
				delete props.component
				delete props.itemWidth
				return props
			},
			// 获取form数据
			getData() {
				return this.formData
			},
			// 根据item 下标 或者 field属性 获取item 组件
			getFormItemVm(key) {
				let vm = null, field = key, refs = this.$refs.formItem

				if (isNumber(key)) {
					field = this.formItems[key].field
				}

				[...refs].forEach(ref => {
					if (ref.field && String(ref.field) === String(field)) {
						vm = ref
					} else if (ref.bindProps && ref.bindProps.field && String(ref.bindProps.field) === String(field)) {
						vm = ref.$children[0]
					}
				})
				
				return vm || {}
			},
			// 表单form发生变化
			formChange({ field, value, index, curItem, type }) {

				this.updateFormItem(field, 'value', value)

				if (this.formLinkMaps.hasOwnProperty(field)) {
					let fields = this.formLinkMaps[field], links = []

					if (isString(fields)) {
						links = [fields]
					} else if(isArray(fields)) {
						links = fields
					}

					links.forEach(link => {
						const v = type == 2 ? curItem : value
						let [ to, from ] = this.getValueKeyName(link)
						if (this.form.hasOwnProperty(link)) {
							this.updateFormItem(link, 'value', from ? v[from] : v[to])
						} else if(this.form.hasOwnProperty(to)) {
							this.updateFormItem(to, 'value', from ? v[from] : v[to])
						}
					})
				}
				
				this.$emit('change', {
					formData: this.formData,
					field,
					value,
					index
				})
			},
			// 是否为空
			isEmptyValue(val) {
				let res = true
				if (isString(val)) {
					res = !val
				} else if(isNumber(val)) {
					res = false
				} else if(isArray(val)) {
					res = !val.length
				} else if(isPlainObject(val)) {
					for (let k in val) {
						if (val[k] || val[k] == 0) {
							res = false
						}
					}
				}

				return res
			},
			// 表单按钮点击事件
			onButtonClick(btn) {
				switch (btn.code) {
					case 'reset':
					case 'clear':
					case 'cancel':
						this.form = cloneDeep(this.formCache)
						this.$emit(btn.code, this.formData)
						break;
					default:
						this.$refs['form'].validate((valid) => {
							if (valid) {
								let i = 0, isBreak = false

								while(i < this.formItems.length && !isBreak) {
									let item = this.formItems[i]

									if(item.required && this.isEmptyValue(this.form[item.field])) {
										this.$msgError(`${ item.label || '该项' }不能为空！`)
										isBreak = true
										return false
									}

									i ++
								}

								this.$emit(btn.code, this.formData)
							} else {
								return false
							}
						})
						break;
				}
			},
			// reset
			resetForm() {
				this.form = cloneDeep(this.formCache)
			},
			getObjByPath(path, val) {
				const arr = path ? path.split('.') : []

				if (arr.length) {
					let i = arr.length - 1
					let obj = {}
					let tmp = {}
					
					while (i >= 0 && arr.length) {
						if (i == arr.length - 1) {
							tmp[arr[i]] = val
						} else {
							tmp[arr[i]] = { ...tmp }
						}
						i --
					}
					
					obj[arr[0]] = tmp[arr[0]]
					
					return obj
				} else {
					return {}
				}
			}
		},
		mounted() {
			if(this.items && this.items.length) {
				this.initFormItems(this.items, (items) => {
					this.updateForm(items)
				})
			}
		},
		destroyed() {
			this.rules = null
			this.form = null
			this.formCache = null
		}
	}
</script>

<style lang="less">
	.app-form.el-form {
		width: 100%;
		overflow: hidden;
		font-size: 0;
		&.dialog-view-box {
			width: auto;
		}
		.el-autocomplete {
			width: 100%;
		}
		.el-form-item {
			float: left;
			min-height: 32px;
			margin-right: 0;
			margin-bottom: 10px;
		}
		.el-form-item__label,
		.el-form-item__content {
			padding-right: 10px;
		}
		&.el-form--inline {
			.el-form-item {
				float: none;
				vertical-align: bottom;
			}
		}
		&.align-left {
			text-align: left;
		}
		&.align-center {
			text-align: center;
		}
		&.align-right {
			text-align: right;
		}
		.app-form__btns {
			margin-right: 0;
			.el-form-item__content {
				padding-right: 0px;
			}
		}
		.app-form-item__textarea {
			.el-input.readonly {
				word-break: break-all;
				.el-input__inner {
					height: auto;
					min-height: 32px;
					line-height: 24px;
				}
			}
		}
	}
</style>
