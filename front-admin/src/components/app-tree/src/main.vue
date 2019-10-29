<template>
	<el-row class="app-tree">
		<el-row class="app-tree-hd pd-10" v-if="!!title">
			<h3 class="title" v-if="!!title">{{ title }}</h3>			
		</el-row>
		<el-row class="pb-10" v-if="headerFilter">
			<template v-if="autocomplete">
				<el-autocomplete
					class="inline-input"
					v-model="filterText"
					:fetch-suggestions="querySearch"
					:placeholder="$t('placeholder.keyword')"
					size="mini"
					@select="handleSelect"
				/>
			</template>
			<template v-else>
				<el-input :placeholder="$t('placeholder.keyword')" v-model="filterText" size="mini" />
			</template>
		</el-row>
		<el-row class="app-tree-hd" v-if="$slots && $slots.header">
			<slot name="header"/>
		</el-row>
		<el-tree
			class="filter-tree"
			:default-expand-all='defaultExpandAll'
			highlight-current
			:indent="15"
			:node-key="defaultProps.id || 'id'"
			:data="treeData"
			:props="defaultProps"
			:expand-on-click-node="expandOnClickNode"
			:accordion="accordion"
			:show-checkbox="showCheckbox"
			:check-strictly="checkStrictly"
			:filter-node-method="filterNode"
			:render-content="renderContent"
			:default-checked-keys="defaultCheckedKeys"
			@node-click="nodeClick"
			@check-change="checkChange"
			ref="appTree"
		>
		</el-tree>
	</el-row>
</template>

