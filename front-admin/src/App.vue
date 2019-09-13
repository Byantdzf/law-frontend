<template>
  <router-view />
</template>

<script>
  import { mapActions } from 'vuex'
  import bus from '@/utils/bus'
  import SYSTEM from '@/utils/system'

  export default {
    watch: {
      // 当路由变化时，将uid加入hash，记录当前窗口登录的用户，解决多窗口不同用户登录
      $route: function(to, from) {
        let { query } = this.$route
        let uid = (query.uid || query.uid === 0) ? String(query.uid) : ''
        
        if (to.name !== 'login' && !uid) {
          uid = from.query.hasOwnProperty('uid') ? from.query.uid : localStorage.getItem('accountId')
          this.$router.replace({ query: Object.assign({ uid }, to.query) })
        }
      }
    },
    methods: {
      ...mapActions('auth', [
        'getMenus'
      ])
    },
    created() {
      // 监听loading开关
      bus.$on('loading', show => {
        this.setState({ ajaxLoading: show })
      })
      // 监听message提示信息
      bus.$on('message', ({ type, msg }) => {
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
      bus.$on('reLogin', () => {
        const tokenKey = SYSTEM.userTokenKey()
        localStorage.removeItem(tokenKey)
        localStorage.removeItem('curNavId')
        localStorage.removeItem('curMenuId')
        this.$router.push({ path: '/login' })
      })

      if (SYSTEM.userToken()) {
        this.getMenus()
      }
    }
  }
</script>