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
