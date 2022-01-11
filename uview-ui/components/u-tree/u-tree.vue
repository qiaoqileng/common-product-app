<template>
	<view class="content">
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeList" :key="item[idName]">
				<view class="mix-tree-item" :style="[{
							paddingLeft: item.rank*15 + 'px',
							zIndex: item.rank*-1 +50
						}]" :class="{
							border: treeParams.border === true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild
						}" @click.stop="treeItemTap(item, index)">
					<u-icon size="30" color="#999" customPrefix="pm-iconfont" class="mix-tree-icon"
						:name="item.lastRank ? treeParams.lastIcon : ((item.showChild || item[childName]) ? treeParams.currentIcon : treeParams.defaultIcon)">
					</u-icon>
					<view v-if="!customView">{{item[valueName]}}</view>
					<view v-if="customView" style="width: 100%;">
						<slot name="view" :data="item"></slot>
					</view>
					<u-icon v-show="false" size="30" customPrefix="pm-iconfont" :name="item.checked ? checked : unchecked" @click="select(item)"></u-icon>
				</view>
				<u-line color="#f5f5f5" v-if="item.show"></u-line>
			</block>
		</view>
	</view>
</template>

<script>
	/**
	 * tree 树形结构
	 * @description 树形可折叠插件。
	 * @property {Array} list 数据源
	 * @property {String} idName  v-for的key默认'id'
	 * @property {String} valueName  默认'name'
	 * @property {Array} childName 子项默认'children'
	 * @property {Boolen} customView 是否自定义view
	 * @property {Boolen} rightSelect 右侧是否可点击
	 */
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			params: {
				type: Object,
				default () {
					return {}
				}
			},
			idName: {
				type: String,
				default: 'id'
			},
			valueName: {
				type: String,
				default: 'name'
			},
			childName: {
				type: String,
				default: 'children'
			},
			customView: {
				type: Boolean,
				default: false
			},
			rightSelect: {
				type: Boolean,
				default: false
			},
			intercept: {
				type: Boolean,
				default: false
			},
			alwaysShowArrow: {
				type: Boolean,
				default: false
			},
			fistLevelArrow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				tempList: [],
				treeList: [],
				skipWatch: false,
				parent: {},
				checked: 'search',
				unchecked: 'filter',
				selectId: [],
				treeParams: {
					defaultIcon: 'play-right-fill',
					currentIcon: 'arrow-down-fill',
					lastIcon: ' ',
					border: false
				}
			}
		},
		watch: {
			'list': {
				handler: function(listNval, listOval) {
					this.treeParams = Object.assign(this.treeParams, this.params);
					this.tempList = this.treeList //保留上次的数据
					this.treeList = []
					this.renderTreeList(listNval);
					this.copyData(this.parent)
				},
				deep: true,
				// immediate: true,
			}
		},
		methods: {
			//扁平化树结构
			renderTreeList(list = [], rank = 0, parentId = [], parentData = {}) {
				list.forEach(item => {
					let data = {
						parentId, 			// 父级id数组
						rank, 				// 层级
						parentData, 		//父级数据
						showChild: false, 	//子级是否显示
						show: rank === 0, 	// 自身是否显示
						origindata: item,
						checked: false
					}
					data[this.idName] = item[this.idName];
					data[this.valueName] = item[this.valueName];
					this.treeList.push(data)
					if (Array.isArray(item[this.childName]) && item[this.childName].length > 0) {
						let parents = [...parentId];
						parents.push(item[this.idName]);
						this.renderTreeList(item[this.childName], rank + 1, parents, item);
					} else {
						if (!this.alwaysShowArrow) {
							if (!(this.fistLevelArrow && this.treeList[this.treeList.length - 1].rank === 0)) {
								this.treeList[this.treeList.length - 1].lastRank = true;
							}
						}
					}
				})
			},
			reset(list, parent) {
				this.skipWatch = true
				this.tempList = this.treeList
				this.treeList = []
				this.renderTreeList(list);
				this.copyData(parent)
			},
			loadData(parentData) { //数据更新的item
				this.parent = parentData
			},
			copyData(parent) { //将数据更新前的状态赋给当前
				this.tempList.map(item => {
					for (var i = 0; i < this.treeList.length; i++) {
						let itemData = this.treeList[i];
						if (itemData.id === item.id) {
							itemData.showChild = item.showChild
							itemData.show = item.show
							if (itemData.id === parent.id) {
								itemData.showChild = true
							}
						} else if (itemData.parentId.includes(parent.id)) {
							if (itemData.parentId[itemData.parentId.length - 1] === parent.id) {
								itemData.show = true;
							}
						}
					}
				})
				this.tempList = []
				this.parent = {}
			},
			// 点击
			treeItemTap(item) {
				if (this.intercept) return
				this.handleclick(item)
			},
			handleclick(item) {
				if (item.lastRank === true) {
					//点击最后一级时触发事件
					this.$emit('treeItemClick', item);
					return;
				}
				let list = this.treeList;
				let id = item[this.idName];
				item.showChild = !item.showChild;
				list.forEach(childItem => {
					if (childItem.id === id) {
						childItem.showChild = item.showChild
					}
					if (item.showChild === false) {
						//隐藏所有子级
						if (!childItem.parentId.includes(id)) {
							return;
						}
						if (childItem.lastRank !== true) {
							childItem.showChild = false;
						}
						childItem.show = false;
					} else {
						if (childItem.parentId[childItem.parentId.length - 1] === id) {
							childItem.show = true;
						}
					}
				})
			},
			select(item) {
				console.log(item)
				if (item.checked) {
					item.checked = false
					const _this = this
					this.selectId = this.selectId.filter(function(id) {  //移除当前项
						if (id !== item[_this.idName]) {
							return id;
						}
					})
					let origin = item.origindata
					this.removeChildId(origin[this.childName])
					this.removeParentId(item.parentData)
				} else {
					item.checked = true
					this.selectId.push(item[this.idName])  //选中当前项
					let origin = item.origindata
					this.addChildId(origin[this.childName])
					this.addParentId(item)
				}
				this.treeList.forEach(tree => {
					if (this.selectId.includes(tree.id)) {
						tree.checked = true
					} else {
						tree.checked = false
					}
				})
			},
			//选中所有父级
			addParentId(item){
				if (item.parentId.length > 0) {
					item.parentId.forEach(id => {
						if (this.selectId.includes(id)) {
							return
						}
						this.selectId.push(id)
					})
				}
			},
			//选中所有子项
			addChildId(childrens) {
				if (childrens && childrens.length > 0) {
					childrens.forEach(child => {
						if (this.selectId.includes(child[this.idName])) {
							return
						}
						this.selectId.push(child[this.idName])
						this.addChildId(child[this.childName])
					})
				}
			},
			//移除所有子项
			removeChildId(childrens) {
				if (childrens && childrens.length > 0) {
					const _this = this
					childrens.forEach(child => {
						if (this.selectId.includes(child[this.idName])) {
							this.selectId = this.selectId.filter(function(id) {
								if (id !== child[_this.idName]) {
									return id;
								}
							})
						}
						this.removeChildId(child[this.childName])
					})
				}
			},
			//移除所有父级
			removeParentId(parents) {
				if (parents) {
					let children = parents[this.childName]
					if (children && children.length > 0) {
						const _this = this
						let count = 0
						try {
							children.forEach(child => {
								if (_this.selectId.includes(child[_this.idName])) {
									throw new Error("EndIterative")
								}
								count++
							})
						} catch (e) {}
						if (count === children.length) { //说明该节点下的所有子项都已被移除，那么移除该节点
							this.selectId = this.selectId.filter(function(id) {
								if (id !== parents[_this.idName]) {
									return id;
								}
							})
							this.removeParentId(parents.parentData)
						}
					}
				}
			}
		}
	}
</script>

<style>
	.mix-tree-list {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
	}

	.mix-tree-item {
		display: flex;
		align-items: center;
		font-size: 30upx;
		color: #333;
		height: 0;
		opacity: 0;
		transition: .2s;
		position: relative;
	}

	.mix-tree-item.border {
		border-bottom: 1px solid #eee;
	}

	.mix-tree-item.show {
		height: 80upx;
		opacity: 1;
	}

	.mix-tree-icon {
		margin-right: 8upx;
		opacity: .9;
	}

	.mix-tree-item.showchild:before {
		transform: rotate(90deg);
	}

	.mix-tree-item.last:before {
		opacity: 0;
	}
</style>
