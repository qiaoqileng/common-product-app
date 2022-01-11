<template>
	<view class="ly-list">
		<navigator 
			open-type="navigate" 
			v-for="(item, index) in list" 
			class="item" 
			:url="item.url" 
			:key="index"
		>
			{{item.name}}
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '基本用法',
						url: '/pages/demo/component/tree/tree/base'
					},
					{
						name: '数据更新',
						url: '/pages/demo/component/tree/tree/updateTree'
					},
					{
						name: '自定义节点属性名称',
						url: '/pages/demo/component/tree/tree/propsConfig'
					},
					{
						name: '可选择',
						url: '/pages/demo/component/tree/tree/selectable'
					},
					{
						name: '仅叶子节点可选择',
						url: '/pages/demo/component/tree/tree/checkOnlyLeaf'
					},
					{
						name: '懒加载自定义叶子节点',
						url: '/pages/demo/component/tree/tree/lazy'
					},
					{
						name: '默认展开和默认选中',
						url: '/pages/demo/component/tree/tree/expandAndSelect'
					},
					{
						name: '树节点单选',
						url: '/pages/demo/component/tree/tree/radio'
					},
					{
						name: '禁用状态',
						url: '/pages/demo/component/tree/tree/disabled'
					},
					{
						name: '树节点的选择',
						url: '/pages/demo/component/tree/tree/nodeSelect'
					},
					{
						name: '节点过滤',
						url: '/pages/demo/component/tree/tree/filter'
					},
					{
						name: '过滤指定节点',
						url: '/pages/demo/component/tree/tree/filterNode'
					},
					{
						name: '手风琴模式',
						url: '/pages/demo/component/tree/tree/accordion'
					},
					{
						name: '节点图标',
						url: '/pages/demo/component/tree/tree/icon'
					},
					{
						name: '抽屉或弹框中使用树组件',
						url: '/pages/demo/component/tree/tree/treeModal'
					},
					{
						name: '自主控制loading状态',
						url: '/pages/demo/component/tree/tree/controlLoading'
					},
					{
						name: '开关控制全部展开/折叠',
						url: '/pages/demo/component/tree/tree/controlExpand'
					},
					{
						name: '全部选中/取消选中',
						url: '/pages/demo/component/tree/tree/checkAll'
					},
					{
						name: '点选择框删除',
						url: '/pages/demo/component/tree/tree/deltable'
					},
					{
						name: '设置当前节点',
						url: '/pages/demo/component/tree/tree/setCurrent'
					}
				]
			}
		}
	}
</script>

<style>
	.ly-list {
		padding: 0 30rpx 30rpx 30rpx;
		background: #fff;
	}
	
	.ly-list .item {
		border-bottom: 1px solid #ededed;
		padding: 15rpx 0;
	}
</style>

