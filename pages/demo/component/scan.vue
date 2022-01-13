<template>
	<view>
		<u-button class="u-m-t-20" @click="chooseImg">附件</u-button>
		<u-button class="u-m-t-20" @click="scan">扫描</u-button>
		<image :src="imge"></image>
	</view>
</template>

<script>
	var self
	export default {
		data(){
			return {
				imge:''
			}
		},
		methods:{
			chooseImg(){
				console.log('start chooseImg')
				uni.chooseImage({
					sizeType:['compressed'],
					complete(res) {
						console.log('choose',res);
					},
					success(res) {
						self.imge = res.tempFilePaths[0]
					}
				})
			},
			scan(){
				console.log('start scan')
				uni.scanCode({
					scanType:['qrCode'],
					complete(res) {
						console.log('scan',res);
					}
				})
			}
		},
		onLoad() {
			self = this
		}
	}
</script>

<style>
</style>
