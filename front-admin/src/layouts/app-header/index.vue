<template>
	<el-row class="app-header">
    <el-col class="app-header__left">
      <slot name="logo">
        <img class="logo" src="/img/logo2.png" alt="logo" />
        <h2 class="ib">{{ appTitle }}</h2>
      </slot>
    </el-col>
    <el-col class="app-header__center">
      <slot></slot>
    </el-col>
    <div class="app-header__right">
      <ul class="app-header__tools">
        <!-- <li class="ib">
          <el-popover
            popper-class="app-header__popover"
            width="80"
            trigger="hover">
            <el-row>
              <el-col>
                <i class="iconfont icon-password"></i> 修改密码
              </el-col>
            </el-row>
            <span class="reference" slot="reference">
              <span class="icon-box ib">
                <i class="iconfont icon-manager cl-primary"></i>
              </span>
              <span class="ib header-username ellipsis">{{ accountName }}</span>
            </span>
          </el-popover>
        </li> -->
        <slot name="tools">
          <li class="ib">
            <span class="reference">
              <span class="icon-box ib">
                <i class="iconfont icon-manager cl-primary"></i>
              </span>
              <span class="ib header-username ellipsis">{{ accountName }}</span>
            </span>
          </li>
          <li class="ib">
            <span class="reference">
              <i class="iconfont icon-password"></i>
            </span>
          </li>
          <li class="ib" @click="logout">
            <span class="reference">
              <i class="iconfont icon-logout"></i>
            </span>
          </li>
        </slot>
      </ul>
    </div>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex'
  import SYSTEM from '@/utils/system'
  import Bus from '@/utils/bus'

	export default {
    name: 'app-header',
    computed: {
      ...mapState([
        'accountName'
      ])
    },
    data() {
      return {
        appTitle: SYSTEM.title,
      }
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