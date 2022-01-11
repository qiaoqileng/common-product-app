<template>
	<view :class="isComponent ? 'wrapComponent' : 'wrap'" :style="theme">
		<slot />
	</view>
</template>

<script>
	import defaultSetting from '@/utils/config.js'
	export default {
		data () {
			return {
				theme: `
				   --bg-color: #f1f3f5; 
				   --primary: ${defaultSetting.primary}; 
					 --primary-light: ${defaultSetting.primaryLight};
					 --primary-disabled: ${defaultSetting.primaryDisabled}; 
				   --primary-dark: ${defaultSetting.primaryDark}; 
				   --component-color: #fff; 
				`
			}
		},
		props: {
			// 背景色， 是否和组件背景色一样
			// 场景： 登录页是全白底色， 但是工作页面是灰色底
			isComponent: {
				type: Boolean,
				default: false
			},
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		background-color: $u-bg-color;
		// min-height: 100vh;
	}
	.wrapComponent {
		background-color: $u-component-color;
		// min-height: 100vh;
	}
</style>
