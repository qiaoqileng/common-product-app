<template name='upfile'>
  <view class="uploader-bd">
    <view class="uploader-files">
      <block v-for="(item,index) in upload_before_list" :key='index'>
        <view class="uploader-file" :class="[item.upload_percent<100?'uploader-file-status':'']" @click="previewFile(index)">
          <image :style="'width:'+upload_file_wh+'rpx;height:'+upload_file_wh+'rpx;'" :src="item._cover_" mode="aspectFill" />
          <!-- <view v-show="uploadSwitch" class="file-removeicon right" @click.stop="removeFile(index)">x</view> -->
          <view class="delete" @click.stop="removeFile(index)">
            <u-image v-show="uploadSwitch" class="file-removeicon right" width="40" height="40" src="/static/images/icon_delete.png"></u-image>
          </view>
          <view class="loader-filecontent" v-if="item.upload_percent<100">{{item.upload_percent}}%</view>
        </view>
      </block>
      <view v-show="upload_before_list.length<upload_count && uploadSwitch" hover-class="uploader-hover" class="uploader-inputbox"
        @click="chooseFile" :style="'width:'+upload_file_wh+'rpx;height:'+upload_file_wh+'rpx;'">
        <view class="u-row-center">
          <u-image width="80" height="80" src="/static/images/icon_add.png"></u-image>
        </view>
      </view>
    </view>
    <u-action-sheet :list="list" v-model="show" @click="chooseObject"></u-action-sheet>
    <u-modal v-model="tipshow" :mask-close-able="true" :show-cancel-button="true" content="是否确认删除该内容" @confirm="onConfirm"></u-modal>
	<kxj-previewImage ref="previewImage" :imgs="previewImg"></kxj-previewImage>
  </view>
</template>

