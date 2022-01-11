<template>
    <c-page :isComponent="true">
		<f-button :form="form" :option="option" :click="click"/>
		<pms-list-selector-pop v-model="show" :idName="option.arrayValueKey" :labelName="option.arrayDisplayKey" :list="list" @confirm="handleOK"/>
    </c-page>
</template>

<script>
	import {commonUtil} from '@/utils/fun.js'
	export default {
		name:"c-mutil-select",
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
				show:false,
				list: []
			};
		},
		mounted() {
			this.parent = this.$u.$parent.call(this, 'f-form-item');
		},
		methods: {
			click(form,option){
				const {array,fetchApi,fetchParams} = option
				if (commonUtil.isListLegal(array)){
					this.list = array
					this.show = true
				} else if (fetchApi){//TODO 之后可以做动态获取字典项的
					fetchApi(fetchParams).then(res=>{
						const {code,data} = res || {}
						if (code === 200){
						  this.option.array = data || []
						  this.list = this.option.array
						  this.show = true
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
			handleOK(result) {
				console.log(result)
				const displayKey = this.option.arrayDisplayKey || 'name'
				const valueKey = this.option.arrayValueKey || 'id'
				
				this.form[this.option.key] = result.map(item=>item[valueKey]).join(this.option.separation?this.option.separation:',')
				this.option.content = result.map(item=>item[displayKey]).join(',')
				
				if (commonUtil.isListLegal(this.option.followUpKeys)){
					this.option.followUpKeys.forEach(item=>{
						if (item.linkageKey){//自动填充的逻辑
							if (item.linkageText){
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
						if (item.linkageHiddenKey && this.parent && this.parent.originArray){//自动显隐的逻辑
							let find = this.parent.originArray.find(p=>p.key === item.linkageHiddenKey)
							if (find){
								find.hidden = item.judgeFun && item.judgeFun(result)
							}
						}
					})
				}
			}
		}
	}
</script>

<style>

</style>
