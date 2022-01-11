<template>
	<view class="u-flex select-enhance">
		<view class="u-flex box" @click="showPopup">
			<view class="u-flex user-list u-row-right">
				<text class="text u-font-sm" v-if="!value.length">{{ '请选择' }}</text>
				<template v-else>
					<view v-for="item in value" :key="item.id" class="user-item">
						<u-tag class="u-tag" :text="item.name" :closeable="true" @close="closeTag(item)"/>
					</view>
				</template>
				<view class="u-m-l-20">
					<u-icon name="arrow-down-fill" size="26" color="#c0c4cc"></u-icon>
				</view>
			</view>
		</view>

		<u-popup v-model="popupShow" :safe-area-inset-bottom="true" border-radius="0" mode="bottom" :closeable="true"
						 length="70%" :z-index="10086">
			<view class="u-flex-col content">
				<view class="title">{{ placeholder }}</view>
				<view class="u-m-t-20">
					<u-search placeholder="请输入" @search="onSearch"></u-search>
				</view>
				<view v-for="cooperator in tempList">
					<view v-for="group in cooperator.children">
						<view v-for="member in group.children">
							{{member.name}}
						</view>
					</view>
				</view>
				<u-tree2 ref="tree" node-key="id" :tree-data="tempList"
								 :checkOnlyIndex="true" :checkIndex="3" :showCheckbox="true" :defaultExpandAll="true"
								 :props="{children: 'children', label: 'name'}" @check="handleCheckChange">
				</u-tree2>
				<view class="u-flex footer">
					<view class="u-button">
						<u-button @click="popupShow = false">取消</u-button>
					</view>
					<view class="u-button">
						<u-button type="primary" @click="onConfirm">确认</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
/*
 * list格式为 【{id: '', name: '}】
 */
import Vue from "vue";

export default {
	mixins: [Vue.prototype.$u.emitter],
	data() {
		return {
			value: [],
			list: [{
				id: 0,
				name: '一级 1',
				children: [{
					id: 1,
					name: '二级 1-1',
					children: [{
						id: 2,
						name: '三级 1-1-1'
					}]
				}]
			}, {
				id: 3,
				name: '一级 2',
				children: [{
					id: 4,
					name: '二级 2-1',
					children: [{
						id: 5,
						name: '三级 2-1-1'
					}]
				}, {
					id: 6,
					name: '二级 2-2',
					children: [{
						id: 7,
						name: '三级 2-2-1'
					}]
				}]
			}, {
				id: 8,
				name: '一级 3',
				children: [{
					id: 9,
					name: '二级 3-1',
					children: [{
						id: 10,
						name: '三级 3-1-1'
					}]
				}, {
					id: 11,
					name: '二级 3-2',
					children: [{
						id: 12,
						name: '三级 3-2-1'
					}]
				}]
			}],
			tempList: [],
			popupShow: false, // 弹窗
		}
	},
	methods: {
		showPopup() {
			this.popupShow = true
		},
		onSearch(searchKey) {
			if (!searchKey) {
				this.list.forEach((item, index) => {
					this.$set(this.tempList, index, item)
				})
			} else {
				const tempList = []
				if(this.list) {
					this.list.forEach(cooperator => {
						const tempCooperator = {
							name: JSON.parse(JSON.stringify(cooperator.name)),
							id: JSON.parse(JSON.stringify(cooperator.id))
						}
						const groupList = []
						if (cooperator.children) {
							cooperator.children.forEach(group => {
								const tempGroup = {
									name: JSON.parse(JSON.stringify(group.name)),
									id: JSON.parse(JSON.stringify(group.id))
								}
								const memberList = []
								if(group.children) {
									group.children.forEach(member => {
										memberList.push({
											name: JSON.parse(JSON.stringify(member.name)),
											id: JSON.parse(JSON.stringify(member.id))
										})
									})
								}
								tempGroup.children = memberList
								groupList.push(tempGroup)
							})
						}
						tempCooperator.children = groupList
						tempList.push(tempCooperator)
					})
				}
				this.tempList = tempList.filter(cooperator => {
					return this.containKey(cooperator, searchKey)
				})
			}
			console.log("tempList", this.tempList)
		},
		containKey(cooperator, searchKey) {
			let exitCooperator = false
			if (cooperator.children) {
				cooperator.children = cooperator.children.filter(group => {
					let exitGroup = false
					if(group.children) {
						group.children = group.children.filter(member => {
							if(member.name.indexOf(searchKey) !== -1) {
								exitCooperator = true
								exitGroup = true
								return true
							}
							return false
						})
						console.log("group.children", group.children)
					}
					return exitGroup
				})
				console.log("cooperator.children", cooperator.children)
			}
			return exitCooperator
		},
		handleCheckChange() {
			console.log("选项改变")
		},
		closeTag(data) {
			const temp = []
			this.value.forEach(item => {
				temp.push(item)
			})
			temp.forEach((item, index) => {
				if (item.id === data.id) {
					temp.splice(index, 1)
				}
			})
			this.$refs.tree.setCheckedNodes(temp)
			this.$emit('input', temp);
		},
		onConfirm() {
			this.value = this.$refs.tree.getCheckedNodes()
			this.$emit('input', this.value);
			this.popupShow = false;
		},
	},
	onLoad() {
		this.onSearch('')
	},
	watch: {
		popupShow: {
			handler() {
				if (this.popupShow) {
					this.$nextTick(() => {
						this.$refs.tree.setCheckedNodes(this.value)
					});
				}
			},
			immediate: true
		}
	}
};
</script>

<style lang="scss" scoped>
.select-enhance {
	width: 100%;

	.box {
		width: 100%;
	}

	.u-tag {
		margin-right: 10 rpx;
	}

	.user-list {
		width: 0;
		flex: auto;
		flex-wrap: wrap;

		.user-item {
			margin-left: 10 rpx;
		}
	}

	.text {
		color: #c0c4cc;
	}

	.content {
		height: 100%;
		padding: 25 rpx;

		.title {
			line-height: 1;
			margin-top: 15px;
		}

		.u-search {
			margin-top: 20 rpx;
		}

		.scrollView {
			height: 0;
			flex: auto;
			padding: $padding 0;

			scroll-view {
				height: 100%;
			}
		}

		/deep/ .u-checkbox,
		/deep/ .u-radio {
			padding: 10 rpx 0;
			border-bottom: 2 rpx solid fade-out(rgba(147, 148, 153, 1), 0.8);

			.label {
				width: 650 rpx;
				padding: 8 rpx 0;
			}
		}

		.footer {
			justify-content: space-between;

			.u-button {
				width: calc(50% - 10rpx);
			}
		}
	}
}
</style>
