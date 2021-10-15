<template>
	<view :class="{'flex-end':option.right}" class="f-button" @click="click ? click(form,option) : (option.click && option.click(form,option))">
		<view >{{option.content || option.placeholder || '请选择'}}</view>
		<u-icon name="arrow-right"></u-icon>
	</view>
</template>

<script>
	export default {
		name:"f-button",
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
			},
			click:{
				type:Function,
				default(){
					return undefined
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			
		},
	}
</script>

<style>
.f-button{
	display: flex;
	/* justify-content: right; */
}
</style>
