<template>
	<view>
		<u-button @click="startDownload">开始下载</u-button>
		<c-download-file :showPercent="true" ref="downloadRef"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			startDownload(){
				this.$refs.downloadRef && this.$refs.downloadRef.download("/api/core/file/238292703505285121/393c08b0deb28ec1320d2012fa9a62d3/downLoad",(tempPath)=>{
					console.log('qql',tempPath)
				})
			}
		}
	}
</script>

<style>

</style>
