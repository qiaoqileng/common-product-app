<template>
	<view ref="node" name="LyTreeNode" v-show="node.visible" class="ly-tree-node" :class="{
			'is-expanded': expanded,
			'is-hidden': !node.visible,
			'is-checked': !node.disabled && node.checked
		}" role="treeitem" @tap.stop="handleClick">
		<view class="ly-tree-node__content" :class="{
				'is-current': node.isCurrent && highlightCurrent
			}" :style="{
				'padding-left': (node.level - 1) * indent + 'px'
			}">
			<text v-if="!node.isLeaf" @tap.stop="handleExpandIconClick" :class="[
					{
						'is-leaf': node.isLeaf,
						expanded: !node.isLeaf && node.expanded
					},
					'ly-tree-node__expand-icon',
					iconClass ? iconClass : 'ly-iconfont ly-icon-caret-right'
				]">
			</text>

			<text v-if="node.loading" class="ly-tree-node__loading-icon ly-iconfont ly-icon-loading">
			</text>

			<view v-if="node.icon && node.icon.length > 0" class="ly-image">
				<image v-if="node.icon.indexOf('/') !== -1" class="ly-tree-node__icon" mode="aspectFill"
					:src="node.icon" @error="handleImageError">
				</image>
				<text v-else class="ly-tree-node__icon" :class="node.icon">
				</text>
			</view>

			<view :class="node.isLeaf ? 'ly-tree-node__label_pl' : 'ly-tree-node__label'" :style="[node.labelStyle]">
				{{node.label}}
			</view>

			<view v-show="node.data.attendance" class="u-flex">
				<view class="u-font-28" style="width: 130rpx;text-align:center;">{{node.data.attendanceCount}}</view>
				<view class="u-font-28" style="width: 130rpx;text-align:center;">{{node.data.sceneWorkers}}</view>
				<view class="u-font-28" style="width: 130rpx;text-align:center;">{{node.data.attendanceRate}}%</view>
			</view>

			<u-tree2-text v-if="node.textVisible" :text="rightText || node.rightText" :classObj="node.textStyle"
				:showLine="node.lineVisible" @click="handleTextClick(node)" />

			<u-tree2-checkbox v-if="(checkboxVisible || radioVisible) && !node.textVisible"
				:type="checkboxVisible ? 'checkbox' : 'radio'" :checked="node.checked"
				:indeterminate="node.indeterminate" :disabled="!!node.disabled"
				@check="handleCheckChange(!node.checked)" />

			<view v-if="node.richText">
				<u-parse :html="node.richText"></u-parse>
			</view>

		</view>

		<view v-if="!renderAfterExpand || childNodeRendered" v-show="expanded" class="ly-tree-node__children"
			role="group">
			<u-tree2-node v-for="cNodeId in node.childNodesId" :nodeId="cNodeId"
				:check-only-index="checkOnlyIndex" :check-index="checkIndex" :render-after-expand="renderAfterExpand" :show-checkbox="showCheckbox"
				:show-radio="showRadio" :check-only-leaf="checkOnlyLeaf" :key="getNodeKey(cNodeId)" :indent="indent" :icon-class="iconClass">
			</u-tree2-node>
		</view>

		<view v-if="node.canLoadMore && node.expanded" class="u-flex u-row-center" @tap.stop="handleMoreClick">
			<view style="color: 9A9A9A; padding-top: 8rpx;">
				{{showMoreText}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getNodeKey
	} from '../u-tree2/tool/util.js';

	export default {
		name: 'uTree2Node',

		componentName: 'uTree2Node',

		props: {
			nodeId: [Number, String],
			renderAfterExpand: {
				type: Boolean,
				default: true
			},
			checkOnlyLeaf: {
				type: Boolean,
				default: false
			},
			checkOnlyIndex: {
				type: Boolean,
				default: false
			},
			checkIndex: {
				type: Number,
				default: 1
			},
			showCheckbox: {
				type: Boolean,
				default: false
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			indent: Number,
			iconClass: String
		},

		data() {
			return {
				node: {
					indeterminate: false,
					checked: false,
					expanded: false
				},
				expanded: false,
				childNodeRendered: false,
				oldChecked: null,
				oldIndeterminate: null,
				highlightCurrent: false
			};
		},

		inject: ['tree'],

		computed: {
			showMoreText() {
				return this.tree.store.showMoreText
			},
			rightText() {
				return this.tree.store.rightText
			},
			textVisible() {
				return true
			},
			checkboxVisible() {
				if (this.checkOnlyLeaf) {
					return this.showCheckbox && this.node.isLeaf;
				}

				if(this.checkOnlyIndex) { // 固定某一级才有选择框
					return this.showCheckbox && (this.node.level === this.checkIndex);
				}

				return this.showCheckbox;
			},
			radioVisible() {
				if (this.checkOnlyLeaf) {
					return this.showRadio && this.node.isLeaf;
				}

				if(this.checkOnlyIndex) { // 固定某一级才有选择框
					return this.showRadio && (this.node.level === this.checkIndex);
				}

				return this.showRadio;
			}
		},

		watch: {
			'node.indeterminate'(val) {
				this.handleSelectChange(this.node.checked, val);
			},
			'node.checked'(val) {
				this.handleSelectChange(val, this.node.indeterminate);
			},
			'node.expanded'(val) {
				this.$nextTick(() => this.expanded = val);
				if (val) {
					this.childNodeRendered = true;
				}
			}
		},

		methods: {
			// todo 多级如何操作？ 这里的[0]如何改变
			getNode(nodeId) {
				let node = this.tree.store.root.getChildNodes([nodeId])[0];
				return node;
			},

			getNodeKey(nodeId) {
				let node = this.tree.store.root.getChildNodes([nodeId])[0];
				return getNodeKey(this.tree.nodeKey, node.data);
			},

			handleSelectChange(checked, indeterminate) {
				if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {


					if (this.checkOnlyLeaf && !this.node.isLeaf || this.checkOnlyIndex && this.node.level !== this.checkIndex) return;

					if (this.checkboxVisible) {
						const allNodes = this.tree.store._getAllNodes();
						this.tree.$emit('check-change', {
							checked,
							indeterminate,
							node: this.node,
							data: this.node.data,
							checkedall: allNodes.every(item => item.checked)
						});
					} else {
						this.tree.$emit('radio-change', {
							checked,
							node: this.node,
							data: this.node.data,
							checkedall: false
						});
					}
				}

				if (!this.expanded && this.tree.expandOnCheckNode && checked) {
					this.handleExpandIconClick();
				}

				this.oldChecked = checked;
				this.indeterminate = indeterminate;
			},

			handleMoreClick() {
				this.node.loadMoreData();
			},

			handleClick() {
				this.tree.store.setCurrentNode(this.node);
				this.tree.$emit('current-change', {
					node: this.node,
					data: this.tree.store.currentNode ? this.tree.store.currentNode.data : null,
					currentNode: this.tree.store.currentNode
				});
				this.tree.currentNode = this.node;

				if (this.tree.expandOnClickNode) {
					this.handleExpandIconClick();
				}

				if (this.tree.checkOnClickNode && !this.node.disabled) {
					(this.checkboxVisible || this.radioVisible) && this.handleCheckChange(!this.node.checked);
				}

				this.tree.$emit('node-click', this.node);
			},

			handleExpandIconClick() {
				if (this.node.isLeaf) {
					if (this.tree.store.leafNodeClick)
						this.tree.store.leafNodeClick(this.node)
					return;
				}

				if (this.expanded) {
					this.tree.$emit('node-collapse', this.node);
					this.node.collapse();
				} else {
					this.node.expand();
					this.tree.$emit('node-expand', this.node);

					if (this.tree.accordion) {
						uni.$emit(`${this.tree.elId}-tree-node-expand`, this.node);
					}
				}
			},

			handleTextClick(node) {
				this.tree.store.rightTextClick(node)
			},

			handleCheckChange(checked) {
				if (this.node.disabled) return;

				if (this.checkboxVisible) {
					this.node.setChecked(checked, !(this.tree.checkStrictly || this.checkOnlyLeaf || this.checkOnlyIndex));
				} else {
					this.node.setRadioChecked(checked);
				}

				this.$nextTick(() => {
					this.tree.$emit('check', {
						node: this.node,
						data: this.node.data,
						checkedNodes: this.tree.store.getCheckedNodes(),
						checkedKeys: this.tree.store.getCheckedKeys(),
						halfCheckedNodes: this.tree.store.getHalfCheckedNodes(),
						halfCheckedKeys: this.tree.store.getHalfCheckedKeys()
					});
				});
			},

			handleImageError() {
				this.node.icon = this.tree.defaultNodeIcon;
			}
		},

		created() {
			if (!this.tree) {
				throw new Error('Can not find node\'s tree.');
			}

			this.node = this.tree.store.nodesMap[this.nodeId];
			this.highlightCurrent = this.tree.highlightCurrent;

			if (this.node.expanded) {
				this.expanded = true;
				this.childNodeRendered = true;
			}

			const props = this.tree.props || {};
			const childrenKey = props['children'] || 'children';
			this.$watch(`node.data.${childrenKey}`, () => {
				this.node.updateChildren();
			});

			if (this.tree.accordion) {
				uni.$on(`${this.tree.elId}-tree-node-expand`, node => {
					if (this.node.id !== node.id && this.node.level === node.level) {
						this.node.collapse();
					}
				});
			}
		},

		beforeDestroy() {
			this.$parent = null;
		}
	};
</script>

<style>
	.ly-tree-node {
		/* white-space: nowrap; */
		outline: 0
	}

	.ly-tree-node__content {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 2rpx solid #fafafa;
	}

	.ly-tree-node__content.is-current {
		background-color: #F5F7FA;
	}

	.ly-tree-node__content>.ly-tree-node__expand-icon {
		padding: 12rpx;
	}

	.ly-tree-node__checkbox {
		display: flex;
		margin-right: 16rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.ly-tree-node__checkbox>image {
		width: 40rpx;
		height: 40rpx;
	}

	.ly-tree-node__expand-icon {
		color: #C0C4CC;
		font-size: 28rpx;
		-webkit-transform: rotate(0);
		transform: rotate(0);
		-webkit-transition: -webkit-transform .3s ease-in-out;
		transition: -webkit-transform .3s ease-in-out;
		transition: transform .3s ease-in-out;
		transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out
	}

	.ly-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg)
	}

	.ly-tree-node__expand-icon.is-leaf {
		color: transparent;
	}

	.ly-tree-node__icon {
		width: 70rpx;
		height: 70rpx;
		overflow: hidden;
		margin-right: 16rpx;
	}

	.ly-image {
		text-align: center;
		display: flex;
		justify-content: center;
		align-content: center;
	}

	.ly-tree-node__label {
		flex: 1;
		font-size: 28rpx;
		line-height: 28rpx;
		/* 		overflow:hidden;
		word-wrap:break-word;
		word-break:break-all; */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.ly-tree-node__label_pl {
		flex: 1;
		font-size: 28rpx;
		line-height: 28rpx;
		padding-left: 10rpx;
		/* 		overflow:hidden;
		word-wrap:break-word;
		word-break:break-all; */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.ly-checkbox {
		text-align: right;
	}

	.ly-tree-node__loading-icon {
		margin-right: 16rpx;
		font-size: 28rpx;
		color: #C0C4CC;
		-webkit-animation: rotating 2s linear infinite;
		animation: rotating 2s linear infinite
	}

	.ly-tree-node>.ly-tree-node__children {
		overflow: hidden;
		background-color: transparent
	}

	.ly-tree-node>.ly-tree-node__children.collapse-transition {
		transition: height .3s ease-in-out;
	}

	.ly-tree-node.is-expanded>.ly-tree-node__children {
		display: block
	}

	.ly-tree-node_collapse {
		overflow: hidden;
		padding-top: 0;
		padding-bottom: 0;
	}

	/* lyTree-end */

	/* iconfont-start */
	@font-face {
		font-family: "ly-iconfont";
		src: url('https://at.alicdn.com/t/font_2364807_3ouaf7x2jvq.woff2?t=1622448966130') format('woff2'),
       url('https://at.alicdn.com/t/font_2364807_3ouaf7x2jvq.woff?t=1622448966130') format('woff'),
       url('https://at.alicdn.com/t/font_2364807_3ouaf7x2jvq.ttf?t=1622448966130') format('truetype');
	}

	.ly-iconfont {
		font-family: "ly-iconfont" !important;
		font-size: 30rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.ly-icon-caret-right:before {
		content: "\e68a";
	}

	.ly-icon-loading:before {
		content: "\e626";
	}

	/* iconfont-end */

	/* animate-start */
	@keyframes rotating {
		0% {
			-webkit-transform: rotateZ(0);
			transform: rotateZ(0)
		}

		100% {
			-webkit-transform: rotateZ(360deg);
			transform: rotateZ(360deg)
		}
	}

	/* animate-end */
</style>
