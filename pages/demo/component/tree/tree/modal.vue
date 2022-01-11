<template>
	<view class="ly-padding">
		<button class="ly-button" @tap="open">点击展开树抽屉</button>
		<ly-tree-drawer :visible="visible" @close="close"></ly-tree-drawer>
	</view>
</template>

<script>
	import LyTreeDrawer from './treeModal.vue'
	export default {
		components: {
			LyTreeDrawer
		},
		data() {
			return {
				visible : false
			}
		},
		onLoad() {
			
		},
		methods: {
			open() {
				this.visible = !this.visible;
			},
			close() {
				this.visible = false;
			}
		}
	}
</script>
