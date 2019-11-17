<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
        ref="searchForm"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">评论列表</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary">置顶</el-button>
          <el-button type="primary">隐藏</el-button>
          <el-button type="primary">删除</el-button>
        </el-row>
      </el-row>
      <app-table 
        ref="appTable"
        url="/mng/orderScore/queryOrderScoreList"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        @selection-change="tableSelect"
      />
    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import AppTable from '@/mixins/table'
  import AppSearch from '@/mixins/search'
  import AppRsText from '@/components/app-table/lib/rsText'
  import Score from './Score'
  export default {
    components: {
      
    },
    mixins: [AppTable, AppSearch],
    data() {
      return {
        columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '评论人昵称',
            field: 'name',
          },{
            label: '评论人ID号',
            field: 'id',
          },{
            label: '评论时间',
            field: 'createTime',
          },{
            label: '评论星级',
            field: 'professionalAttitudeScore',
            component: Score,
            propsHandler: ({ row }) => {
              return {
                row
              }
            }
          },{
            label: '评论内容',
            field: 'content',
          },{
            label: '评论状态',
            field: 'status',
            formater: ({ status }) => this.$t('rs.commentStatus')[status]
          },{
            label: '关联的类型',
            field: 'orderType',
            formater: ({ orderType, orderCategory }) => `${ this.$t('rs.orderType')[orderType] } - ${this.$t('rs.orderCategory')[orderCategory]}`
          },{
            label: '关联的订单',
            field: 'orderId',
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 130,
            type: 'button',
            items: ['隐藏', '删除', '置顶'],
            on: {
              click: ({ row, index }) => {
                this.handleBtnAction(row, ['hide', 'del', 'top'][index])
              }
            }
          }
        ]
      }
    },
    methods: {
      // 初始化页面
      initPage() {
        this.$set(this.searchFormInit, 'align', 'left')

        this.searchItems = [
          {
            label: '昵称',
            field: 'name',
            type: 1,
          },
          {
            label: '用户ID',
            field: 'userId',
            type: 1,
          },
          {
            label: '评论状态',
            field: 'commentStatus',
            type: 2,
            options: this.$t('rs.commentStatus')
          },
          {
            label: '时间',
            field: ['startDate', 'endDate'],
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            type: 10
          },
          {
            label: '订单类型',
            field: 'orderType',
            type: 2,
            options: this.$t('rs.orderType')
          },
        ]

        this.searchBtns = [
          {
            label: '确认',
            code: 'confirm'
          }, {
            label: '重置',
            code: 'reset',
            type: 'default'
          }
        ]
      },
      async handleBtnAction(row, type) {
        switch (type) {
          case 'top':
            await this.$confirm('确认置顶该条评论吗?', '温馨提示', { type: 'warning' })
            await this.orderScoreToTop({ orderScoreId: row.id })
            this.$msgSuccess('操作成功！')
            this.refreshTable()
            break;
          case 'hide':
            await this.$confirm('确认隐藏该条评论吗?', '温馨提示', { type: 'warning' })
            await this.orderScoreHide({ orderScoreId: row.id })
            this.$msgSuccess('操作成功！')
            this.refreshTable()
            break;
          case 'del':
            await this.$confirm('确认删除该条评论吗?', '温馨提示', { type: 'warning' })
            await this.orderScoreDel({ orderScoreId: row.id })
            this.$msgSuccess('操作成功！')
            this.refreshTable()
            break;
        }
      },
      ...mapActions('order', [
        'orderScoreDel',
        'orderScoreHide',
        'orderScoreToTop'
      ])
    },
    created() {
      this.initPage()
    }
  }
</script>
