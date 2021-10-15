export const formUtil = {
	/**
	 * 获取表单label最长宽度
	 * @param {Array} formItems 表单items  
	 * @param {String} key 表单label的key,默认为label字符串  
	 * @param {Number} defaultWidth 表单label默认宽度,默认90rpx
	 * @param {Number} singleWidth 表单label单字节宽度,单位rpx
	 * @param {Number} maxWidth 表单label单字节宽度,单位rpx
	 */
	getMaxLabelWidth(formItems=[],key='label',defaultWidth=90,singleWidth=15,maxWidth=200){
		if (commonUtil.isListLegal(formItems)){
			let labels = formItems.map(item=>this.getChartLength(item[key]))
			let maxLabel = Math.max(...labels)
			let wordWidth = maxLabel * singleWidth
			return wordWidth > maxWidth ? maxWidth : wordWidth
		} else {
			return defaultWidth
		}
	},
	getChartLength(str){
		return str?str.replace(/[^\x00-\xff]/g, "00").length:0
	},
	/**
	 * 初始化表单列表
	 */
	initForm(formList=[]){
		let form = {}
		let rules = {}
		if (commonUtil.isListLegal(formList)){
			formList.forEach(item=>{
				const {key,rules:_rules,content=''} = item
				if (key) {
					form[key] = content
					if (commonUtil.isListLegal(_rules)){
						rules[key] = _rules
					}
				}
			})
		}
		return {formList,form,rules}
	}
}

export const commonUtil = {
	/**
	 * 判断list是否有值
	 * @param {Array} list
	 */
	isListLegal(list){
		return Array.isArray(list) && list.length > 0
	},
	/**
	 * 判断obj是否有值
	 * @param {Object} obj
	 */
	isObjLegal(obj){
		return obj && Object.keys(obj).length > 0 && obj.constructor === Object
	}
}