import { BASE_URL } from "./config.js"
export const formUtil = {
	/**
	 * 获取表单label最长宽度
	 * @param {Array} formItems 表单items  
	 * @param {String} key 表单label的key,默认为label字符串  
	 * @param {Number} defaultWidth 表单label默认宽度,默认90rpx
	 * @param {Number} singleWidth 表单label单字节宽度,单位rpx
	 * @param {Number} maxWidth 表单label单字节宽度,单位rpx
	 */
	getMaxLabelWidth(formItems = [], key = 'label', defaultWidth = 90, singleWidth = 15, maxWidth = 200) {
		if (commonUtil.isListLegal(formItems)) {
			let labels = formItems.map(item => this.getChartLength(item[key]))
			let maxLabel = Math.max(...labels)
			let wordWidth = maxLabel * singleWidth
			return wordWidth > maxWidth ? maxWidth : wordWidth
		} else {
			return defaultWidth
		}
	},
	getChartLength(str) {
		return str ? str.replace(/[^\x00-\xff]/g, "00").length : 0
	},
	/**
	 * 初始化表单列表
	 */
	initForm(formList = []) {
		let form = {}
		let rules = {}
		if (commonUtil.isListLegal(formList)) {
			formList.forEach(item => {
				let {
					key,
					rules: _rules,
					content
				} = item
				if (key) {
					if (!content) {
						item.content = ''
						content = ''
					}
					form[key] = content
					if (commonUtil.isListLegal(_rules)) {
						rules[key] = _rules
					}
				}
			})
		}
		return {
			formList,
			form,
			rules
		}
	}
}

export const commonUtil = {
	/**
	 * 判断list是否有值
	 * @param {Array} list
	 */
	isListLegal(list) {
		return Array.isArray(list) && list.length > 0
	},
	/**
	 * 判断obj是否有值
	 * @param {Object} obj
	 */
	isObjLegal(obj) {
		return obj && Object.keys(obj).length > 0 && obj.constructor === Object
	},
	isStrEmpty(value) {
		if (value === undefined || value === null || value === '') {
			return true;
		}
		return false;
	},
	getValue(obj = {}, key) {
		if (this.isStrEmpty(key)) {
			return ''
		} else if (key.indexOf('.') === -1) {
			return obj[key]
		} else {
			let arr = key.split('.')
			let first = arr.shift()
			let value = this.getValueByArrKey(obj[first], arr)
			return value
		}
	},
	getValueByArrKey(obj = {}, keys = []) {
		if (keys.length === 0) {
			return ''
		} else if (keys.length === 1) {
			return obj[keys.shift()]
		} else {
			let first = keys.shift()
			let value = this.getValueByArrKey(obj[first], keys)
			return value
		}
	},
	/**
	 * 解析统一错误格式的response
	 */
	toastErr(obj,defaultMsg='获取数据失败'){
		const {msg=defaultMsg} = obj || {}
		console.error('qql',obj)
		this.toast(msg)
	},
	toast(msg, icon = 'none', time = 2000) {
	  uni.showToast({
	    title: msg,
	    icon: icon,
	    duration: time
	  });
	},
}

