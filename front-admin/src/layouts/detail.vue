<template>
  <el-row class="app-container">
    <el-row class="app-header-wrapper">
      <app-header class="app-content" />
    </el-row>
    <el-row class="app-main" id="app-main">
      <el-breadcrumb class="app-content" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <router-view class="app-content" />
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
  import Dialog from '@/mixins/dialog'
  import Form from '@/mixins/form'
  import AppHeader from '@/layouts/app-header'
  export default {
    components: {
      AppHeader
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
        "curMenuId",
        "curNav",
        "ajaxLoading"
      ])
    },
    methods: {
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
  .app-layout--detail {
    .app-header-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 90;
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
    .app-content {
      width: 1200px;
      margin: 0 auto;
    }
    .app-main {
      padding-top: @headerHeight;
      padding-bottom: 20px;
      .el-breadcrumb {
        min-height: 20px;
        line-height: 40px;
      }
    }
    
    .el-image-viewer__wrapper,
    .app-dialog__wrapper {
      top: @headerHeight !important;
    }
  }
</style>

