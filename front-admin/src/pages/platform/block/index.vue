<template>
  <el-row>
    <el-card class="search-card">
      <el-radio-group class="table-card-tabs pb-10" v-model="articleType">
        <el-radio-button
          v-for="(item, index) in articleTypeItems"
          :key="index"
          :label="item.id"
        >{{ item.name }}</el-radio-button>
      </el-radio-group>
    </el-card>

    <el-card class="search-card mt-10 pb-10 block-detail">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">{{ currTypeName }}介绍管理</span>
        </el-row>
      </el-row>
      <el-row class="el-table el-table--small el-table--border block-table">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
          <thead>
            <tr>
              <td class="label">
                <div class="cell"></div>
              </td>
              <td>
                <div class="cell">图片</div>
              </td>
              <td>
                <div class="cell">文字介绍</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label">
                <div class="cell">当前展示</div>
              </td>
              <td>
                <div class="cell">
                  <img :src="img" style="width: 60px;height: 60px;" />
                </div>
              </td>
              <td>
                <div class="cell" v-if="isEditRemark">
                  <el-input type="textarea" :rows="5" placeholder v-model="remark"></el-input>
                </div>
                <div class="cell" v-else>{{ remark }}</div>
              </td>
            </tr>
            <tr>
              <td class="label">
                <div class="cell">操作</div>
              </td>
              <td>
                <div class="cell">
                  <el-upload 
                    :action="uploadActionUrl"
                    accept="image/jpeg,image/gif,image/png"
                    :before-upload="beforeUpload"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :headers="headers"
			              :show-file-list="false"
                  >
                    <el-button type="primary" :loading="uploading">{{ uploading ? '正在上传' : '图片更换' }}</el-button>
                  </el-upload>
                </div>
              </td>
              <td>
                <div class="cell">
                  <el-button type="primary" @click="handleSaveIntro" v-if="isEditRemark">保存</el-button>
                  <el-button type="primary" @click="handleIntroEdit" v-else>文字介绍编辑</el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-row>
    </el-card>

    <el-card class="table-card mt-10">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">{{ currTypeName }}类型管理</span>
        </el-row>
        <el-row class="fr">
          <el-button type="primary" @click="handleBtnAction({}, 'add')">新增</el-button>
          <el-button type="danger" @click="handleMultiDel">删除</el-button>
        </el-row>
      </el-row>
      <app-table
        ref="appTable"
        url="/blockLaw"
        columnType="selection"
        :params="tableParams"
        :columns="columns"
        @selection-change="tableSelect"
      />
    </el-card>
    <app-dialog
      :width="dialogWidth"
      :height="dialogHeight"
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <component
        v-if="dialogVisible"
        :is="dialogComponent"
        :row="dialogForm"
        @submit="formSubmit"
        @cancel="closeDialog"
        ref="dialogComponent"
      />
    </app-dialog>
  </el-row>
</template>

