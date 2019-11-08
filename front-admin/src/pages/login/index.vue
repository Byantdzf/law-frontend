<template>
  <el-row class="page-login">
    <el-row class="login-box">
      <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item class="logo-item">
          <img class="logo-img" src="/img/logo.png" alt="logo" />
          <p class="cl-666 ta-c logo-txt">{{ appTitle }}</p>
        </el-form-item>
        <el-form-item class="input-item" prop="userName">
          <el-input type="text" placeholder="请输入账号" v-model="loginForm.userName" autofocus>
            <i slot="prefix" class="iconfont icon-user color-999"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="input-item" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-password color-999"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="footer-item">
          <el-button
            class="fw-b bg-primary--linear"
            type="primary"
            :loading="isLoading"
            :disabled="isLoading"
            @click="loginSubmit"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="login-footer ta-c">
      <p class="cl-inverse">推荐使用：谷歌浏览器 / Recommended: Chorme</p>
      <p class="cl-inverse">{{ copyright }}</p>
    </el-row>
    <ul class="bg-list">
      <li
        v-for="(item, idx) in bgItems"
        :class="['bg-item', idx == curBgIndex ? 'show' : 'hidden']"
        :key="idx"
        :style="`background: url(${ item }) center no-repeat;background-size: cover;`"
      >
      </li>
    </ul>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import { treeToList } from '@/utils/tools'
import SYSTEM from '@/utils/system'
import Bus from '@/utils/bus'
import loginBg from '@/assets/images/login_bg.jpg'
// import bg1 from '@/assets/images/login_bg1.jpg'
// import bg2 from '@/assets/images/login_bg2.jpg'
// import bg3 from '@/assets/images/login_bg3.jpg'

// const md5 = require('md5')

export default {
  data() {
    return {
      appTitle: SYSTEM.title,
      copyright: SYSTEM.copyright,
      isLoading: false,
      // bgItems: [bg1, bg2, bg3],
      bgItems: [loginBg],
      loginForm: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ]
      },
      curBgIndex: 0
    }
  },
  methods: {
    loginSubmit() {
      this.$refs['loginForm'].validate(async (valid) => {
        if(!valid) return

        try {
          this.isLoading = true
          const { userName: account, password } = this.loginForm
          const res = await this.login({ userName: account, password })
          const userName = this.$val(res, 'data.userName')
          const accountId = this.$val(res, 'data.id')

          this.setState({
            userName,
            accountId,
            saveStorage: true
          })

          // this.$router.push({ query: { uid: accountId } })

          SYSTEM.userToken(this.$val(res, 'data.accessToken'))
          
          const { routes } = this.$router.options
          let menus = await this.getMenus(routes)
          let menusList = treeToList(menus)
          
          this.isLoading = false
          
          if (menusList.some(v => v.url == SYSTEM.routeHomePath)) {
            this.$router.push({ path: SYSTEM.routeHomePath })
          } else {
            if (menusList.length) {
              let idx = 0
              let path = ''

              while(!path && menusList[idx]) {
                path = this.getUrl(menusList[idx])
                idx ++
              }
              
              this.$router.push({ path })
            } else {
              this.$msgError('暂无授权目录，请联系管理员！')
            }
          }
        } catch (error) {
          // console.log(error)
          this.isLoading = false
        }
      })
    },
    // 获取登录后的首页
    getUrl(node) {
      let url = node.url && node.url != '/404' ?  node.url : ''
      let child = node.children ? node.children[0] : null
      
      while(!url && child) {
        url = child.url && child.url != '/404' ? child.url : ''
        child = child.children ? child.children[0] : null
      }

      return url
    },
    ...mapActions('auth', [
      'login',
      'getMenus'
    ])
  },
  mounted() {
    this.$nextTick(() => {
      
      this.loginForm.userName = localStorage.getItem('userName') || ''

      Bus.$on('keyup', () => {
        !this.isLoading && this.loginSubmit()
      })

      if (this.bgItems.length > 1) {
        this.bgTimer = setInterval(() => {
          this.curBgIndex ++
          if (this.curBgIndex > this.bgItems.length - 1) {
            this.curBgIndex = 0
          }
        }, 5000)
      }
    })
  },
  beforeDestroy() {
    Bus.$off('keyup')
    this.bgTimer && clearInterval(this.bgTimer)
    this.bgTimer = null
  }
}
</script>

<style lang="less">
  .page-login {
    position: relative;
    height: 100%;
    .bg-list,
    .bg-item {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .bg-item {
      transition: 0.8s;
      &.show {
        opacity: 1;
      }
      &.hidden {
        opacity: 0;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
      &.is-required {
        .el-form-item__label:before {
          display: none;
        }
      }
    }
    .logo-img {
      max-width: 250px;
      margin: 0 auto;
    }
    .logo-txt {
      letter-spacing: 4px;
    }
    .logo-item {
      margin-bottom: 30px;
    }
    .input-item {
      border-bottom-width: 1px;
      border-bottom-style: solid;
      .el-input__prefix {
        left: 0px;
        line-height: 42px;
      }
      .el-input__inner {
        height: 42px;
        line-height: 42px;
        padding-left: 30px;
        border-width: 1px;
        border-style: solid;
        border-radius: 5px;
      }
      .el-form-item__error {
        left: 30px;
        padding-top: 6px;
      }
    }
    .footer-item {
      margin-bottom: 0;
      padding-top: 30px;
    }
    .login-box {
      position: relative;
      width: 400px;
      margin: 10% auto 0;
      padding: 10px;
      border-radius:20px;
      z-index: 100;
    }
    .login-form {
      padding: 30px 50px 45px;
      border-radius:20px;
      .el-input__inner {
        border-width: 0;
      }
      .el-button {
        width: 100%;
        padding: 18px 15px;
        border-radius: 50px;
        font-size: 16px;
        &:hover {
          opacity: 0.9;
        }
      }
      .iconfont {
        font-size: 20px;
      }
    }
    .login-footer {
      margin-top: 70px;
      p {
        padding: 3px 0;
      }
    }
  }
</style>
