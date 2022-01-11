<template>
	<view>
		<c-video ref="vvideo" />
		<view v-for="(item,i) in list" :key="i">
			<u-button class="u-m-t-20" @click="itemClick(item.url)">{{item.label}}</u-button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[{label:'video1(m3u8)',url:'http://yun-live.oss-cn-shanghai.aliyuncs.com/record/yunlive/record/yunlive/meeting_1070/2020-11-25-09-27-59_2020-11-25-09-35-52.m3u8'},
				{label:'video2(m3u8)',url:'http://hls.cntv.lxdns.com/asp/hls/main/0303000a/3/default/978a64ddd3a1caa85ae70a23414e6540/main.m3u8'},
				{label:'video3(rtsp)',url:'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'}]
			}
		},
		methods: {
			itemClick(url){
				this.$refs.vvideo.play(url)
			}
		},
		onReady() {
		}
	}
</script>

<style>

</style>
