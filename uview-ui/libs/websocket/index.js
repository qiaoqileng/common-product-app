class WebSocket {
	
	constructor() {
		this.socketOpen = false;
		this.socketMsgQueue = [];
		this.closing = false;
		
		this.get = (url, params = {}, header = {}, onmessage, onerror) => {
			return this.webSocket({
				method: 'GET',
				url,
				header,
				params
			}, onmessage, onerror)
		}
		
		this.post = (url, params = {}, header = {}, onmessage, onerror) => {
			return this.webSocket({
				method: 'POST',
				url,
				header,
				params
			}, onmessage, onerror)
		}
		
		this.send = (msg)  => {
		 return this.sendSocketMessage(msg)
		}
		
		this.close = ()  => {
		 return this.closeSocket()
		}
	}

	sendSocketMessage(msg) {
		if (this.socketOpen) {
			uni.sendSocketMessage({
				data: msg
			});
		} else {
			this.socketMsgQueue.push(msg);
		}
	}

	closeSocket() {
		this.closing = true;
		uni.closeSocket();
	}

	webSocket(options = {}, onmessage, onerror) {
		this.closing = false;
		let url = ''
		if (url.indexOf("https") == 0) {
			url = url.replace('https', 'wss')
		} else if (url.indexOf("http") == 0) {
			url = url.replace('http', 'wss')
		}
		url += options.url
		console.log("url", url)
		var _self = this;
			uni.connectSocket({
				url: url,
				data() {
					return options.params
				},
				header: options.header || {'content-type': 'application/json'},
				method: options.method
			});
			uni.onSocketOpen(function(res) {
				if (_self.closing) {
					closeSocket();
					return
				}
				_self.socketOpen = true;
				if(_self.socketMsgQueue && _self.socketMsgQueue.length > 0) {
					for (var i = 0; i < _self.socketMsgQueue.length; i++) {
						sendSocketMessage(_self.socketMsgQueue[i]);
					}
				}
				_self.socketMsgQueue = [];
			});
			uni.onSocketClose(function(res) {
				_self.closing = false;
				onerror(res)
			});
			uni.onSocketError(function(res) {
				_self.socketOpen = false
				onerror(res)
			});
			uni.onSocketMessage(function(res) {
				onmessage(res)
			});
	}
}

const webSocket = new WebSocket

export default webSocket
