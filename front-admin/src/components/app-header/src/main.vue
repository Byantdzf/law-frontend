<template>
	<el-row class="app-header">
    <el-col class="app-header__left">
      <slot name="left">
        <img class="logo" src="/img/logo2.png" alt="logo" />
      </slot>
    </el-col>
    <el-col class="app-header__center">
      <slot></slot>
    </el-col>
    <div class="app-header__right">
      <slot name="right">
        <ul class="app-header__tools">
          <li class="ib">
            <el-popover
              popper-class="app-header__popover"
              width="400"
              trigger="hover">
              <el-row class="header-popover-hd pb-10">
                <el-col :span="12">账户信息</el-col>
                <el-col class="ta-r" :span="12">账户设置</el-col>
              </el-row>
              <el-row class="header-popover-bd pt-10">
                <p>
                  <span>所在部门：</span>
                  <span>--</span>
                </p>
              </el-row>
              <span class="reference" slot="reference">
                <span class="icon-box ib">
                  <i class="iconfont icon-manager cl-primary"></i>
                </span>
                <span class="ib header-username ellipsis">{{ accountName }}</span>
              </span>
            </el-popover>
          </li>
          <li class="ib">
            <router-link class="reference" to="/home/index">
              <i class="iconfont icon-home cl-inverse"></i>
            </router-link>
          </li>
          <!-- <li class="ib">
            <el-popover
              popper-class="app-header__popover"
              width="400"
              trigger="hover">
              <el-row class="header-popover-hd pb-10">
                <el-col :span="12">常用菜单</el-col>
                <el-col class="ta-r" :span="12">菜单管理</el-col>
              </el-row>
              <el-row class="header-popover-bd pt-10">
                <el-col class="ta-c" :span="8">常用菜单1</el-col>
                <el-col class="ta-c" :span="8">常用菜单2</el-col>
                <el-col class="ta-c" :span="8">常用菜单3</el-col>
              </el-row>
              <span class="reference" slot="reference">
                <i class="iconfont icon-menu"></i>
              </span>
            </el-popover>
          </li> -->
          <li class="ib" @click="logout">
            <span class="reference">
              <i class="iconfont icon-logout"></i>
            </span>
          </li>
        </ul>
      </slot>
    </div>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  import Bus from '@/utils/bus'

	export default {
    name: 'app-header',
    computed: {
      ...mapState([
        'accountName'
      ])
    },
    methods: {
      async logout() {
        try {
          await this.$confirm('确认退出登录吗？', {
            title: this.$t('text.tips'),
            type: 'warning'
          })
          Bus.$emit('logout')
        } catch (error) {
          // error
        }
      }
    }
	}
</script>

<style lang="less">
	.app-header__tools {
    font-size: 0;
    .header-username {
      max-width: 150px;
      padding-left: 6px;
    }
    .icon-box {
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      text-align: center;
    }
    li {
      cursor: pointer;
      padding: 0 20px;
      .iconfont {
        font-size: 20px;
      }
    }
  }
  .app-header__popover {
    margin-top: 0 !important;
  }
</style>