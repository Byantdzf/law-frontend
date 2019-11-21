<template>
  <el-row class="coupon-form-wrapper">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="是否开启">
        <el-radio-group v-model="form.dataStatus">
          <el-radio v-for="item in statusItems" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优惠券名称">
        <el-input v-model="form.couponName"></el-input>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-select v-model="form.type">
          <el-option v-for="item in typeItems" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券种类">
        <el-select v-model="form.scene">
          <el-option v-for="item in sceneItems" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.scene == 2">
        <el-radio-group v-model="form.shareRule">
          <el-radio label="21">邀请别人，别人打开链接后即可获得</el-radio>
          <el-radio class="pt-10" label="22">邀请别人，别人在平台消费后即可获得</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.scene == 3">
        <el-radio-group v-model="form.shareRule">
          <el-radio label="31">
            <span class="pr-10">消费满</span>
            <el-input size="mini" v-model.number="form.ruleAmout" :disabled="form.shareRule != '31'" style="width: 100px;"></el-input>
            <span class="pl-10">即赠送</span>
          </el-radio>
          <el-radio class="pt-10" label="32">无限制，所有用户/选择的客户均可得</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优惠券备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.rangeStartTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.rangeEndTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券发放数量">
        <el-input v-model.number="form.sendCount"></el-input>
      </el-form-item>
      <el-form-item label="优惠券规则">
        <el-col :span="11">
          <el-input v-model.number="form.overAmount">
            <template slot="prepend">满</template>
            <template slot="append">元</template>
          </el-input>
        </el-col>
        <el-col class="line ta-c" :span="2">-</el-col>
        <el-col :span="11">
          <el-input v-model.number="form.amount">
            <template slot="prepend">减</template>
            <template slot="append">元</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="使用对象">
        <el-radio-group v-model="useTarget">
          <el-radio label="1">全部用户</el-radio>
          <el-radio label="2">指定用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row class="table-box mb-20" v-if="useTarget == '2'">
        <app-form
          class="app-search"
          :init="searchFormInit"
          :items="searchItems"
          :btns="searchBtns"
          @confirm="confirmSearch"
          @reset="confirmSearch"
          ref="searchForm"
        />
        <app-table 
          ref="appTable"
          url="/member/user/list"
          columnType="selection"
          :params="tableParams"
          :columns="columns"
          @selection-change="tableSelect"
        />
      </el-row>
      
      <el-form-item class="ta-c">
        <el-button size="default" class="btn-submit" type="primary" @click="formSubmit">发布</el-button>
      </el-form-item>
    </el-form>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      :full="dialogIsFull"
      @close="closeDialog"
    >
      <template slot="title" v-if="showHeaderTab">
        <el-radio-group v-model="curDialogTab" size="small">
          <el-radio-button label="detail">个人资料</el-radio-button>
          <el-radio-button label="orderInfo">订单信息</el-radio-button>
        </el-radio-group>
      </template>
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        :tab="curDialogTab"
        @submit="formSubmit"
        @cancel="closeDialog"
        ref="dialogComponent"
      />
    </app-dialog>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import AppTable from '@/mixins/table'