export const httpUtil = {
	/**
	* 服务器地址 or 本地地址
	* @param {String} url
	*/
	getRealUrl(url,defaultUrl) {
	  let path
	  if (url) {
		path = url
		if (!url.startsWith('http')) {
		  path = `${BASE_URL}${url}`
		}
	  } else {
		path = defaultUrl?defaultUrl:(url||'')
	  }
	  return path
	},
	/**
	 * 只能在h5平台下载,需自行判断
	 * @param {Object} url 下载链接
	 */
	h5DownloadFile(url) {
		let a = document.createElement('a')
		a.href = url
		a.target = '_blank'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

}

export const fileUtil = {
	
	/**
	 * 路径提取文件名称
	 * @param {Object} path
	 */
	getFilePathName(path){
	  const index = path.lastIndexOf('/')
	  if(index > 0){
	    return path.substring(index + 1, path.length)
	  }
	  return ''
	},
	/*
	   * 根据文件名后缀区分 文件类型
	   * @param: fileName -  文件名称
	   * @return: 无后缀匹配 - ''
	   * @return: 匹配图片 - image
	   * @return: 匹配 txt - txt
	   * @return: 匹配 excel - excel
	   * @return: 匹配 word - word
	   * @return: 匹配 pdf - pdf
	   * @return: 匹配 ppt - ppt
	   * @return: 匹配 视频 - video
	   * @return: 匹配 音频 - radio
	   * @return: 其他匹配项 - other
	*/
	matchType(fileName) {
	  // 后缀获取
	  var suffix = '';
	  // 获取类型结果
	  var result = '';
	  try {
	    var flieArr = fileName.split('.');
	    suffix = flieArr[flieArr.length - 1];
	  } catch (err) {
	    suffix = '';
	  }
	  // fileName无后缀返回 false
	  if (!suffix) {
	    result = false;
	    return result;
	  }
	  // 图片格式
	  var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
	  // 进行图片匹配
	  result = imglist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'image';
	    return result;
	  };
	  // 匹配txt
	  var txtlist = ['txt'];
	  result = txtlist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'txt';
	    return result;
	  };
	  // 匹配 excel
	  var excelist = ['xls', 'xlsx'];
	  result = excelist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'excel';
	    return result;
	  };
	  // 匹配 word
	  var wordlist = ['doc', 'docx'];
	  result = wordlist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'word';
	    return result;
	  };
	  // 匹配 pdf
	  var pdflist = ['pdf'];
	  result = pdflist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'pdf';
	    return result;
	  };
	  // 匹配 ppt
	  var pptlist = ['ppt'];
	  result = pptlist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'ppt';
	    return result;
	  };
	  // 匹配 视频
	  var videolist = ['mp4', 'm2v', 'mkv'];
	  result = videolist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'video';
	    return result;
	  };
	  // 匹配 音频
	  var radiolist = ['mp3', 'wav', 'wmv'];
	  result = radiolist.some(function (item) {
	    return item == suffix;
	  });
	  if (result) {
	    result = 'radio';
	    return result;
	  }
	  // 其他 文件类型
	  result = 'other';
	  return result;
	},
	
	isSpecType(fileName, type) {
	   let suffix = '';
	   let result = '';
	   try {
	     var flieArr = fileName.split('.');
	     suffix = flieArr[flieArr.length - 1];
	   } catch (err) {
	     suffix = '';
	   }
	   if (!suffix) {
	     return result;
	   }
	   let matchList = null;
	   switch(type) {
	    case 'image':
	      matchList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
	      break
	    case 'pdf':
	      matchList = ['pdf']
	      break
	    case 'ppt':
	      matchList = ['ppt']
	      break
	    case 'excel':
	      matchList = ['xls', 'xlsx']
	      break
	    case 'word':
	      matchList = ['doc', 'docx']
	      break
	    case 'txt':
	      matchList = ['txt']
	      break
	    default:
	      matchList = []
	      break
	   }
	
	   result = matchList.some(function (item) {
	     return item == suffix;
	   });
	
	   return result ? true : false
	},
}

export const storeUtil = {
	/**
	 * 登录用户权限
	 */
	setMenu(data) {
	  this.setStorageSync(this.getToken() + 'Menu', data ? JSON.stringify(data) : '')
	},
	/**
	 * 获取用户权限
	 */
	getMenu() {
	  const data = this.getStorageSync(this.getToken() + 'Menu')
	  return data ? JSON.parse(data) : []
	},
	/**
	 * 登录用户信息
	 */
	setUser(data) {
	  this.setStorageSync('user', data ? JSON.stringify(data) : '')
	},
	/**
	 * 获取用户信息
	 */
	getUser() {
	  const data = this.getStorageSync('user')
	  return data ? JSON.parse(data) : ""
	},
	
	clearUser(){
		uni.removeStorageSync('user')  
	},
	/**
	 * TokenKey
	 */
	setTokenKey(data) {
	  this.setStorageSync(TOKENKEY, data)
	},
	/**
	 * 获取登录token - key
	 */
	getTokenKey() {
	  return this.getStorageSync(TOKENKEY) || ''
	},
	/**
	 * 设置token
	 * @param {Object} data
	 */
	setToken(data) {
	  this.setStorageSync(TOKENDATA, data)
	},
	/**
	 * 获取登录token
	 */
	getToken() {
	  return this.getStorageSync(TOKENDATA) || ''
	},
	
	/**
	 * 设置角色 99：管理员 1:政府 2:企业  3:项目
	 * @param {Object} userType
	 */
	setRole(data){
	    this.setStorageSync(USERROLE, data)
	},
	
	/**
	 * 获取角色
	 */
	getRole(){
	  return this.getStorageSync(USERROLE) || -1
	},
	
	/**
	 * 存储
	 * @param {*} key
	 * @param {*} value
	 */
	setStorageSync(key, value) {
	  uni.setStorageSync(key, value)
	},
	/**
	 * 获取
	 * @param {*} key
	 */
	getStorageSync(key) {
	  return uni.getStorageSync(key)
	},
}
