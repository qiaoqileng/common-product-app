<template>
	<view :class="{'flex-end':option.right}" class="f-button" @click="option.click && option.click(form,option)">
		<view >{{option.placeholder || '请选择'}}</view>
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
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			
		}
	}
</script>

<style>
.f-button{
	display: flex;
	/* justify-content: right; */
}
</style>
