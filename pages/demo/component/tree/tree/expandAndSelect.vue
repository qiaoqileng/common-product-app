<template>
	<view>
		<u-tree2 ref="tree"
			node-key="id" 
			expand-on-check-node
			show-checkbox 
			:tree-data="data" 
			:highlight-current="true" 
			:default-expanded-keys="expandKeys" 
			:default-checked-keys="checkedKeys"
			:props="defaultProps"
			@check="handleCheck"
			@check-change="handleCheckChange"/>
		<view class="ly-button-wrapper">
			<button class="ly-button" @tap="setCheckedKeys">切换默认选中</button>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				expandKeys: [2, 3, 4],
				checkedKeys: [2, 9],
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
			setCheckedKeys() {
				this.$refs.tree.setCheckAll(false);
				
				this.$nextTick(() => {
					this.checkedKeys = [2,8];
				});
			},
			
			// 只有在"点击"修改的指定节点会触发(也就是说这个方法只会触发一次)，obj中包含当前选中
			handleCheck(obj) {
				// obj: {
				// 	checkedKeys: [9, 5], // 当前选中节点的id数组
				// 	checkedNodes: [{...}, {...}], // 当前选中节点数组
				// 	data: {...}, // 当前节点的数据
				// 	halfCheckedKeys: [1, 4, 2], // 半选中节点的id数组
				// 	halfCheckedNodes: [{...}, {...}, {...}], // 半选中节点的数组
				// 	node: Node {...} // 当前节点实例
				// }
				
				console.log('handleCheck', obj);
			},
			
			// 只要节点的选中或半选中状态改变就触发（包括设置默认选中，点击选中/取消选中），其相关的所有父子节点都会触发（也就是说选中一个节点时，触发多次，父子节点的选中状态只要被修改就会触发）
			handleCheckChange(obj) {
				// obj: {
				// 	checked: true, // 节点是否选中
				// 	checkedall: false, // 当前树的所有节点是否全选中
				// 	data: {...}, // 节点数据
				// 	indeterminate: false, // 是否半选中
				// 	node: Node {...} // 节点实例
				// }
				
				console.log('handleCheckChange', obj);
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