<script>
  import {
    BASE_URL
  } from '@/utils/config.js'
  import {httpUtil,fileUtil,commonUtil,storeUtil} from '@/utils/fun.js'
  // var _self;
  export default {
    data() {
      return {
		  previewImg:[],
        // 选择图片tempFile
        upload_cache: [],
        // 预览数组->支持从服务器拉取
        upload_cache_list: [],
        // 上传数组
        upload_before_list: [],
        // 图片大小
        upload_file_size: [],
        // 超出限制数组
        upload_exceeded_list: [],
        // 上传数量
        // upload_count: 9,
        // 最大上传容量(M)
        upload_max: 10,
        // 图片/选择宽高
        upload_file_wh: 132,
        // 接口
        // url: '',
        show: false,
        tipshow: false,
        currentIdx: 0
      }
    },
    name: 'cFileUpload',
    props: {
      upload_auto: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default: ''
      },
      header: {
        type: Object,
        default () {
          return {}
        }
      },
      uploadSwitch: {
        type: Boolean,
        default: true
      },
      list: {
        type: Array,
        default () {
          return []
        }
      },
	  upload_count:{
		  type:Number,
		  default:9
	  }
    },
    watch: {
      list: {
        immediate: true,
        handler(nv, ov) {
          nv.forEach(it => {
            const file = this.preproccess(it, it.fileName)
            file.path = it.fileUrl
            this.upload_before_list.push(file)
            this.upload_cache_list.push(file)
          })
        }
      }
    },
    mounted() {

    },
    methods: {
      upFile(paths) {
        let _self = this
        const promises = paths.map((path) => {
          return promisify(upload)({
            url: _self.url,
            path: path,
            name: 'file',
            extra: {},
            header: _self.header,
            _self: _self,
            onSuccess: (res) => {
              uni.hideLoading();
              if (res.code === 200) {
                _self.upload_cache_list.push(res.data);
                _self.emit();
              } else {
                commonUtil.toast(res.msg)
                setTimeout(() => {
                  _self.upload_cache_list.splice(_self.upload_cache_list.length - 1, 1);
                  _self.upload_before_list.splice(_self.upload_before_list.length - 1, 1);
                }, 1000)
              }
            },
            onFail: (err) => {
              uni.hideLoading();
              // _self.upload_file_size.splice(i--, 1);
            }
          })
        })
        uni.showLoading({
          title: '正在上传...',
          mask: true
        });
        Promise.all(promises).then((data) => {
          // uni.hideLoading();
          // _self.upload_cache_list.push(...data);
          // _self.emit();
        }).catch((res) => {
          console.log(res);
          uni.hideLoading();
        });
      },
      chooseObject(index) {
        if (index === 0) {
          // this.chooseImage()
        } else if (index === 1) {
          this.chooseFile()
        }
      },
      chooseFile() {
        let _self = this
        uni.chooseImage({
          count: _self.upload_count - _self.upload_before_list.length,
          sizeType: 'compressed',
          success: async (res) => {
            let files = res.tempFiles
            for (let i = 0; i < files.length; i++) {
              let file = files[i]
              if (Math.ceil(file.size / 1024) < _self.upload_max * 1024) {
                await _self.upload_file_size.push(Math.ceil(file.size / 1024));
                await _self.upload_before_list.push(this.preproccess(file, file.name || fileUtil.getFilePathName(file.path)));
              } else {
                res.tempFilePaths.splice(i, 1);
                _self.upload_exceeded_list.push(i === 0 ? 1 : i + 1);
                uni.showModal({
                  title: '提示',
                  content: `第${[...new Set(_self.upload_exceeded_list)].join(',')}个文件超出限制${_self.upload_max}M,已过滤`,
                  showCancel: false,
                  confirmText: '确认',
                  success(res) {
                    if (res.confirm) {
                      _self.upload_file_size.splice(i--, 1);
                      _self.upload_exceeded_list.splice(i--, 1);
                    }
                  }
                });
              }
            }
            _self.upload_cache = await res.tempFilePaths;
            _self.upload(_self.upload_auto);
          },
          fail: (err) => {
            console.error(err);
          }
        });
      },

      preproccess(file, name) {
        // console.log(name)
        if (fileUtil.isSpecType(name, 'image')) {
          let path = ''
          if (file.fileUrl) {
            // 服务器图片
            path = file.fileUrl
            if (!file.fileUrl.startsWith('http')) {
              path = BASE_URL + file.fileUrl
            }
          } else {
            // 本地选择
            path = file.path
          }
          // console.log(path)
          file._cover_ = path
        } else if (fileUtil.isSpecType(name, 'pdf')) {
          file._cover_ = '/static/images/icon-pdf.png'
        } else if (fileUtil.isSpecType(name, 'ppt')) {
          file._cover_ = '/static/images/icon-ppt.png'
        } else if (fileUtil.isSpecType(name, 'excel')) {
          file._cover_ = '/static/images/icon-excel.png'
        } else if (fileUtil.isSpecType(name, 'word')) {
          file._cover_ = '/static/images/icon-word.png'
        } else if (fileUtil.isSpecType(name, 'txt')) {
          file._cover_ = '/static/images/icon-txt.png'
        } else {
          file._cover_ = '/static/images/icon-qita.png'
        }

        return file
      },

      async upload(upload_auto) {
		if (upload_auto){
			this.upload_cache.forEach(file=>{
				file['upload_percent'] = 0
			})
			await this.upFile(this.upload_cache)
		} else {
			console.warn(`传输参数:this.$refs.xx.upload(true)才可上传,默认false`);
		}
      },

      /**
       * 文件预览
       * @param {Object} idx
       */
      previewFile(idx) {
        const _this = this
		const temp = this.upload_auto?this.upload_cache_list:this.upload_before_list
        const item = temp[idx]
		const type = item.fileMime || item.name
		if (fileUtil.isSpecType(type, 'image')) {
          const images = temp.filter(p => {
            return fileUtil.isSpecType(type, 'image')
          }).map(p => {
            return httpUtil.getRealUrl(p.fileUrl,p.path)
          })
          // console.log(images)
          // uni.previewImage({
          //   current: idx,
          //   urls: images
          // });
		  _this.previewImg = images
		  _this.$refs.previewImage.open(idx)
        } else {
			const name = item.fileName||item.name
          let path = httpUtil.getRealUrl(item.fileUrl,item.path)
          let saveFileUrl = uni.getStorageSync(name)
          if(saveFileUrl){
            // console.log('保存的地址:' + saveFileUrl)
            uni.getFileInfo({
              filePath: saveFileUrl,
              success: function(res) {
                //console.log(res)
                _this.openDocument(saveFileUrl)
              },
              fail: function(res){
                // console.log(res)
                _this.downLoadFile(name, path)
              }
            })
            // _this.openDocument(saveFileUrl)
            return
          }
          _this.downLoadFile(_this, name, path)
        }
      },
      removeFile(idx) {
        this.tipshow = true
        this.currentIdx = idx
      },

      onConfirm() {
        this.upload_before_list.splice(this.currentIdx, 1);
        this.upload_cache_list.splice(this.currentIdx, 1);
        this.emit();
      },

      emit() {
        this.$emit('change', this.upload_cache_list);
      },

      /**
       * 下载预览文件
       * @param {Object} _this
       * @param {Object} fileName
       * @param {Object} path
       */
      downLoadFile(_this, fileName, path){
        // 下载
		//#ifdef H5
		httpUtil.h5DownloadFile(path)
		//#endif
		
		//#ifndef H5
        uni.downloadFile({
          url: path,
          success: function(res) {
            var filePath = res.tempFilePath;
            console.log(filePath)
            // 保存
            uni.saveFile({
                tempFilePath: filePath,
                success: function (res) {
                  var savedFilePath = res.savedFilePath;
                  uni.setStorageSync(fileName, savedFilePath)
                  console.log('保存到本地的地址:' + savedFilePath)
                  _this.openDocument(filePath)
                }
              });
          }
        });
		//#endif
      },

      /**
       * 打开文件
       * @param {Object} url
       */
      openDocument(filePath){
        if (uni.getSystemInfoSync().platform == 'android-h5') {
          console.log(plus.io.convertLocalFileSystemURL(filePath))

          let docPreview = uni.requireNativePlugin('Dasu-doc_preview');
          docPreview.openDoc(plus.io.convertLocalFileSystemURL(filePath))
        } else {
          uni.openDocument({
            filePath,
            success: (res) => {

            }
          });
        }
      }
    }
  }


  const promisify = (api) => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        api(Object.assign({}, options, {
          success: resolve,
          fail: reject
        }), ...params);
      });
    }
  }

  const upload = options => {
    let head = {}
    let _self = options._self
    head[storeUtil.getTokenKey()] = storeUtil.getToken()

    const url = `${BASE_URL}/api/core/file/upload`
    const path = options.path
    const name = options.name
    const header = head
    const extra = options.extra
    const onSuccess = options.onSuccess
    const progress = options.progress
    const onFail = options.onFail

    // console.log('url:' + url)
    const uploadTask = uni.uploadFile({
      url: url,
      filePath: path,
      name: name,
      header: header,
      formData: extra,
      success: function(res) {
        let data = {}
        try {
          data = JSON.parse(res.data)
        } catch (e) {
          console.error(e)
          throw (e)
        }
        // 根据自己的返回数据做相应判断,服务器返回200即代表成功请求
        if (res.statusCode == 200) {
          if (onSuccess) {
            onSuccess(data)
          }
        } else {
          if (onFail) {
            onFail(data)
          }
        }

      },
      fail: function(res) {
        if (onFail) {
          onFail(res)
        }
      }
    })

    uploadTask.onProgressUpdate(async (res) => {
		console.log(_self.upload_before_list)
		_self.upload_before_list.filter(item=>item.upload_percent && item.upload_percent<100)
      for (let i = 0, len = _self.upload_before_list.length; i < len; i++) {
		  let progress = _self.upload_before_list[i]['upload_percent']
		  if (progress <100){
			_self.upload_before_list[i]['upload_percent'] = await res.progress;
			_self.$set(_self.upload_before_list, i, _self.upload_before_list[i])
		  }
      }
    })

  }
</script>

<style lang="scss">
  .uploader-file {
    display: block;
  }

  .uploader-input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .uploader-inputbox {
    position: relative;
    margin-bottom: 16rpx;
    box-sizing: border-box;
    background-color: #F3F4F6;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .file-removeicon {
    position: absolute;
    color: #fff;
    width: 40upx;
    height: 40upx;
    line-height: 40upx;
    z-index: 2;
    text-align: center;

    &.right {
      top: 0;
      right: 0;
    }
  }

  .delete {
    position: absolute;
    top: -20rpx;
    right: -20rpx;
  }

  .uploader-file {
    position: relative;
    margin-right: 40rpx;
    margin-bottom: 28rpx;
  }

  .uploader-file-status:before {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.0);
  }

  .loader-filecontent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 9;
  }

  .uploader-bd {
    padding: 0rpx;
    margin: 0;
  }

  .uploader-files {
    display: flex;
    flex-wrap: wrap;
  }

  .uploader-file:nth-child(4n+0) {
    margin-right: 0;
  }

  .uploader-inputbox {
    &>view {
      text-align: center;
    }
  }

  .uploader-file-status:after {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .uploader-hover {
    box-shadow: 0 0 0 #e5e5e5;
    background: #e5e5e5;
  }
</style>
