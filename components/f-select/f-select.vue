<template>
	<view>
		<f-button :form="form" :option="option" :click="click"/>
		<u-picker mode="selector" v-model="showSelector" :range="selectorRange" :rangeKey="option.arrayDisplayKey || 'name'" @confirm="confirmSelector"></u-picker>
	</view>
</template>

<script>
	import {commonUtil} from '@/utils/fun.js'
	export default {
		name:"f-select",
		props:{
			option:{
				type:Object,
				default(){
					return {}
				}
			},
			form:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				showSelector:false,
				selectorRange:[],
			};
		},
		methods:{
			 click(form,option){
				const {array,domain} = option
				if (commonUtil.isListLegal(array)){
					this.selectorRange = array
					this.showSelector = true
				} else if (domain){//TODO 之后可以做动态获取字典项的
					
				} else {
					console.error('select array is none')
				}
			},
			confirmSelector(e){
				const displayKey = this.option.arrayDisplayKey || 'name'
				const valueKey = this.option.arrayValueKey || 'id'
				
				const selected = this.selectorRange[e[0]]
				this.form[this.option.key] = selected[valueKey]
				this.option.content = selected[displayKey]
				
				if (commonUtil.isListLegal(this.option.followUpKeys)){
					this.option.followUpKeys.forEach(item=>{
						this.form[item.linkageKey] = commonUtil.getValue(selected,item.dataKey)
					})
				}
			},
		}
	}
</script>

<style>

</style>
