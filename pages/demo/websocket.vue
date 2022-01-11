<template>
		<view class="u-flex-col">
			<view class="u-flex">
				<u-input v-model="value" type="text" />
				<u-button @click="send">发送</u-button>
			</view>
			<view v-for="(item,i) in list" :key="i">
				<u-parse v-if="item.server" class="u-type-primary" :html="item.text"/>
				<u-parse v-else class="u-content-color" :html="item.text"/>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				list: []
			}
		},
		methods: {
			send() {
				this.list.push({
					server: false,
					text: this.value
				})
				this.$u.webSocket.send(this.value)
			}
		},
		onLoad(option) {
			
			var _self = this
			this.$u.webSocket.get('ws://172.16.100.216:8765', {}, {}, function(message) {
				console.log("收到消息", message.data)
				//#ifdef APP-PLUS
				plus.push.createMessage(message.data,'',{
					title:'通知',
					subtitle:'小标题'
				})
				//#endif
				_self.list.push({
					server: true,
					text: message.data
				})
			}, function(error) {
				console.log("报错", error.data)
				_self.list.push({
					server: true,
					text: error.data
				})
			})
		},
		onUnload() {
			this.$u.webSocket.close()
		}
	}
</script>

<style>
</style>
