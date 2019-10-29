<template>
  <el-table :data="orderLogList" border style="width: 100%">
    <el-table-column prop="content" label="操作内容" align="center"></el-table-column>
    <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
    <el-table-column prop="operatorName" label="操作者" align="center"></el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn } from "element-ui";
  import { mapActions } from 'vuex'
  export default {
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    props: {
      row: Object
    },
    data(){
      return{
        orderLogList:[]
      }
    },
    created(){
      this.getData();
    },
    methods:{
      getData() {
        this.orderLog({orderId:this.row.id}).then((res)=>{
          this.orderLogList=res.data.dataList;
        });

      },
      ...mapActions('order', ['orderLog']),

    },

  };
</script>