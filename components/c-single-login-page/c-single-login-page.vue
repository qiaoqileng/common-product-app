<template>
	<view class="globle-page">
		<view class="u-flex-col flex-center match-height match-width" v-if="loginStatus==0">
			<u-loading class="loading" loading-text="正在请求中,请稍后..."></u-loading>
			<text class="u-m-t-12 t-n-text">请稍后...</text>
		</view>
		<slot v-else-if="loginStatus == 1 && ($slots.default || $slots.$default)" />
		<u-empty v-else-if="loginStatus == 2" text="登陆失败"></u-empty>
		<u-empty v-else text="数据为空"></u-empty>
	</view>
</template>

<script>
  import {
    mapMutations
  } from "vuex"
  import {
    mapState
  } from 'vuex';
// import { fakeJSAccountLogin } from '@/server/user.js';
  import util from "utils/fun"
  import {APP_TYPE,TYPE_STORE} from '@/utils/config.js'
export default {
	name: 'c-single-login-page',
	props:{
		//执行login
		login:{
			type:Function,
			default:undefined
		},
		//login回调
		callback:{
			
		}
	},
	data() {
		return {
			loginStatus: 0,//0请求中;1登陆成功;2登陆失败;其他未知
		};
	},
    computed: {
      ...mapState('user', ['cid'])
    },
	methods: {
      ...mapMutations("user", ["setCurrentUser"]),
		singleLogin() {
			fakeJSAccountLogin()
				.then(res => {
					const { code, data } = res;
					console.log( data);
					if (code == 200 && data){
						const user = data;
						let role = -1;
						if (user.typeStr == '政府') {
							role = 1;
						} else if (user.typeStr == '企业') {
							role = 2;
						} else if (user.typeStr == '项目') {
							role = 3;
						} else if (user.typeStr == '管理员') {
							role = 99;
						}
						util.setTokenKey(data.authHeaderKey)
						util.setToken(data.authValue)
						this.setCurrentUser(user);
						util.setUser(user);
						util.setRole(role);
						this.loginStatus = 1
						this.$emit('onReady',this.loginStatus)
					} else {
						this.loginStatus = 2
						this.$emit('onReady',this.loginStatus)
						util.toastErr(res)
					}
				})
				.catch(err => {
					console.error(err);
					this.loginStatus = 2
					this.$emit('onReady',this.loginStatus)
					util.toastErr(err)
				});
		}
	},
	mounted() {
		//#ifdef H5
		if (APP_TYPE === TYPE_STORE.shengting) {
			this.singleLogin();
		} else {
			this.loginStatus = 1
			this.$emit('onReady',1)
		}
		//#endif
		//#ifndef H5
		//非H5环境直接过
		this.loginStatus = 1
		this.$emit('onReady',1)
		//#endif
	}
};
</script>

<style>
	.globle-page{
display: block;
    width: 100%;
    height: 100%;
	}
	.loading{
		margin: 0 auto;
	}
</style>
