<template>
  <el-row class="app-container">
    <el-row class="app-header-wrapper">
      <app-header showHomeIcon>
        <app-nav />
      </app-header>
    </el-row>
    <el-row class="app-side" id="app-side">
      <el-row class="app-side__hd">
        <span class="cl-999" v-if="!menuFold">{{ curNav ? curNav.name : '' }}</span>
        <!-- <i class="iconfont icon-menu-toggle fr cl-666" @click="toggleMenuVisible"></i> -->
      </el-row>
      <app-scroll-box
        class="app-side__bd"
        :reset="menuFold"
      >
        <app-menu :collapse="menuFold" />
      </app-scroll-box>
    </el-row>
    <el-row class="app-main" id="app-main">
      <el-breadcrumb class="pl-20 pr-20" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <router-view class="app-main-box pl-20 pr-20" />
      <app-loading :show="ajaxLoading" />
    </el-row>
    <app-dialog
      :width="dialogWidth"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <app-form
        v-if="dialogVisible"
        class="app-dialog-form"
        ref="appForm"
        :init="formInit"
        :items="formItems"
        :btns="formBtns"
        @confirm="formSubmit"
      />
    </app-dialog>
  </el-row>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { treeToList, arr2map } from '@/utils/tools'
  import AppScrollBox from '@/components/app-scroll-box'
  import AppNav from '@/components/app-nav'
  import AppMenu from '@/components/app-menu'
  import Dialog from '@/mixins/dialog'
  import Form from '@/mixins/form'
  import AppHeader from '@/layouts/app-header'
  export default {
    components: {
      AppScrollBox,
      AppHeader,
      AppNav,
      AppMenu
    },
    mixins: [Dialog, Form],
    data() {
      return {
        formItems: [
          {
            label: '旧密码：',
            field: 'password',
            type: 6,
            placeholder: '请输入旧密码',
            required: true
          }, {
            label: '新密码：',
            field: 'newPassword',
            type: 6,
            placeholder: '请输入新密码',
            required: true
          }, {
            label: '确认密码：',
            field: 'confirmPassword',
            type: 6,
            placeholder: '请再次输入新密码',
            required: true
          }
        ]
      }
    },
    computed: {
      breadcrumbs() {
        let arr = []
        let menuId = this.curMenuId
        let list = treeToList([this.curNav], [], 0)
        let menuMap = arr2map(list, 'id')
            
        while(menuMap[menuId]) {
          arr.push(menuMap[menuId])
          menuId = menuMap[menuId].parentId
        }

        return arr.reverse()
      },
      ...mapState([
        "userId",
        "userName",
        "menuFold",
        "curMenuId",
        "curNav",
        "ajaxLoading"
      ])
    },
    watch: {
      menuFold: function(nval) {
        const body = document.querySelector('body')
        let classNames = body.className.split(' ')

        if (nval) {
          classNames.push('is-menu-hidden')
        } else {
          classNames = classNames.filter(v => v !== 'is-menu-hidden')
        }

        body.className = classNames.join(' ')
      }
    },
    methods: {
      toggleMenuVisible() {
        this.setState({
          menuFold: !this.menuFold
        })
      },
      updatePassword() {
        this.dialogWidth = '500px'
        this.dialogTitle = '修改密码'
        this.dialogVisible = true
      },
      logOut() {
        localStorage.clear()
        this.setState({ token: '', navs: [] })
        this.$router.push({ path: '/login' })
      },
      formSubmit(form) {
        let params = { ...form }

        if (params.newPassword == params.confirmPassword) {
          delete params.confirmPassword
          params.rePassword = params.newPassword
          this.accountUpdatePwd(params).then(() => {
            this.$msgSuccess('修改成功！')
            this.closeDialog()
          })
        } else {
          this.$msgError('新密码与确认密码不一致！')
        }
      },
      ...mapActions('system', [
        'accountUpdatePwd'
      ])
    }
  }
</script>

<style lang="less">
  @headerHeight: 50px;
  @menuWidth: 200px;
  @menuHeight: 44px;
  @menuHideWidth: 60px;
  .app-container {
    position: relative;
    height: 100%;
  }
  .app-layout--default {
    .app-header-wrapper {
      position: relative;
      z-index: 3001;
      .app-header {
        height: @headerHeight;
        line-height: @headerHeight;
      }
      .app-header__left {
        width: @menuWidth;
        position: relative;
        z-index: 100;
        text-align: center;
        overflow: hidden;
        .logo {
          display: inline-block;
          max-width: 100%;
          max-height: @headerHeight;
          vertical-align: middle;
        }
      }
      .app-header__center {
        margin-left: -@menuWidth;
        padding-left: @menuWidth;
      }
      .app-nav {
        font-size: 0;
      }
      .app-nav-item {
        & > a {
          height: @headerHeight;
          line-height: @headerHeight;
          transition: 0.3s;
        }
      }
      .app-header__right {
        position: absolute;
        top: 0;
        right: 0;
      }
      .app-header__tools {
        .reference {
          display: block;
          height: @headerHeight;
          line-height: @headerHeight;
        }
      }
    }
    .app-side {
      position: absolute !important; 
      z-index: 3000;
      top: @headerHeight;
      left: 0;
      bottom: 0;
      width: @menuWidth;
      overflow-x: hidden;
      transition: 0.3s;
      .icon-menu-toggle {
        transition: 0.3s;
      }
      .app-side__hd {
        height: @menuHeight;
        padding: 12px 20px;
        overflow: hidden;
        .icon-menu-toggle {
          line-height: 1;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .app-side__bd {
        position: absolute;
        top: @menuHeight;
        right: 0;
        bottom: 0;
        left: 0;
      }
      .el-submenu .el-menu-item { 
        min-width: 100px;
      }
      .app-menu {
        border: 0;
        background: transparent;
        .el-submenu,
        .el-menu--inline li { 
          border-bottom: none;
        }
        .el-menu-item, 
        .el-submenu__title { 
          height: @menuHeight; 
          line-height: @menuHeight;
        }
        .el-menu-item {
          a { 
            display: block;
            margin: 0 -20px; 
            padding:0 20px;
          }
        }
        .el-submenu {
          .el-menu-item {
            a { 
              margin: 0 -40px; 
              padding:0 40px;
            }
          }
        }
        .iconfont {
          padding-right: 6px;
        }
      }
    }
    .app-main {
      position: absolute !important;
      top: @headerHeight;
      right: 0;
      bottom: 0;
      left: @menuWidth;
      overflow-x: hidden;
      overflow-y: auto;
      transition: 0.3s;
      z-index: 1;
      .el-breadcrumb {
        min-height: 20px;
        line-height: 40px;
      }
    }
    .el-image-viewer__wrapper,
    .el-message-box__wrapper {
      left: @menuWidth !important;
    }
    .el-image-viewer__wrapper,
    .app-dialog__wrapper {
      top: @headerHeight !important;
    }
    &.is-menu-hidden {
      .app-side {
        width: @menuHideWidth;
      }
      .app-main {
        left: @menuHideWidth;
      }
      .icon-menu-toggle {
        transform: rotateZ(180deg);
      }
      .el-image-viewer__wrapper,
      .el-message-box__wrapper {
        left: @menuHideWidth !important;
      }
    }
  }
</style>