<script>
	import { Tree } from 'element-ui'
	import { getTreeData, arrSort } from '@/utils/tools'
	export default {
		name: 'app-tree',
		components: {
			[Tree.name]: Tree
		},
		data(){
			return {
				filterText: '',
				count: 0,
				restaurants: []
			}
		},
		props: {
			title: String,
			defaultExpandAll:{
				type:Boolean,
				default:true
			},
			treeTableProps:Array,
			headerFilter: Boolean,
			actionHtml: String,
			actions: Array,
			data: Array,
			dataType: {
				type: String,
				default: 'flat'
			},
			autocomplete: {
				type: Boolean,
				default: true
			},
			accordion: Boolean,
			showCheckbox: Boolean,
			checkStrictly: Boolean,
			expandOnClickNode: Boolean,
			radio: Boolean,
			defaultProps: {
				type: Object,
				default: function () {
					return {
						children: 'children',
						label: 'name',
						id: 'id'
					}
				}
			},
			defaultCheckedKeys: Array,
			defaultCurrentNode: Object,
			renderContent: {
				type: Function,
				default: (h, { node }) => {
					return (<span>{ node.label }</span>)
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.appTree.filter(val)
			},
			treeData(newval) {
				if(newval && newval.length) {
					this.setDefaultCurrentNode()
					this.restaurants = [...newval]
				}
			},
			defaultCheckedKeys(keys) {				
				this.$refs.appTree.setCheckedKeys(keys, true)
			}
		},
		computed: {
			treeData() {
				let _t = this, arr = [], keyName = this.defaultProps.id || 'id'

				if(this.data && this.data.length) {
					arr = this.dataType == 'flat' ?
					getTreeData(arrSort(this.data, keyName)) :
					arrSort(this.data, keyName);

					(function buildData(arr) {
						arr.forEach(v => {
							if(!v.value) {
								v.value = v[_t.defaultProps.label]
							}
							v.children && v.children.length && buildData(v.children)
						})
					})(arr)

				}

				return arr
			},
			checkedNodes() {
				let checkeds = this.$refs.appTree.getCheckedNodes()
				return this.restaurants.reduce((res, cur) => {
					if(~JSON.stringify(checkeds).indexOf(JSON.stringify(cur))) {
						res.push(cur)
					}

					return res
				}, [])
			}
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true
				let _t = this
				let res = !!~data[_t.defaultProps.label].indexOf(value)

				!res && (function getRes(child) {
					_t.data.forEach(node => {
						let nid = node.id || node.key
						let did = child.parentId
						if(nid == did) {
							res =  !!~node[_t.defaultProps.label].indexOf(value)
							if(!res && Number(child.depth) !== 1) {
								getRes(node)
							}
						}
					})
				})(data)

        return res
			},
			nodeClick(data, node) {
				this.$emit('nodeClick', data, node)
			},
			onButtonClick(btn) {
				this.$emit('action', btn)
			},
			checkChange(data, checked, hasCheckedNode) {
				this.count ++

				if(this.radio && this.count % 2 == 0) {
					if(checked) {
						this.$refs.appTree.setCheckedNodes([])
						this.$refs.appTree.setCheckedNodes([data])
					} else {
						this.$refs.appTree.setCheckedNodes([])
					}
				}

				this.$emit('check-change', data, checked, hasCheckedNode)
			},
			querySearch(queryString, cb) {
				let restaurants = this.restaurants
				let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants

				cb(results)
			},
			createFilter(queryString) {
				return (restaurant) => {
					let value = restaurant[this.defaultProps.label]
					return (value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
				}
			},
			getDatas(type = 'tree') {
				let data

				switch(type) {
					case 'tree':
						data = this.treeData
						break;
					case 'sort':
						data = this.restaurants
						break;
					case 'checked':
						// data = this.checkedNodes
						data = this.$refs.appTree.getCheckedNodes()
						break;
					case 'old':
					default:
						data = this.data
						break;
				}

				return data
			},
			handleSelect() {
				// console.log(item)
			},
			setDefaultCurrentNode() {
				let node = this.defaultCurrentNode || this.treeData[0]
				this.$nextTick(() => {
					this.$refs.appTree.setCurrentNode(node)
				})
			},
			getCurrentNode() {
				return this.$refs.appTree.getCurrentNode()
			}
		}
	}
</script>

<style lang="less">
	.app-tree {
		position: relative;
		padding: 15px 0;
		height: 100%;
		z-index: 10;
		.title {
			padding: 0 15px;
			font-size: 15px;
			text-align: center;
		}
		.app-tree-filter {
			padding:0 0;
		}
		.el-autocomplete {
			width: 100%;
		}
		.app-tree-hd {
			.app-tree-table-hd {
				&>span{display: inline-block;text-align: center;}
				&>span:first-child{flex: 1;padding-left: 45px;text-align: left;}
				display: flex;
				flex-flow: row;align-items: center;
				padding: 12px 0;
				border-bottom:1px solid #EBEEF5;
				margin-top: 10px;
				position: relative;
				right: 0;
				flex:1;
				align-items: center;
				background:#f3f6f8;
				color:#999;
				font-weight: bold;
			}
		}
		.el-tree {
			width:100%;
			background:transparent;
		}

		.app-tree-actions {
			padding: 0;
		}
		.el-button--mini {
			padding: 5px 10px;
		}
		.el-tree-node__content {
			position: relative;
      height:44px;
      line-height: 44px;
			font-size: 14px;
			transition: background 0.3s;
		}
		.el-tree-node:focus>.el-tree-node__content {
			background-color: transparent;
		}
		.app-tree-table-columns {
			display: flex;flex-flow: row;align-items: center;width: 100%;
			position:relative;
			.app-tree-table-td {
				flex:1;
				display: flex;flex-flow: row;
				align-items: center;
				position: relative;
				right:0;
				
				&>span:first-child {
					text-align: left;
					display: flex;
					flex:1;
				}
				.app-tree-table-cell {
					text-align: center;
				}
			}
		}
	}
	.app-tree-table-header{padding:15px 0;background: #f3f6f8;color: #999;font-weight: bold;border-bottom: 1px solid #EBEEF5;}
	.app-tree-table-header .app-tree-table-cell:first-child{padding-left: 45px;}
	.app-tree .el-tree-node__content{border:1px solid #EBEEF5;border-top:none;}
	.app-tree-hd.pd-10{padding-bottom:10px;}
</style>