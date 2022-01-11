<template>
	<view>
		<u-tree2
			:tree-data="treeData" 
			node-key="id" 
			@node-expand="handleNodeExpand" 
			@node-click="handleNodeClick" />
			
		<view class="ly-padding">
			<button @tap="handleUpdate">更新</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				treeData: [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 11,
						label: '二级 1-1',
						children: [{
							id: 111,
							label: '三级 1-1-1'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 21,
						label: '二级 2-1',
						children: [{
							id: 211,
							label: '三级 2-1-1'
						}]
					}, {
						id: 22,
						label: '二级 2-2',
						children: [{
							id: 221,
							label: '三级 2-2-1'
						}]
					}]
				}, {
					id: 3,
					label: '一级 3',
					children: [{
						id: 31,
						label: '二级 3-1',
						children: [{
							id: 311,
							label: '三级 3-1-1'
						}]
					}, {
						id: 32,
						label: '二级 3-2',
						children: [{
							id: 321,
							label: '三级 3-2-1'
						}]
					}]
				}]
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			// uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleNodeClick(obj) {
				console.log('handleNodeClick', obj);
			},
			
			handleNodeExpand(obj) {
				console.log('handleNodeExpand', obj);
			},
			
			handleUpdate() {
				this.treeData = [{
					id: 1,
					label: '一级 1222',
					children: [{
						id: 11,
						label: '二级 1-1 222222',
						children: [{
							id: 111,
							label: '三级 1-1-1'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2333',
					children: [{
						id: 21,
						label: '二级 2-1',
						children: [{
							id: 211,
							label: '三级 2-1-1'
						}]
					}, {
						id: 22,
						label: '二级 2-2',
						children: [{
							id: 221,
							label: '三级 2-2-1'
						}]
					}]
				}, {
					id: 3,
					label: '一级 3444',
					children: [{
						id: 31,
						label: '二级 3-1',
						children: [{
							id: 311,
							label: '三级 3-1-1'
						}]
					}, {
						id: 32,
						label: '二级 3-2',
						children: [{
							id: 321,
							label: '三级 3-2-1'
						}]
					}]
				}]
			}
		}
	};
</script>
