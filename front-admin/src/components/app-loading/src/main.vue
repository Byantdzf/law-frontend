<template>
	<div :class="['app-loading',{ 'app-loading-inline': inline }]" v-show="show">
		<div :class="['app-loading-mask', { fadeIn: show }]" v-if="mask"></div>
		<div class="app-loading-main">
			<div class="app-loading-icon" v-if="!isIE9">
				<div
					v-for="i in 12"
					:class="['icon-item', `icon-item_${i}`]"
					:key="i"
					:style="`transform: rotate(${(i - 1)*30}deg);`"
				>
				</div>
			</div>
			<div class="app-loading-icon" v-else>
				<img class="app-loading-img" :src="iconImg" />
			</div>
			<div class="app-loading-text" v-if="!$slots.default">{{ text }}</div>
			<div class="app-loading-text" v-else>
				<slot />
			</div>
		</div>
	</div>
</template>

<script>
	import iconImg from '@/assets/images/loading.gif'
	export default {
		name: 'app-loading',
		props: {
			show: Boolean,
			inline:Boolean,
			iconImg: {
				type: String,
				default: iconImg
			},
			mask: {
				type: Boolean,
				default: true
			},
			text: String
		},
		computed: {
			isIE9() {
				return !!~navigator.appVersion.indexOf('MSIE 9.0')
			}
		}
	}
</script>

<style lang="less" scoped>
.app-loading {
	overflow: hidden;
}
.app-loading-mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: #fff;
	opacity: 0;
	z-index: 10001;
	&.fadeIn {
		animation-name: maskFadeIn;
		animation-delay: 0.1s;
		animation-duration: 0.1s;
		animation-fill-mode: forwards;
	}
}
.app-loading-main {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%,-50%,0);
	width: 100px;	
	height: 100px;
	border-radius: 8px;
	color: #333;
	z-index: 10002;
}
.app-loading-text {
	position: relative;
	padding: 10px 0;
	font-size: 14px;
	text-align: center;
}
.app-loading-inline {
	.app-loading-main {
		position: relative;
		top: auto;
		left: auto;
		width: auto;
		height: auto;
		transform: translate3d(0,0,0);
		background: none;
	}
	.app-loading-text {
		display: inline-block;
		padding: 0px;
		vertical-align: middle;
		color: #000;
	}
	.app-loading-icon {
		display: inline-block;
		margin-top: 0;
		width: 30px;
		height: 30px;
		vertical-align: middle;
		.icon-item {
			&:before {
				background-color: #999;
			}
		}
	}
}
.app-loading-icon {
	position: relative;
	margin: 0px auto;
	width: 42px;
	height: 42px;
	.icon-item {
		position: absolute; 
		top: 0; 
		left: 0; 
		width: 100%; 
		height: 100%;
		&:before {
			content: '';
			display: block;
			margin: 0% auto;
			width: 8%;
			height: 25%;
			background-color: #333;
			border-radius: 6px;
			-webkit-animation: jh-circleFadeDelay-ios 1.2s infinite ease-in-out both;
			animation: jh-circleFadeDelay-ios 1.2s infinite ease-in-out both;
		}
	}
	.icon-item_1:before {
		transform: rotate(1deg);
		animation-delay: 0.05s;
	}
	.icon-item_2:before {
		animation-delay: -1.1s;
	}
	.icon-item_3:before {
		animation-delay: -1s;
	}
	.icon-item_4:before {
		animation-delay: -0.9s;
	}
	.icon-item_5:before {
		animation-delay: -0.8s;
	}
	.icon-item_6:before {
		animation-delay: -0.7s;
	}
	.icon-item_7:before {
		animation-delay: -0.6s;
	}
	.icon-item_8:before {
		animation-delay: -0.5s;
	}
	.icon-item_9:before {
		animation-delay: -0.4s;
	}
	.icon-item_10:before {
		animation-delay: -0.3s;
	}
	.icon-item_11:before {
		animation-delay: -0.2s;
	}
	.icon-item_12:before {
		animation-delay: -0.1s;
	}
}

.app-loading-img{
	width: 36px;
	margin: 30px auto 0;
}
 
@keyframes jh-circleFadeDelay-ios {
	0%,
	39%,
	100% {
		opacity: .3;
	}
	40% {
		opacity: 1;
	}
}

@keyframes maskFadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 0.3;
	}
}

</style>