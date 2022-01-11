<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<view style="height: 225px;">
				<!-- #ifdef H5 -->
				<view ref="video"></view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<video
					id="myVideo"
					style="width: 100%;"
					vslide-gesture="true"
					enable-progress-gesture="false"
					:src="url"
					:autoplay="autoplay"
					:show-center-play-btn="showCenterPlayBtn"
					controls
					title="视频监控"
					@error="videoErrorCallback"
				>
					<!-- #endif -->
				</video>
			</view>
		</view>
	</view>
</template>

<script>
import util from '@/utils/fun';
import {videojs_zh} from '@/utils/config.js'
var option = {
	// poster: 'https://s.yun-live.com/images/20200715/902844b0f1215ff236ad6b1bd1683555.jpg', // 视频封面图地址
	// title: '12334567788999900',
	playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
	autoDisable: true,
	preload: 'none', //auto - 当页面加载后载入整个视频 meta - 当页面加载后只载入元数据 none - 当页面加载后不载入视频
	language: 'zh-CN',
	fluid: true, // 自适应宽高
	muted: false, //  是否静音
	aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
	controls: true, //是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
	autoplay: true, //如果true,浏览器准备好时开始回放。 autoplay: "muted", // //自动播放属性,muted:静音播放
	loop: false, // 导致视频一结束就重新开始。 视频播放结束后，是否循环播放
	techOrder: ['html5'], //播放顺序
	screenshot: true,
	controlBar: {
		volumePanel: {
			//声音样式
			inline: false // 不使用水平方式
		},
		timeDivider: true, // 时间分割线
		durationDisplay: true, // 总时间
		progressControl: true, // 进度条
		remainingTimeDisplay: true, //当前以播放时间
		fullscreenToggle: true, //全屏按钮
		pictureInPictureToggle: true //画中画
	},
	fill:true,
};
export default {
	name: 'c-video',
	data() {
		return {
			src: '',
			player: {}
		};
	},
	mounted: function(res) {
		// #ifndef MP-ALIPAY
		this.videoContext = uni.createVideoContext('myVideo');
		// #endif
		// #ifdef H5
		// var video = document.createElement('video')
		// video.id = 'video'
		// video.style = 'width:100%'
		// video.controls = true
		// var source = document.createElement('source')
		// source.src = ''

		// video.appendChild(source)
		// this.$refs.video.$el.appendChild(video)
		// this.player = videojs('video')
		let video = document.createElement('video');
		video.id = 'video';
		video.className = 'video-js'
		video.style = 'width: 100%;';
		video.controls = true;
		video.setAttribute('playsinline', true); //IOS微信浏览器支持小窗内播放
		video.setAttribute('webkit-playsinline', true); //这个bai属性是ios 10中设置可以让视频在小du窗内播放，也就是不是全zhi屏播放的video标签的一个属性
		video.setAttribute('x5-video-player-type', 'h5'); //安卓 声明启用同层H5播放器 可以在video上面加东西
		// let source = document.createElement('source');
		// source.src = 'http://yun-live.oss-cn-shanghai.aliyuncs.com/record/yunlive/record/yunlive/meeting_1070/2020-11-25-09-27-59_2020-11-25-09-35-52.m3u8'
		// video.appendChild(source);
		this.$refs.video.$el.appendChild(video);
		let that = this;
		
		that.player = videojs('video', option, function() {
			this.on('error', function() {
				//请求数据时遇到错误
				console.log('请求数据时遇到错误');
			});
			this.on('stalled', function() {
				//网速失速
				console.log('网速失速');
			});
			this.on('play', function() {
				//开始播放
				console.log('开始播放');
			});
			this.on('pause', function() {
				//暂停
				console.log('暂停');
			});
			this.on('timeupdate', function() {
				// console.log(this.currentTime())
			});
		});
		
		// #endif
	},
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    },
	methods: {
		videoErrorCallback: function(e) {
			uni.showModal({
				content: e,
				showCancel: false
			});
		},
		play(url) {
			console.log(url);
			// #ifdef H5
			if (this.player) {
				// this.player.src(url);
				// this.player.autoplay();
				this.player.reset(); //重置为它们的默认值
				// this.player.pause()
				// 判断一下视频类型，设置不同的type
				let type = '';
				if (url.indexOf('.mp4') !== -1) {
					type = 'video/mp4';
				} else if (url.indexOf('.m3u8') !== -1) {
					type = 'application/x-mpegURL';
				} else {
					type = 'rtmp/hls';
				}
				this.player.src({
					src: url,
					type: type,
					withCredentials: false //跨域请求设置withCredentials
				});
				let video = document.getElementById('video');
				video.setAttribute('playsinline', true); //IOS微信浏览器支持小窗内播放
				video.setAttribute('webkit-playsinline', true); //这个bai属性是ios 10中设置可以让视频在小du窗内播放，也就是不是全zhi屏播放的video标签的一个属性
				video.setAttribute('x5-video-player-type', 'h5'); //安卓 声明启用同层H5播放器 可以在video上面加东西
				this.player.playbackRate(1.0); //设定新的播放速度2倍速度
				this.player.load(url);
				this.player.autoplay('play')
			} else {
				console.log('videojs is not ready');
			}
			// #endif
			// #ifndef H5
			this.src = url;
			// #endif
		}
	}
};
</script>

<style>

</style>
