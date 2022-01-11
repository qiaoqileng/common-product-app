<template>
	<u-tree2
		:tree-data="treeData" 
		node-key="label" 
		show-node-icon 
		:props="defaultProps">
		<text style="margin-left: 8rpx;" @click.stop="handleClick">
			进入企业
		</text>
	</u-tree2>
</template>

<script>
	export default {
		data() {
			return {
				defaultProps:() => {
					return {
						label: 'label',
						children: 'children',
						// icon: 'img', // 可以这样写
						icon(data, node) { // 也可以用函数动态配置
							return data.img;
						}
					}
				},
				treeData: [{
					label: '一级 1一级 1一1一级一级 1一级 1一级 1一级 1一级 1一级 1',
					img: '/static/clw.png',
					slot: true,
					children: [{
						label: '二级 1-1二级 1-1二级 1-1二级 1-1二级 1-1二级 1-1二级 1-1',
						img: '/static/csmysql.png',
						children: [{
							label: '三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1三级 1-1-1'
						}]
					}]
				}, 
				{
					label: '一级 2',
					img: '/static/csmysql.png',
					slot: true,
					children: [{
						label: '二级 2-1',
						img: '/static/clw.png',
						children: [{
							label: '三级 2-1-1'
						}]
					}, {
						label: '二级 2-2',
						img: '/static/clw.png',
						children: [{
							label: '三级 2-2-1'
						}]
					}]
				}, {
					label: '一级 3一级 3一级 3一级 3一级 3一级 3一级 3一级 3',
					img: '/static/clw.png',
					slot: true,
					children: [{
						label: '二级 3-1',
						img: '/static/clw.png',
						children: [{
							label: '三级 3-1-1'
						}]
					}, {
						label: '二级 3-2',
						children: [{
							label: '三级 3-2-1'
						}]
					}]
				}
				]
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			handleClick() {
				uni.showToast({
					title: 'click'
				})
			},
			//uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
			},
			
			handleNodeExpand(obj) {
				console.log('handleNodeExpand', JSON.stringify(obj));
			}
		}
	};
</script>