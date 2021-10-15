<template>
	<view class="txt">
	    <!-- <text class="textarea-title">{{label}}</text> -->
	    <view class="textarea-bg u-flex-col u-m-t-24">
	      <textarea
	      @input="fontCount"
	      :row="3"
		  :type="option.type2 || 'text'" 
	      :placeholder="option.placeholder||`请输入${option.label}`"
	      :maxlength="option.maxlength"
	      style="height: 120rpx;width: 100%;"></textarea>
	      <c-text-count :maxlength="option.maxlength" :count="count"></c-text-count>
	    </view>
	</view>
</template>

<script>
	export default {
		name:"f-text-area",
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
				count:0
			};
		},methods:{
			fontCount(e){
				let value = e.detail.value
				this.form[this.option.key] = value
				this.count = value.length
			},
			onBlur(res){
			  this.$emit('onBlur', res);
			},
		}
	}
</script>

<style>

  	.textarea-title{
  		opacity: 1;
  		font-size: 32rpx;
  		font-family: PingFangSC, PingFangSC-Regular;
  		font-weight: 400;
  		text-align: left;
  		color: #303133;
  		line-height: 45rpx;
  	}
  	.textarea-bg{
  		opacity: 1;
  		background: #f7f8fa;
  		border-radius: 16rpx;
  		padding: 16rpx;
  	}
    .txt{
      opacity: 1;
      font-size: 32rpx;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #303133;
      line-height: 45rpx;
    }
</style>
