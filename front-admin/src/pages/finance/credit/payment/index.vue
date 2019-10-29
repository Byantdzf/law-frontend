<template>
  <el-row>
    <el-card class="search-card">
      <app-form
        ref="searchForm"
        class="app-search"
        :init="searchFormInit"
        :items="searchItems"
        :btns="searchBtns"
        @confirm="confirmSearch"
        @reset="confirmSearch"
      />
    </el-card>
    <el-card class="table-card mt-10">
      <el-row slot="header">
        <el-radio-group class="table-card-tabs fl" v-model="status">
          <el-radio-button
            v-for="(item, index) in radioItems"
            :key="index"
            :label="item.id"
          >{{ item.name }}</el-radio-button>
        </el-radio-group>
      </el-row>
      <app-table
        ref="appTable"
        url="/ptFinanceTenantCredit/payment/queryPage"
        :params="tableParams"
        :columns="columns"
        :max-height="tableMaxHieght"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      class="page-dialog"
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        ref="dialogComponent"
        :is="dialogComponent"
        :row="dialogForm"
        @refresh="handleRefresh"
      />
    </app-dialog>
  </el-row>
</template>

<script>
import { mapActions } from "vuex";
import AppTable from "@/mixins/table";
import AppDialog from "@/mixins/dialog";
import AppSearch from "@/mixins/search";
import AppRsText from "@/components/app-table/lib/rsText";
import AppTableImgs from "@/components/app-table/lib/imgs";

export default {
  components: {
    Detail: () => import("./detail"),
    Orders: () => import('./orders')
  },
  mixins: [AppTable, AppDialog, AppSearch],
  data() {
    return {
      status: "-1",
      radioItems: [
        {
          id: "-1",
          name: "全部"
        }
      ],
      columns: [
        {
          label: "商户名称",
          field: "tenantName"
        },
        {
          label: "结算订单金额",
          field: "paymentAmount",
          align: "center",
          type: 'button',
          formater: (row) => '￥' + (row.paymentAmount || 0),
          on: {
            click: ({ row }) => {
              this.handleBtnAction(row, 'orders')
            }
          }
        },
        {
          label: "收款账户",
          field: "receiptBankName",
          default: '--'
        },
        {
          label: "凭证",
          field: "certificate",
          align: "center",
          component: AppTableImgs,
          default: '--'
        },
        {
          label: "状态",
          field: "billStatus",
          align: "center",
          component: AppRsText,
          propsHandler({ value }) {
            let type = "info";
            switch (+value) {
              case 2:
                type = "success";
                break;
              case 0:
              case 1:
                type = "warning";
                break;
              case 3:
              case 4:
              case 5:
                type = "danger";
                break;
            }
            return { type }
          }
        },
        {
          label: '付款时间',
          field: 'paymentTime',
          align: "center",
          default: '--'
        },
        {
          label: '操作',
          field: 'operate',
          align: "center",
          type: 'button',
          default: '查看',
          on: {
            click: this.handleRowClick
          }
        }
      ],
      payRsType: 'success'
    };
  },
  watch: {
    status(nval) {
      this.tableParams = {
        ...this.tableParams,
        status: nval == -1 ? '' : nval
      };
    }
  },
  methods: {
    // 初始化页面
    initPage() {
      this.$set(this.searchFormInit, "align", "left");

      this.searchItems = [
        {
          label: '商户名称：',
          field: 'tenantId|id',
          placeholder: '模糊搜索',
          type: 1,
          autofill: true,
          fetchSuggestions: (value, cb) => {
            const name = value.trim()
            const tenantType = this.tenantType
            let params = {}

            if (!name) {
              cb([])
              return false
            } else {
              params.name = name
              if (tenantType) {
                params.tenantType = tenantType
              }
            }

            this.tenantGetKV(params).then(res => {
              cb(res.data || [])
            }).catch(() => {
              cb([])
            })
          }
        },
        {
          label: "付款时间：",
          field: ["paymentTimeStart", "paymentTimeEnd"],
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",
          type: 10
        }
      ];

      this.searchBtns = [
        {
          label: "确认",
          code: "confirm"
        },
        {
          label: "重置",
          code: "reset",
          type: "default"
        }
      ];

      const billStatusMap = this.$t("rs.billStatus");

      for (let k in billStatusMap) {
        this.radioItems.push({
          id: k,
          name: billStatusMap[k]
        });
      }
      this.radioItems = this.radioItems.filter(v => !(v.id == 0 || v.id == 6))
    },
    handleRefresh() {
      this.closeDialog();
      this.refreshTable();
    },
    async handleBtnAction(row, type) {
      switch (type) {
        case 'orders':
          this.dialogWidth = '1000px'
          this.dialogTitle = '订单清单 - ' + row.tenantName
          this.dialogComponent = 'Orders'
          this.dialogForm = row
          this.dialogVisible = true
          break;
      }
    },
    async handleRowClick({ row }) {
      const { id, tenantId } = row
      const res = await this.queryPaymentDetailById({ id, tenantId })
      this.dialogWidth = "800px";
      this.dialogTitle = "收款确认";
      this.dialogForm = res.data || {};
      this.dialogComponent = "Detail";
      this.dialogVisible = true;
    },
    ...mapActions('tenant', [
      'tenantGetKV'
    ]),
    ...mapActions('finance', [
      'queryPaymentDetailById'
    ])
  },
  created() {
    this.initPage();
  },
  destroyed() {}
};
</script>
