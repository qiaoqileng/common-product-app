<template>
	<text :style="[classObj]" @click.stop="handleClick">
		<text v-if="showLine" :style="[classObj.lineStyle]">|</text>
		{{ text }}
	</text>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		
		props: {
			showLine: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: ''
			},
			classObj: {
				type: Object,
				default() {
					return {
						lineStyle: {}
					}
				}
			}
		},
		
		created() {
			
		},
		
		methods: {
			handleClick() {
				this.$emit('click', this.checked);
			}
		}
	}
</script>

<style>
	
</style>