<template>
	<u-popup :emptyBg="true" mode="center" v-model="myValue" @close="popupClose" border-radius="16">
		<view class="u-flex" style="width: 600rpx;" @click="myValue = false">
			<u-line-progress v-if="showPercent" :striped="true" :striped-active="true" :percent="percent"></u-line-progress>
			<progress v-else />
		</view>
	</u-popup>
</template>

<script>
	import {commonUtil,httpUtil} from '@/utils/fun.js'
export default {
	name: 'c-download-file',
	props: {
		showPercent: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			myValue:false,
			percent:0
		};
	},
	methods: {
		showLoading(show){
			if (this.showPercent){
				if (show){
					uni.showLoading({
						title:'请稍后...'
					})
				} else {
					uni.hideLoading()
				}
			} else {
				this.myValue = show
			}
		},
		download(url,callback) {
			//#ifndef H5
			console.log('url', url);
			this.showLoading(true)
			let that = this
			let task = uni.downloadFile({
				url,
				success: res => {
					console.log('下载成功', res);
					uni.hideLoading();
					if (res.statusCode === 200) {
						callback(res.tempFilePath)
					} else {
						commonUtil.toastErr(res, '下载失败');
					}
					that.showLoading(false)
				},
				fail: err => {
					commonUtil.toastErr(res, '下载失败');
					console.log('downloadFile', err);
					that.showLoading(false)
				}
			});
			if (this.showPercent) {
				task.onProgressUpdate(res => {
					console.log('onProgressUpdate',res)
					if (res.progress > 0) {
						that.percent = res.progress
					}
				});
			}
			//#endif
			//#ifdef H5
			httpUtil.h5DownloadFile(url)
			//#endif
		},
		popupClose() {
			this.$emit('input', false);
		},
	}
};
</script>

<style></style>