<script>
import { mapActions } from "vuex";
import { Upload } from 'element-ui';
import AppTable from "@/mixins/table";
import AppDialog from "@/mixins/dialog";
import AppTableImgs from '@/components/app-table/lib/imgs'
import AppSearch from "@/mixins/search";
import AppRsText from "@/components/app-table/lib/rsText";
import SYSTEM from '@/utils/system'
export default {
  components: {
    Edit: () => import("./edit"),
    [Upload.name]: Upload
  },
  mixins: [AppTable, AppDialog, AppSearch, AppTableImgs],
  data() {
    return {
      columns: [
        {
          label: "序号",
          field: "index",
          width: 70
        },
        {
          label: "服务类型名称",
          field: "title"
        },
        {
          label: "封面",
          field: "instructionPic",
          width: 100,
          component: AppTableImgs
        },
        {
          label: "价格",
          field: "price"
        },
        {
          label: "展示销量",
          field: "showCount"
        },
        {
          label: "真实销量",
          field: "salesCount"
        },
        {
          label: "操作",
          field: "operate",
          align: "center",
          width: 120,
          type: "button",
          items: ["修改", "删除"],
          on: {
            click: ({ row, index }) => {
              this.handleBtnAction(row, index == 0 ? "edit" : "del");
            }
          }
        }
      ],
      articleType: 21,
      articleTypeItems: [
        { id: 21, name: "日常法律服务" },
        { id: 22, name: "分块法律服务" }
      ],
      tableParams: {
        serviceType: 21,
        category: 2
      },
      currTypeName: "",
      info: {},
      isEditRemark: false,
      uploadActionUrl: SYSTEM.baseUrl + '/applets/lawyer/multiUpload',
      headers: {
        'Authorization':  'Bearer ' + SYSTEM.userToken()
      },
      uploading: false,
      img: "",
      remark: "",
      blockDetail: {}
    };
  },
  watch: {
    articleType(type) {
      this.tableParams = {
        ...this.tableParams,
        serviceType: type,
        category: 2
      };
      
      let obj = {}
      this.articleTypeItems.forEach(item => {
        if (type == item.id) {
          obj = item
        }
      })
      this.currTypeName = obj.name
      this.initService()
    }
  },
  methods: {
    // 初始化页面
    async initPage() {
      this.currTypeName = this.articleTypeItems[0].name;
      this.initService()
    },
    async initService(){
      let dictCode = this.articleType;
      let res = await this.getPlatfomService({dictCode})
      this.img = res.data.image;
      this.remark = res.data.brief;
    },
    // 表单提交
    async formSubmit(form) {
      try {
        if ("id" in form) {
          await this.blockUpdate(form);
          this.closeDialog();
          this.refreshTable();
          this.$msgSuccess("修改成功");
        } else {
          await this.blockAdd(form);
          this.closeDialog();
          this.refreshTable();
          this.$msgSuccess("添加成功");
        }
      } catch (e) {
        // error
      }
    },
    async handleBtnAction(row, type) {
      try {
        switch (type) {
          case "add":
            this.dialogWidth = "600px";
            this.dialogTitle = "新增服务类型";
            this.dialogForm = null;
            this.dialogComponent = "Edit";
            this.dialogVisible = true;
            break;
          case "edit":
            this.dialogWidth = "600px";
            this.dialogTitle = "编辑服务类型";
            this.dialogForm = row;
            this.dialogComponent = "Edit";
            this.dialogVisible = true;
            break;
          case "del":
            await this.$confirm("确认删除选定的服务类型吗?", "温馨提示", {
              type: "warning"
            });
            await this.blockDel(row.id);
            this.$msgSuccess("操作成功！");
            this.refreshTable();
            break;
        }
      } catch (error) {}
    },
    async handleMultiDel() {
      if (this.tableSelected.length) {
        try {
          let ids = this.tableSelected.map(v => v.id).join(",");
          await this.$confirm("确认删除选定的服务类型吗?", "温馨提示", {
            type: "warning"
          });
          await this.blockDel(ids);
          this.$msgSuccess("操作成功！");
          this.refreshTable();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$msgError("请选择需要删除的数据");
      }
    },
    async handleIntroEdit() {
      this.isEditRemark = !this.isEditRemark;
    },
    async handleSaveIntro() {
      this.isEditRemark = !this.isEditRemark;
      this.updateBasicInfo('content')
    },
    //上传之前的事件
    beforeUpload(file) {
        this.uploading = true
    },
    // 上传成功的事件
    handleUploadSuccess(res, file) {
      let fileUrl = res.data || ''
      this.img = fileUrl
      this.uploading = false
      this.updateBasicInfo('image')
    },
    // 上传失败
    handleUploadError() {
      this.uploading = false
      this.$msgError('上传失败，请稍后再试！')
    },
    updateBasicInfo(type){
      let isImage = type === 'image';
      let params = {
        dictCode: this.articleType,
        name: isImage  ? 'image' : 'brief',
        code: isImage ? this.img : this.remark
      }
      this.platformService(params)
    },
    ...mapActions("content", ["blockAdd", "blockUpdate", "blockDel"]),
    ...mapActions("system", ["platformService", "getPlatfomService"])
  },
  created() {
    this.initPage();
  }
};
</script>

<style lang="less">
.block-detail {
  .el-table__body {
    width: 100%;
  }
  .label {
    width: 140px;
    text-align: center;
  }
  .cell {
    padding: 0 10px !important;
  }
  .logo-box {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    margin: 0 auto;
    img {
      width: 100%;
      border-radius: 4px;
    }
  }
  .block-table {
    .label {
      width: 100px;
    }
  }
}
</style>

