			
	<template>
		<view>
		 <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			 <view v-for="(item,i) in dataList" :key="i"> {{item.businessName}} </view>
			<mescroll-empty v-if="dataList.length == 0"></mescroll-empty>
		 </mescroll-body>
		</view>
	</template>

	<script>
		// 引入mescroll-mixins.js
		import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
		import MescrollBody from "@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue"; // 非uni_modules版本
		import MescrollEmpty from '@/uni_modules/mescroll-uni/components/mescroll-empty/mescroll-empty.vue';
		import {PAGE_SIZE} from '@/utils/config.js'
		
		export default {
			mixins: [MescrollMixin], // 使用mixin
			components: {
				MescrollBody,MescrollEmpty
			},
			data() {
				return {
					mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
					// 下拉刷新的配置(可选, 绝大部分情况无需配置)
					downOption: { 
						
					},
					// 上拉加载的配置(可选, 绝大部分情况无需配置)
					upOption: {
						page: {
							size: 10 // 每页数据的数量,默认10
						},
						noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
						empty: {
							tip: '暂无相关数据'
						}
					},
					// 列表数据
					dataList: []
				}
			},
			methods: {
				getList(page){
					uni.request({
						url: `/api/workflow/${page.num}/${PAGE_SIZE}/processTaskList`,
						header:{'x-access-token': '992af76750434d349d70c9b17026d382'},
						success: (res) => {
							const {data,code} = res.data
							if (code === 200){
								// 接口返回的当前页数据列表 (数组)
								let curPageData = data.list; 
								// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
								let curPageLen = curPageData.length; 
								// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
								let totalPage = data.totalPage; 
								// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
								let totalSize = data.total; 
								// 接口返回的是否有下一页 (true/false)
								let hasNext = page < totalPage; 
								
								//设置列表数据
								if(page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
								this.dataList = this.dataList.concat(curPageData); //追加新数据
								
								// 请求成功,隐藏加载状态
								//方法一(推荐): 后台接口有返回列表的总页数 totalPage
								this.mescroll.endByPage(curPageLen, totalPage); 
								setTimeout(()=>{
									this.mescroll.endSuccess(curPageLen)
								},20)
							} else {
								this.mescroll.endErr()
							}
						},
						fail: () => {
							// 请求失败,隐藏加载状态
							this.mescroll.endErr()
						}
					})
				},
				/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
				mescrollInit(mescroll) {
					this.mescroll = mescroll;
				},
				/*下拉刷新的回调, 有3种处理方式:*/
				downCallback(){
					console.log('downCallback')
					this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				},
				/*上拉加载的回调*/
				upCallback(page) {
					console.log('upCallback',page)
					this.getList(page)
				}
			}
		}
	</script>