import AppSearch from '@/mixins/search'
import AppDialog from '@/mixins/dialog'
import AppRsText from '@/components/app-table/lib/rsText'
import AppTableImgs from '@/components/app-table/lib/imgs'
export default {
  components: {
    Edit: () => import("@/pages/member/consultants/edit"),
  },
  mixins: [AppTable, AppSearch, AppDialog],
  props: {
    row: Object
  },
  data() {
    const getItems = (key) => {
      let arr = []
      for(let k in this.$t(`rs.${key}`)) {
        arr.push({
          id: +k,
          name: this.$t(`rs.${key}`)[k]
        })
      }
      return arr
    }
    let statusItems = getItems('status')
    let sceneItems = getItems('couponScene')
    let typeItems = getItems('couponType')

    return {
      statusItems,
      sceneItems,
      typeItems,
      form: {
        dataStatus: +this.$val(this.row, 'dataStatus', 1),
        couponName: this.$val(this.row, 'couponName'),
        type: +this.$val(this.row, 'type', 1),
        scene: +this.$val(this.row, 'scene', 1),
        remark: this.$val(this.row, 'remark'),
        rangeStartTime: this.$val(this.row, 'rangeStartTime'),
        rangeEndTime: this.$val(this.row, 'rangeEndTime'),
        sendCount: this.$val(this.row, 'sendCount'),
        overAmount: this.$val(this.row, 'overAmount'),
        amount: this.$val(this.row, 'amount'),
        shareRule: this.$val(this.row, 'shareRule', '21'),
        ruleAmout: this.$val(this.row, 'ruleAmout'),
      },
      useTarget: '1',
      columns: [
          {
            label: '序号',
            field: 'index',
            width: 70
          },{
            label: '微信头像',
            field: 'avatarUrl',
            width: 100,
            component: AppTableImgs
          },{
            label: '微信昵称',
            field: 'name',
          },{
            label: '手机号',
            field: 'phone',
          },{
            label: '近一周登陆次数',
            field: 'loginCount',
            align: 'center',
          },{
            label: '最近登陆时间',
            field: 'createTime',
            align: 'center',
          },{
            label: '下单次数',
            field: 'orderCount',
            width: 100,
            align: 'center'
          },{
            label: '状态',
            field: 'status',
            width: 100,
            align: 'center',
            component: AppRsText,
            propsHandler ({ col, row }) {
              return {
                col,
                row,
                type: row[col.prop] == 1 ? 'success' : 'danger'
              } 
            }
          },{
            label: '操作',
            field: 'operate',
            align: 'center',
            width: 120,
            type: 'button',
            items: ['查看'],
            on: {
              click: ({ row }) => {
                this.handleBtnAction(row, 'detail')
              }
            }
          }
        ],
        showHeaderTab: false,
        curDialogTab: ''
    }
  },
  watch: {
    useTarget() {
      this.tableSelected = []
    }
  },
  methods: {
    // 初始化页面
    initPage() {
      this.$set(this.searchFormInit, 'align', 'left')

      this.searchItems = [
        {
          labelWidth: '70px',
          label: '状态：',
          field: 'status',
          type: 2,
          options: this.$t('rs.status')
        },
        {
          label: '最近登录时间：',
          field: ['startTime', 'endTime'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          type: 10
        },
        {
          labelWidth: '70px',
          label: '关键词：',
          field: 'keyword',
          type: 1,
          placeholder: '微信号、微信昵称'
        },
      ]

      this.searchBtns = [
        {
          label: '确认',
          code: 'confirm'
        }
      ]
    },
    async handleBtnAction(row, type) {
        let res = {}
        let data = {}
        this.dialogIsFull = true
        switch (type) {
          case 'detail':
            this.curDialogTab = 'detail'
            this.showHeaderTab = true
            res = await this.memberView(row.id)
            data = res.data || {}
            data.id = row.id
            this.dialogForm = data
            this.dialogComponent = 'Edit'
            this.dialogVisible = true
            break;
        }
      },
    // 表单提交
    formSubmit() {
      let params = { ...this.form }
      if(this.row && this.row.hasOwnProperty('id')) {
        params.id = this.row.id
      }
      if (this.useTarget == 2 && !this.tableSelected.length) {
        this.$msgError('请选择指定的用户')
        return false
      }
      if (this.useTarget == 2) {
        params.userIdList = this.tableSelected.map(v => v.id)
      }
      this.$emit('submit', params)
    },
    ...mapActions('member', [
      'memberView',
    ])
  },
  mounted() {
    this.initPage()
  }
}

</script>

<style lang="less">
  .coupon-form-wrapper {
    .el-form-item {
      width: 600px;
    }
    .table-box {
      padding: 20px;
      border: 1px solid #f3f3f3;
      .app-form.el-form .el-form-item {
        display: inline-block;
        width: auto;
        .el-select {
          width: 120px;
        }
      }
    }
  }
</style>
