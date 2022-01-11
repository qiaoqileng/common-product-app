<template>
	<u-tree2 ref="lyTree"
		node-key="id"
		:tree-data="data" 
		:props="defaultProps" 
		:default-expanded-keys="defaultExpandedKeys"
		child-visible-for-filter-node 
		check-only-leaf 
		show-checkbox 
		@check="handleCheckChange">
	</u-tree2>
</template>


<script>
	var _self;
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
				},
				defaultExpandedKeys:[3]
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			handleCheckChange(obj) {
				let node = this.$refs.lyTree.getNode(obj.data);
				
				uni.showModal({
					content: '确认从树中移除节点吗？',
					success: res => {
						if (res.confirm) {
							this.$refs.lyTree.remove(obj.data);
						}
					}
				});
			}
		}
	};
</script>