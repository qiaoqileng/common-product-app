<!--
	@author: hruomei
	@description: 这里仅仅只是提供一个简单的示例演示如何在抽屉/弹框中使用树组件，请注意弹框的显隐用v-show，不要用v-if
	@create-time: 2020/02/23
	@last-update-time: 2020/03/23
	@version: V1.12
-->
<template>
	<view>
		<view class="ly-padding">
			<button @tap="handleShowTree">点击展开树</button>
			<view class="content" v-if="selectedData && selectedData.label">
				选中了： {{selectedData.label}}
			</view>
		</view>
		<ly-tree-drawer 
			:show="showTree" 
			@close="handleClose" 
			@confirm="handleConfirm"
		/>
	</view>
</template>

<script>
	import LyTreeDrawer from '../component/ly-tree-drawer.vue'
	
	export default {
		components: {
			LyTreeDrawer
		},
		
		data() {
			return {
				showTree: false,
				selectedData: void 0
			}
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			handleShowTree() {
				this.showTree = !this.showTree;
			},
			
			handleClose() {
				this.showTree = false;
			},
			
			handleConfirm(data) {
				this.selectedData = data;
				this.showTree = false;
			}
		}
	}
</script>

<style>
	.content{
		margin-top: 30rpx;
	}
</style>
