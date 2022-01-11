<template>
	<view>
		<view class="switch-wrapper">
			<text>{{defaultExpandAll ? '点击折叠全部' : '点击展开全部'}}</text>
			<switch :checked="defaultExpandAll" @change="switchChange"></switch>
		</view>
		<u-tree2
			ref="tree"
			node-key="id" 
			:tree-data="treeData"
			:toggle-expend-all="defaultExpandAll"
			:is-expend-current-node-tree="true"
			@node-expand="handleNodeExpand" 
			@node-click="handleNodeClick" />
	</view>
</template>

<script>
	const flat = function(arr){
		if (!Array.isArray(arr)) return [];
					
		return [].concat(...arr.map(item => [].concat(item, ...flat(item.children))));
	}
	export default {
		data() {
			return {
				defaultExpandAll: false,
				defaultExpandedKeys: [],
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
		
		onLoad() {
			
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			// uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
			},
			
			handleNodeExpand(obj) {
				console.log('handleNodeExpand', JSON.stringify(obj));
			},
			
			switchChange(e) {
				this.defaultExpandAll = !this.defaultExpandAll;
			}
		}
	};
</script>

<style>
	.switch-wrapper {
		background-color: #f7f7f7;
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
	}
</style>
