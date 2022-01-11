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
				parent:{}
			};
		},
		methods:{
			 click(form,option){
				const {array,fetchApi,fetchParams} = option
				if (commonUtil.isListLegal(array)){
					this.selectorRange = array
					this.showSelector = true
				} else if (fetchApi){//TODO 之后可以做动态获取字典项的
					fetchApi(fetchParams).then(res=>{
						const {code,data} = res || {}
						if (code === 200){
						  this.option.array = data || []
						  this.selectorRange = this.option.array
						  this.showSelector = true
						} else {
						  commonUtil.toastErr(res)
						}
					  }).catch(res=>{
						  commonUtil.toastErr(res)
					  })
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
						if (item.linkageKey){
							this.form[item.linkageKey] = commonUtil.getValue(selected,item.dataKey)
						}
						if (item.linkageKey){//自动填充的逻辑
							if (item.dataKey){
								this.form[item.linkageKey] = commonUtil.getValue(selected,item.dataKey)
							} else if (item.linkageText){
							 let linkage = item.linkageText(result)
							 let linkageValue = linkage
							 if (typeof linkage === 'object' && this.parent.originArray){
								 let find = this.parent.originArray.find(p=>p.key === item.linkageKey)
								if (find){
									let linkageDisplay = linkage[find.arrayDisplayKey || 'name'] 
									linkageValue = linkage[find.arrayValueKey || 'id']
									find.content = linkageDisplay
								}
								
							 }
							 this.form[item.linkageKey] = linkageValue
							}
						}
						if (item.linkageHiddenKey && this.parent && this.parent.originArray){
							let find = this.parent.originArray.find(p=>p.key === item.linkageHiddenKey)
							if (find){
								find.hidden = item.judgeFun && item.judgeFun(selected)
							}
						}
					})
				}
			},
		},
		mounted() {
			this.parent = this.$u.$parent.call(this, 'f-form-item');
			console.log(this.parent)
		}
	}
</script>

<style>

</style>
