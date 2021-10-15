<template>
	<view class="u-m-20">
		<u-form :error-type="['toast']" :model="form" ref="uForm" labelAlign="left" :labelWidth="labelWidth">
			<u-form-item :labelPosition="item.labelPosition==='top'?'top':'left'" :label="item.label" :prop="item.key" v-for="(item,index) in list" :key='index'>
				<f-form-item :form="form" :option="item"></f-form-item>
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script>
	import {formUtil,commonUtil} from '@/utils/fun.js'
	
	var self
	var formList = [{
		label:'input输入框',
		key:'name',
		type:'edit',
		type2:'number',
		right:true,
		content:'',
		rules:[
			{ 
				required: true, 
				message: '请输入姓名', 
				// 可以单个或者同时写两个触发验证方式 
				trigger: ['change','blur'],
			}
		]
	},{
		label:'纯文本',
		key:'desc',
		type:'text',
		type2:'text',
		content:'多多少少苏',
		right:true,
		rules:[
			{
				min: 5, 
				message: '简介不能少于5个字', 
				trigger: 'change'
			}
		]
	},{
		label:'button',
		key:'button',
		type:'button',
		right:true,
		placeholder:'多多少少苏',
		click:(form,option)=>{
			console.log('click',form,option)
			
		},
		rules:[
			{
				required: true, 
				message: '请选择xxx', 
			}
		]
	},{
		label:'select',
		key:'select',
		type:'select',
		right:true,
		arrayDisplayKey:'displayName',
		arrayValueKey:'id',
		array:[{id:0,displayName:'否',idcardNumber:'650105197208141348'},{id:1,displayName:'是',idcardNumber:'330122199906063332'}],
		placeholder:'请选择select',
		followUpKeys:[{'linkageKey':'linkage',dataKey:'idcardNumber'}],
		rules:[
			{
				required: true, 
				message: '请选择xxx', 
			}
		]
	},{
		label:'联动组件',
		key:'linkage',
		type:'text',
		type2:'text',
		content:'多多少少苏',
		right:true,
		rules:[
			{
				min: 5, 
				message: '简介不能少于5个字', 
				trigger: 'change'
			}
		]
	},{
		label:'textarea输入框',
		key:'content',
		type:'textarea',
		content:'',
		maxlength:200,
		labelPosition:'top',
		rules:[
			{
				min: 5, 
				message: '简介不能少于5个字', 
				trigger: 'change'
			}
		]
	}]
export default {
	data() {
		return {
			labelWidth:90,
			list:[],
			form:{},
			rules:{},
			ready:false,
			inited:false,
		};
	},
	methods:{
		submit(){
			this.$refs.uForm.validate(function(res){
				console.log(res,self.form)
			})
		},
		initForm(){
			let {formList:list,form,rules} = formUtil.initForm(formList)
			
			this.list = list
			this.form = form
			this.rules = rules
			
			this.labelWidth = formUtil.getMaxLabelWidth(list)
		},
		initRules(){
			if (!this.inited && this.$refs.uForm && commonUtil.isObjLegal(this.rules)){
				this.$refs.uForm.setRules(this.rules)
				this.inited = true
			}
		}
	},
	onReady() {
		this.ready = true
	},
	onLoad() {
		self = this
		this.initForm()
	},
	watch:{
		ready(){
			this.initRules()
		},
		rules(){
			this.initRules()
		}
	}
};
</script>

<style>

</style>
