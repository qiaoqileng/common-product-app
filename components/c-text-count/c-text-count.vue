<template>
  <view class="contain u-m-t-12">
    <text class="count">{{count||0}}/{{maxlength}}</text>
  </view>
</template>

<script>
	export default {
		name:"c-text-count",
    props:{
      maxlength:{
        type:Number|String,
        default:100
      },
      count:{
        type:Number|String,
        default:0
      }
    },
		data() {
			return {

			};
		}
	}
</script>

<style>
  .count{
    opacity: 1;
    font-size: 24rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: right;
    color: #bbbbbb;
    line-height: 24rpx;
    right: 24rpx;
  }
  .contain{
    display: flex;
    justify-content: flex-end;
  }
</style>
