<template>
	<view class="u-flex-1 ">
		<u-input :type="option.type2||'text'" :placeholder="option.placeholder||'请输入内容'" :input-align="option.right?'right':'left'" v-if="option.type === 'edit'" v-model="form[option.key]"/>
		<f-text-area v-else-if="option.type === 'textarea'" :form="form" :option="option"/>
		<f-button v-else-if="option.type === 'button'" :form="form" :option="option"/>
		<f-select v-else-if="option.type === 'select'" :form="form" :option="option"/>
		<view :class="{'u-text-right':option.right}" v-else >{{form[option.key]}}</view>
	</view>
</template>

<script>
	/**
	 * formItem
	 * @description 本组件根据不同type展现各类表单组件
	 * @tutorial https://github.com/qiaoqileng/common-product-app/wiki/form%E8%A1%A8%E5%8D%95
	 * @property {type} text--view; edit--input; select--select; attach--c-file-upload;textarea--c-text-area
	 */
	export default {
		name:"f-form-item",
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
				value:''
			};
		},
		mounted() {
			// this.value = this.form[this.option.key]
		}
	}
</script>

<style>

</style>
