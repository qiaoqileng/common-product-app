<template>
	<view>
		<view class="ly-search">
			<input v-model="filterText" :placeholder="placeholder" />
		</view>
		<u-tree2 :tree-data="data" 
			node-key="nid" 
			show-radio 
			default-expand-all 
			:props="defaultProps" 
			:filter-node-method="filterNode" 
			@check="handleCheck"
			ref="tree">
		</u-tree2>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholder: '过滤所有节点',
				filterNodeData: null,
				filterText: '',
				data: [{
					nid: 1,
					label: '一级 1',
					children: [{
						nid: 4,
						label: '二级 1-1',
						children: [{
							nid: 9,
							label: '三级 1-1-1'
						}, {
							nid: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					nid: 2,
					label: '一级 2',
					children: [{
						nid: 5,
						label: '二级 2-1',
						children: [{
							nid: 11,
							label: '三级 2-1-1'
						}, {
							nid: 12,
							label: '三级 2-1-2'
						}]
					}, {
						nid: 6,
						label: '二级 2-2',
						children: [{
							nid: 13,
							label: '三级 2-2-1'
						}, {
							nid: 14,
							label: '三级 2-2-2'
						}]
					}]
				}, {
					nid: 3,
					label: '一级 3',
					children: [{
						nid: 7,
						label: '二级 3-1',
						children: [{
							nid: 15,
							label: '三级 3-1-1'
						}, {
							nid: 16,
							label: '三级 3-1-2'
						}]
					}, {
						nid: 8,
						label: '二级 3-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val, this.filterNodeData);
			}
		},

		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			
			handleCheck(obj) {
				if (obj.node.checked) {
					this.placeholder = `过滤"${obj.data.label}"的子节点`;
					this.filterNodeData = obj.data;
				} else {
					this.placeholder = `过滤所有节点`;
					this.filterNodeData = null;
				}
				
				// filter(val, nodeData),假如要搜索A节点下面的数据，那么nodeData代表treeData中A节点的数据
				this.$refs.tree.filter(this.filterText, this.filterNodeData);
			}
		}
	};
</script>

<style>
	.ly-search {
		margin: 0 30rpx;
		margin-top: 40rpx;
		padding-bottom: 15rpx;
		border-bottom: 1px solid #ededed;
	}
</style>
