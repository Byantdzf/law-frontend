<template>
	<el-dialog
		:class="classNames"
		:style="`left:${ sideWidth }px;`"
		:visible="visible"
		v-bind="bindProps"
		v-on="$listeners"
		@opened="dialogOpened"
		@closed="dialogClosed"
		ref="appDialog"
	>
		<slot name="title" slot="title">
			<span class="el-dialog__title">{{ title || $t('text.tips') }}</span>
		</slot>
		<slot />
		<app-loading :show="ajaxLoading" />
	</el-dialog>
</template>

<script>
	import { Dialog } from 'element-ui'
	import { mapState } from 'vuex'
	export default {
		name: 'app-dialog',
		components: {
			[Dialog.name]: Dialog
		},
		props: {
			...Dialog.props,
			visible: Boolean,
			title: String,
			'custom-class': {
				type: String,
				default: 'app-dialog'
			},
			'append-to-body': {
				type: Boolean,
				default: true
			},
			'close-on-press-escape': {
				type: Boolean,
				default: false
			},
			'close-on-click-modal': {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '1000px'
			},
			height: {
				type: String,
				default: 'auto'
			},
			draggable: {
				type: Boolean,
				default: true
			},
			full: Boolean
		},
		data() {
			return {
				sideTimer: null,
				sideWidth: 0,
				dialogBox: null,
				dialogHeader: null,
				dialogBody: null,
				// 对话框的宽
				dw: 0,
				// 对话框的高
				dh: 0,
				// 对话框鼠标按下时的top
				st: 0,
				// 对话框鼠标按下时的left
				sl: 0,
				// 鼠标按下时的x
				sx: 0,
				// 鼠标按下时的y
				sy: 0,
				// 对话框初始偏移量offsetTop
				ot: 0,
				// 对话框初始偏移量offsetLeft
				ol: 0
			}
		},
		computed: {
			bindProps() {
				let props = { ...this.$props }
				delete props.draggable
				delete props.full
				delete props.height
				return props
			},
			isDraggable() {
				return this.draggable && !this.full
			},
			classNames() {
				let names = ['app-dialog__wrapper']

				if (this.isDraggable) {
					names.push('is-draggable')
				}

				if (this.full) {
					names.push('is-full')
				}

				return names
			},
			...mapState(['menuFold', 'ajaxLoading'])
		},
		watch: {
			menuFold() {
				this.setSideWidth()
			},
			height() {
				this.setDialogHeight()
			}
		},
		methods: {
			init() {
				this.setSideWidth()
				if(this.isDraggable) {
					let d = this.$refs.appDialog.$el

					if(!d) return

					this.dialogBox = d.querySelector('.el-dialog')
					this.dialogHeader = d.querySelector('.el-dialog__header')
				
					this.dialogHeader.addEventListener('mousedown', this.handleMouseDown)
				}
			},
			handleMouseDown(ev) {
				this.st = Number(this.dialogBox.style.top.split('px')[0])
				this.sl = Number(this.dialogBox.style.left.split('px')[0])
				this.sx = ev.x
				this.sy = ev.y
				
				document.addEventListener('mousemove', this.handleMouseMove)
				document.addEventListener('mouseup', () => {
					document.removeEventListener('mousemove', this.handleMouseMove)
				})
			},
			handleMouseMove(ev) {

				if (!this.isDraggable) {
					return false
				}
				
				let { x, y } = ev

				this.dialogBox.style.top = (y - this.sy + this.st) + 'px'
				this.dialogBox.style.left = (x - this.sx + this.sl) + 'px'

				if (this.dialogBox.offsetTop <= 0) {
					this.dialogBox.style.top = - this.ot + 'px'
				} else if (this.dialogBox.offsetTop >= (window.innerHeight - this.dh)) {
					this.dialogBox.style.top = (window.innerHeight - this.ot - this.dh) + 'px'
				}
				if (this.dialogBox.offsetLeft <= 0) {
					this.dialogBox.style.left = - this.ol + 'px'
				} else if (this.dialogBox.offsetLeft >= (window.innerWidth - this.sideWidth - this.dw)) {
					this.dialogBox.style.left = (window.innerWidth - this.sideWidth - this.dw)/2 + 'px'
				}

			},
			setSideWidth() {
				this.sideTimer && clearTimeout(this.sideTimer)
				this.sideTimer = setTimeout(() => {
					let side = document.querySelector('#app-side')
					side && (this.sideWidth = side.clientWidth)
				}, 350)
			},
			setDialogHeight() {
				let height = this.height

				if(/^[0-9]+.?[0-9]*$/.test(height)) {
					height = height + 'px'
				}

				if(this.dialogBody) {
					this.dialogBody.style = `max-height: ${ height };`
				}
			},
			dialogOpened() {
				if(this.dialogBox) {
					this.ol = this.dialogBox.offsetLeft
					this.ot = this.dialogBox.offsetTop
					this.dw = this.dialogBox.clientWidth
					this.dh = this.dialogBox.clientHeight

					this.dialogBody = this.dialogBox.querySelector('.el-dialog__body')

					this.setDialogHeight()
				}
			},
			dialogClosed() {
				if (this.dialogBox) {
					this.dialogBox.style.top = '0px'
					this.dialogBox.style.left = '0px'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.init()
			})
		},
		destroyed() {
			this.sideTimer && clearTimeout(this.sideTimer)
			this.dialogHeader && this.dialogHeader.removeEventListener('mousedown', this.handleMouseDown)
			this.sideTimer = null
			this.dialogBox = null
			this.dialogHeader = null
			this.dialogBody = null
		}
	}
</script>

<style lang="less">
.app-dialog__wrapper {
	overflow: hidden;
	&.is-draggable {
		.el-dialog__header {
			cursor: move;
		}
	}
	&.is-full {
		.el-dialog {
			margin-top: 0 !important;
			margin-bottom: 0 !important;
			width: 100% !important;
			height: 100% !important;
		}
		.el-dialog__body {
			position: absolute;
			top: 45px;
			right: 0;
			bottom: 0;
			left: 0;
		}
	}
	.el-dialog__body {
		overflow: auto;
	}
}
</style>
