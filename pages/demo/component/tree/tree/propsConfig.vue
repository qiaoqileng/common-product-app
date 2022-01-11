<template>
	<u-tree2
		:tree-data="treeData" 
		:props="props" 
		show-checkbox 
		node-key="personId" 
		@node-click="handleNodeClick"
	/>
</template>

<script>
	export default {
		data() {
			return {
				ready: false,
				// 如果想自定义函数渲染节点名称等，需要将props设置成返回配置对象的函数，否则如果props是一个对象（uni会将对象中的函数过滤掉），对象中的函数属性会被过滤掉
				props: function() {
					return {
						// 这里的label就可以使用函数进行自定义的渲染了
						label(data, node) {
							return '节点' + node.data.personName;
						},
						// label: 'personName', // 指把数据中的‘personName’当做label也就是节点名称
						children: 'childs' // 指把数据中的‘childs’当做children当做子节点数据
					}
				},
				// 如果只是单纯的从数据中取某一个字段作为对应属性，props可以直接设置为对象
				// props: {
				// 	label: 'personName', // 指把数据中的‘personName’当做label也就是节点名称
				// 	children: 'childs',// 指把数据中的‘childs’当做children当做子节点数据
				// 	checked: 'checked'
				// },
				treeData: [{
					personId: 1,
					personName: '一级 1',
					checked: false,
					childs: [{
						personId: 11,
						personName: '二级 1-1',
						checked: false,
						childs: [{
							personId: 111,
							personName: '三级 1-1-1',
							checked: false
						}]
					}]
				}, {
					personId: 2,
					personName: '一级 2',
					checked: false,
					childs: [{
						personId: 21,
						personName: '二级 2-1',
						checked: true,
						childs: [{
							personId: 211,
							personName: '三级 2-1-1',
							checked: true,
						}]
					}, {
						personId: 22,
						personName: '二级 2-2',
						checked: false,
						childs: [{
							personId: 221,
							personName: '三级 2-2-1',
							checked: false,
						}]
					}]
				}, {
					personId: 3,
					personName: '一级 3',
					checked: false,
					childs: [{
						personId: 31,
						personName: '二级 3-1',
						checked: false,
						childs: [{
							personId: 311,
							personName: '三级 3-1-1',
							checked: false,
						}]
					}, {
						personId: 32,
						personName: '二级 3-2',
						checked: false,
						childs: [{
							personId: 321,
							personName: '三级 3-2-1',
							checked: false,
						}]
					}]
				}]
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			// uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
			}
		}
	};
</script>