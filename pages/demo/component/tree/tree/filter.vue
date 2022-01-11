<template>
	<view>
		<view class="ly-search">
			<input v-model="filterText" placeholder="输入关键字进行过滤" />
		</view>
		<u-tree2 ref="tree"
			node-key="id" 
			:tree-data="data" 
			:props="defaultProps" 
			:filter-node-method="filterNode"
			child-visible-for-filter-node 
			default-expand-all />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				filterText: '',
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
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},

		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
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
