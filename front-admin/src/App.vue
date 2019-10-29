<template>
  <router-view />
</template>

<script>
  import { mapActions } from 'vuex'
  import Bus from '@/utils/bus'
  import SYSTEM from '@/utils/system'

  export default {
    watch: {
      // 当路由变化时，将uid加入hash，记录当前窗口登录的用户，解决多窗口不同用户登录
      // $route: function(to, from) {
      //   let { query } = this.$route
      //   let uid = (query.uid || query.uid === 0) ? String(query.uid) : ''
        
      //   if (to.name !== 'login' && !uid) {
      //     uid = from.query.hasOwnProperty('uid') ? from.query.uid : localStorage.getItem('accountId')
      //     this.$router.replace({ query: Object.assign({ uid }, to.query) })
      //   }

      //   this.setBodyClassNames(to)
      // },
      $route: function(to) {
        this.setBodyClassNames(to)
      }
    },
    methods: {
      // 监听键盘按下事件
      bodyListener({ keyCode }) {
        switch (keyCode) {
          case 13:
            Bus.$emit('keyup')
            break;
        }
      },
      // 设置body的类名
      setBodyClassNames(to) {
        const { matched } = to
        const body = document.querySelector('body')
        let classNames = body.className.split(' ')

        classNames = classNames.filter(v => v.indexOf('app-layout--') === -1)

        const isLayout = v => v.name && ~v.name.indexOf('layout.')
        let layoutName = ''
        if (matched.some(v => isLayout(v))) {
          matched.forEach(v => {
            if (isLayout(v)) {
              layoutName = v.name.replace('.', '--')
            }
          })
        }
        if (layoutName) {
          classNames.push('app-' + layoutName)
        } else {
          classNames.push('app-layout--default')
        }

        body.className = classNames.join(' ')
      },
      ...mapActions('auth', [
        'getMenus'
      ])
    },
    created() {
      // 监听loading开关
      Bus.$on('loading', show => {
        this.setState({ ajaxLoading: show })
      })
      // 监听message提示信息
      Bus.$on('message', ({ type, msg }) => {
        switch(type) {
          case 'success':
            this.$msgSuccess(msg)
            break;
          case 'error':
            this.$msgError(msg)
            break;
        }
      })
      // 监听重新登录
      Bus.$on('logout', () => {
        // const tokenKey = SYSTEM.userTokenKey()
        // localStorage.removeItem(tokenKey)
        // localStorage.removeItem('curNavId')
        // localStorage.removeItem('curMenuId')
        this.$cookie.delete(SYSTEM.tokenName)
        this.setState({
          accountId: '',
          curNavId: '',
          curMenuId: '',
          saveStorage: true
        })
        this.$router.push({ path: '/login' })
      })

      document.body.addEventListener('keyup', this.bodyListener, false)

      if (SYSTEM.userToken()) {
        const { routes } = this.$router.options
        this.getMenus(routes)
      }
    },
    destroyed() {
      Bus.$off('loading')
      Bus.$off('message')
      Bus.$off('logout')

      document.body.removeEventListener('keyup', this.bodyListener)
    }
  }
</script>