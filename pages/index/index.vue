<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<u-button class="u-m-t-20" v-for="(item,index) in demoList" :key="index" @click="jump(item.url)">{{item.title}}</u-button>
	</scroll-view>
</template>

<script>
	import { storeUtil } from "@/utils/fun.js"
	export default {
		data() {
			return {
				demoList:[{
					title:'公共组件',
					url:'/pages/demo/component/index'
				},{
					title:'websocket',
					url:'/pages/demo/websocket'
				}]
			}
		},
		onLoad(opt) {
			const {token} = opt
			if (token) {
				storeUtil.setTokenKey('x-access-token')
				storeUtil.setToken(token)
			}
		},
		methods: {
			jump(url){
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style>
</style>
