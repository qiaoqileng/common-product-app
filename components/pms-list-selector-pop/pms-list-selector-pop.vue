<template>
	<u-popup @close="close" :maskCloseAble="true" mode="bottom" :popup="false" v-model="value" length="70%" :safeAreaInsetBottom="true">
	 <c-page :isComponent="true" class="member safe_area_bottom">
		 <u-search class="u-p-24" placeholder="请输入关键字" v-model="keyword" :clearabled="true"></u-search>
		 <mescroll-uni class="u-border-top" :top="30" :bottom="single ? 0 : 130" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
				<view class="u-m-w u-border-bottom u-flex u-row-between"
							v-for="(item,index) in cptList"
							:key="item[idName]" @click="itemClick(item)">
					<view class="u-flex u-row">
<!--						<u-image class="u-m-l-20" width="80rpx" height="80rpx" :src="item.mLogo"></u-image>-->
						<view class="u-p-32 txt-label">{{item[labelName]}}</view>
					</view>
					<u-icon v-if="getSelected(item)" class="u-m-r-24" name="checkbox-mark" color="primary" size="28"></u-icon>
				</view>
			</mescroll-uni>
			<view class="bottom u-flex flex-center u-border-top" v-if="!single">
				<u-button class="u-m-w u-m-r-8" @click="cancel()">取消</u-button>
				<u-button class="u-m-w u-m-l-8" @click="save()" type="primary">确定</u-button>
			</view>
	 </c-page>
	</u-popup>
</template>

<script>
	import Vue from 'vue';
	import mescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [mescrollMixin],
		props: {
			value: {
				type: Boolean,
				default: false
			},
			single: {
				type: Boolean,
				default: false
			},
			idName: {
				type: String,
				default: 'value'
			},
			labelName: {
				type: String,
				default: 'label'
			},
			list: {
				type: Array,
				default() {
					return []
				},
				required: true
			}
		},
		data() {
			return {
				selectList: [],
				keyword: '',
				scrollTop: 0,
				oldScrollTop:0
			}
		},
		computed: {
			cptList: {
				get() {
					if (!this.keyword) return this.list
					const newList = this.list.filter(it => it[this.labelName].indexOf(this.keyword) !== -1)
					this.mescroll.endSuccess(newList.length);
					return newList
				}
			}
		},
		methods: {
			upCallback(page) {
				this.mescroll.endSuccess(this.list.length);
			},
			itemClick(item){
				if(this.single){
					// 单选
					this.$emit('confirm', [item]);
					this.close()
				}else{
					const index = this.selectList.map(p=>p[this.idName]).indexOf(item[this.idName])
					if(index >= 0){
						this.selectList.splice(index, 1)
					}else{
						this.selectList = [item, ...this.selectList]
						this.goTop()
					}
				}
			},
			tagClick(item, index){
				// 点击
				const position = this.selectList.map(p=>p[this.idName]).indexOf(item[this.idName])
				this.selectList.splice(position, 1)
			},
			save(){
				// 保存
				this.$emit('confirm', this.selectList);
				this.close()
			},
			cancel() {
				this.close()
			},
			getSelected(item){
				// 是否选中
				return this.selectList.map(p=>p[this.idName]).indexOf(item[this.idName]) >= 0
			},
			scroll (e) {
					//记录scroll  位置
					this.oldScrollTop = e.detail.scrollTop
			},
			goTop (e) {
					//视图会发生重新渲染
					this.scrollTop = this.oldScrollTop
					//当视图渲染结束 重新设置为0 设置为0不生效，0.1生效
					this.$nextTick(() =>{
							this.scrollTop = 0.1
					});
			},
			close(){
				this.$emit('input', false);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.txt-label{
		line-height: 1;
	}
	.member{
		position: relative;
		.bottom{
			white-space: nowrap;
			width: 100%;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			right: 0;
			padding: 0 24rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			.left{
				flex-grow: 1;
				width: 90%;
			}
			.b-scroll{
				white-space: nowrap;
				.tag{
						display: inline-block;
				}
			}
		}
	}
	.safe_area_bottom {
	  width: 100%;
	  padding-bottom: 0;
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
	}
</style>

