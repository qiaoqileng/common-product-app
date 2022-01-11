<template>
	<u-tree2
		:tree-data="treeData" 
		:ready="ready" 
		node-key="label" 
		@node-expand="handleNodeExpand" 
		@node-click="handleNodeClick" 
	/>
</template>

<script>
	export default {
		data() {
			return {
				ready: false,
				treeData: []
			};
		},
		onLoad() {
			setTimeout(() => {
				this.treeData = [{
					label: '一级 1',
					children: [{
						label: '二级 1-1',
						children: [{
							label: '三级 1-1-1'
						}]
					}]
				}, {
					label: '一级 2',
					children: [{
						label: '二级 2-1',
						children: [{
							label: '三级 2-1-1'
						}]
					}, {
						label: '二级 2-2',
						children: [{
							label: '三级 2-2-1'
						}]
					}]
				}, {
					label: '一级 3',
					children: [{
						label: '二级 3-1',
						children: [{
							label: '三级 3-1-1'
						}]
					}, {
						label: '二级 3-2',
						children: [{
							label: '三级 3-2-1'
						}]
					}]
				}];
				this.ready = true;
			}, 1000);
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
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
