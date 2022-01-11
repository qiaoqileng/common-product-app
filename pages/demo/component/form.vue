<template>
	<view class="u-m-20">
		<u-form :error-type="['toast']" :model="form" ref="uForm" labelAlign="left" :labelWidth="labelWidth">
			<u-form-item 
			v-show="!item.hidden" 
			:labelPosition="item.labelPosition==='top'?'top':'left'" 
			:label="item.label" 
			:prop="item.key" 
			v-for="(item,index) in list" :key='index'>
				<f-form-item :form="form" :option="item" :originArray="list"></f-form-item>
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
		followUpKeys:[{'linkageKey':'linkage',dataKey:'idcardNumber'},{'linkageHiddenKey':'linkageHidden',judgeFun(select){
			return select && select['id'] === 1
		}}],
		rules:[
			{
				required: true, 
				message: '请选择xxx', 
			}
		]
	},{
		label:'mutilSelect',
		key:'mutilSelect',
		type:'mutil-select',
		right:true,
		arrayDisplayKey:'displayName',
		arrayValueKey:'id',
		separation:'-',
		array:[{id:0,displayName:'否',idcardNumber:'650105197208141348'},{id:1,displayName:'是',idcardNumber:'330122199906063332'}],
		placeholder:'请选择select',
		followUpKeys:[{'linkageKey':'linkage',dataKey:'idcardNumber'},{'linkageHiddenKey':'linkageHidden',judgeFun(select){
			return select && select.find(item=>item.id===1)
		}},{'linkageKey':'select',linkageText(result){
			return result[0]
		}}],
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
		label:'联动隐藏组件',
		key:'linkageHidden',
		type:'text',
		type2:'text',
		hidden:false,
		content:'多多少少苏',
		right:true,
	},{
		label:'附件组件',
		key:'attach',
		type:'attach',
		labelPosition:'top',
		autoUpload:false,
		maxCount:5
	},{
		label:'附件详情组件',
		key:'attach',
		type:'attach',
		labelPosition:'top',
		mode:'detail',
		autoUpload:false,
		maxCount:5,
		fileList:[{fileId: "226370281432678401",
fileMd5: "f0475207ffd36769633cc424e383c325",
fileMime: "png",
fileName: "remote_supervise.png",
fileSize: "10.00KB",
fileUrl: "/api/core/file/226370281432678401/f0475207ffd36769633cc424e383c325/downLoad"}]
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
				//隐藏组件后，self.form内参数未改变,如需忽略,请遍历出hidden为true的key,再来过滤,如
				let keys = this.list.filter(item=>item.hidden).map(item=>item.key)
				if (commonUtil.isListLegal(keys)){
					self.form
				}
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
