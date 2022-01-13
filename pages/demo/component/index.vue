<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<u-button class="u-m-t-20" v-for="(item,index) in demoList" :key="index" @click="jump(item.url)">{{item.title}}</u-button>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				demoList:[{
					title:'form表单',
					url:'/pages/demo/component/form'
				},{
					title:'下载器',
					url:'/pages/demo/component/download'
				},{
					title:'视频播放',
					url:'/pages/demo/component/video'
				},{
					title:'列表',
					url:'/pages/demo/component/list'
				},{
					title:'uni列表',
					url:'/pages/demo/component/list-uni'
				},{
					title:'tree',
					url:'/pages/demo/component/tree/index/index'
				},{
					title:'扫描todo',
					url:'/pages/demo/component/scan'
				}]
			}
		},
		onLoad() {

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
