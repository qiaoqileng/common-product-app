<template>
	<view>
		<u-tree2
			 ref="tree"
			:tree-data="data" 
			check-on-click-node 
			show-checkbox 
			default-expand-all 
			node-key="id"
			highlight-current 
			:props="defaultProps"/>
		<view class="ly-button-wrapper">
			<button class="ly-button" @tap="getCheckedNodes">通过 node 获取</button>
			<button class="ly-button" @tap="getCheckedKeys">通过 key 获取</button>
			<button class="ly-button" @tap="setCheckedNodes">通过 node 设置</button>
			<button class="ly-button" @tap="setCheckedKeys">通过 key 设置</button>
			<button class="ly-button" @tap="resetChecked">清空</button>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				data: [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 4,
						label: '二级 1-1',
						children: [{
							id: 9,
							label: '三级 1-1-1'
						}, {
							id: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 5,
						label: '二级 2-1'
					}, {
						id: 6,
						label: '二级 2-2'
					}]
				}, {
					id: 3,
					label: '一级 3',
					children: [{
						id: 7,
						label: '二级 3-1'
					}, {
						id: 8,
						label: '二级 3-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			getCheckedNodes() {
				console.log('getCheckedNodes', this.$refs.tree.getCheckedNodes());
			},
			
			getCheckedKeys() {
				console.log('getCheckedKeys', this.$refs.tree.getCheckedKeys());
			},
			
			setCheckedNodes() {
				this.$refs.tree.setCheckedNodes([{
					id: 5,
					label: '二级 2-1'
				}, {
					id: 9,
					label: '三级 1-1-1'
				}]);
			},
			
			setCheckedKeys() {
				this.$refs.tree.setCheckedKeys([3]);
			},
			
			resetChecked() {
				this.$refs.tree.setCheckedKeys([]);
			}
		}
	};
</script>

<style>
	.ly-button-wrapper {
		padding: 0 30rpx;
	}

	.ly-button {
		margin-bottom: 20rpx;
	}
</style>
