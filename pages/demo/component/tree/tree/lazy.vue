<template>
	<u-tree2
		v-if="isReady" 
		:props="props" 
		rightText="进入企业"
		node-key="id" 
		:load="loadNode" 
		:leafNodeClick="handleLeafNodeClick"
		:rightTextClick="handleRightTextClick"
		lazy 
		isInjectParentInNode
	>
	</u-tree2>
</template>


<script>
	var _self;
	export default {
		data() {
			return {
				// 为了确保页面加载完成后才去调用load方法，this指向正确
				isReady: false,
				props: {
					label: 'name',
					children: 'zones',
					isLeaf: 'leaf'
				}
			};
		},
		
		onLoad() {
			_self = this;
			this.isReady = true;
		},
		
		methods: {
			handleRightTextClick(node){
				console.log('handleRightTextClick', node)
			},
			handleLeafNodeClick(node){
				console.log('handleLeafNodeClick', node)
			},
			handleClick(node){
				console.log('click', node)
			},
			/*
			 * @description 懒加载函数，每次展开节点时自动调用这个函数
			 * @method loadNode
			 * @param {Object} node 节点对象，可以打印一下里面具体有什么参数
			 * @param {Function} resolve 一个回调函数，执行resolve([...])将节点数据回调给树组件处理
			*/
			loadNode(node, resolve, loadMore) {
				console.log('node节点参数', node);
				console.log('loadMore节点参数', loadMore);

				// 因为这个函数是在Vue实例以外的地方调用，如果函数内部需要用到this，需要改成_self
				// _self.isReady; 这里用_self而不是this
				
				
				// 通常，我们需要这样去调用一个请求，并把结果通过resolve回调
				// 开发者可以按照以下的请求方式去做请求并返回数据
				// uni.request({
				//     url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
				//     data: {
				//         id: node.data.id
				//     },
				//     success: (res) => {
				// 		resolve(res.data) // 假设这里的res.data是[]数据
				//     }
				// });

				if (loadMore) {
					setTimeout(() => {
						resolve([
							{
								id: `${Math.random() * 10000}`,
								name: '士大夫基士大夫爱上对方就可拉斯基的付款了氨基酸两地分居拉萨酱豆腐了建立撒娇坑书',
								leaf: true
							},
							{
								id: `${Math.random() * 10000}`,
								name: '阿斯顿阿斯顿',
								leaf: true
							},
							{
								id: `${Math.random() * 10000}`,
								name: '撒地方阿斯顿',
								leaf: true
							}
						]);
						node.page++
						if (node.page > 3) {
							node.canLoadMore = false
						}
					}, 500);
					return
				}
				const icon = 'https://pmbimcloud-test-company.oss-cn-hangzhou.aliyuncs.com/aa39009a-2a35-2c92-e090-0041672f24c0.jpg?Expires=1620910818&OSSAccessKeyId=LTAI8PPrIEVEAQCK&Signature=aLhe973k5cYz%2F%2BzVPYnFNyxmWpw%3D&response-content-disposition=attachment%3Bfilename%3D%224.2%E4%BA%BA%E5%91%98%E5%AE%9A%E4%BD%8D%E5%8F%91%E7%89%88.jpg%22'
				// 这里只是为了模拟数据，这个条件是用来判断当数的层级是第一层，也就是根节点，则返回根节点数据
				if (node.level === 0) {
					setTimeout(() => {
						resolve([
						{
							id: '1',
							name: '士大夫基士大夫爱上对方就可拉斯基的付款了氨基酸两地分居拉萨酱豆腐了建立撒娇坑书',
							textVisible: true,
							lineVisible: true,
							icon: icon,
							labelStyle: {
							  'color': 'black',
								'lineHeight': '40rpx'
							},
							textStyle: {
								'color': 'green',
								lineStyle: {
									'color': 'red',
									'paddingRight': '20rpx'
								}
							}
						},
						{
							id: '2',
							name: '撒地方阿斯顿',
							icon: icon,
							textVisible: true
						},
						{
							id: '3',
							name: '撒地方阿斯顿',
							icon: icon,
							textVisible: true
						}
						]);
					}, 500);
				} else {
					if (node.level > 1) return resolve([]);
					
					setTimeout(() => {
						const data = [];
					
						if (node.id === 1) {
							
						} else if (node.id === 2) {
							data.push({
							id: '1',
							name: 'leaf11',
							leaf: true
							})
						} else if (node.id === 3) {
							// 这里根据页数判断是否还有更多数据
							node.canLoadMore = true
							node.page = 1
							if (node.page < 3) {
								data.push({
									id: '1',
									name: 'leaf22',
									leaf: false
								})
								data.push({
									id: '2',
									name: 'leaf33',
									leaf: true
								})
								data.push({
									id: '3',
									name: 'leaf44',
									leaf: true
								})
								data.push({
									id: '4',
									name: 'leaf55',
									leaf: true
								})
								data.push({
									id: '5',
									name: 'leaf66',
									leaf: true
								})
								data.push({
									id: '6',
									name: 'leaf77',
									leaf: true
								})	
							}
						}
						resolve(data);
					}, 500);
				}
			}
		}
	};
</script>