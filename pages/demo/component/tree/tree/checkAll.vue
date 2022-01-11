<template>
	<view>
		<u-tree2 ref="tree" 
			:tree-data="treeData" 
			node-key="id" 
			show-checkbox 
			expand-on-check-node
			@check-change="handleCheckChange"/>
		<view class="ly-padding">
			<button @tap="setCheckAll">{{isCheckAll ? '取消全选': '全选'}}</button>
			<button class="ly-margin-top" @tap="getCheckedKeys">获取选中内容</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCheckAll: false,
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
			setCheckAll() {
				this.$refs.tree.setCheckAll(!this.isCheckAll);
			},
			
			// 从obj参数中获取全选状态checkedall
			handleCheckChange(obj) {
				this.isCheckAll = obj.checkedall;
			},
			
			getCheckedKeys() {
				console.log('仅叶子节点', this.$refs.tree.getCheckedKeys(true));
				console.log('不包含半选中状态的节点', this.$refs.tree.getCheckedKeys());
				console.log('包含半选中状态的节点', this.$refs.tree.getCheckedKeys(false, true));
			}
		}
	};
</script>