<template>
	<u-tree2 :tree-data="data" 
		:props="defaultProps" 
		ref="tree" 
		node-key="id" 
		show-radio 
		checkOnClickNode
		@check="handleCheck"
		@radio-change="handleRadioChange"
		@node-click="handleNodeClick" 
	/>
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
		
		onLoad() {
			// 如果初始化树时设置节点选择需要做适当延时，可以在下一个事件轮询中执行
			this.$nextTick(() => {
				this.$refs.tree.setCheckedKeys([6])
			})
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
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
			
			// 只要节点的选中状态改变就触发（包括设置默认选中，点击选中/取消选中），会被触发多次
			handleRadioChange(obj) {
				console.log('handleRadioChange', obj);
			},
			
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
				console.log('getNodePath', this.$refs.tree.getNodePath(obj.data));
			}
		}
	};
</script>