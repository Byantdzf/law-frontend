<template>
  <el-row class="page-area">
    <el-card class="table-card">
      <el-row slot="header" class="clearfix">
        <el-row class="fl">
          <span class="title">区域设置</span>
        </el-row>
      </el-row>
      <el-row class="page-area-hd">
        <div class="ib page-area-col" v-for="(col, index) in columns" :key="index">
          <span class="pr-20">{{ col }}</span>
        </div>
      </el-row>
      <el-row class="page-area-bd">
        <InfiniteList
          :items="treeList"
          :currentIndex.sync="curCountryIndex"
          :parentId="0"
          type="2"
          level="0"
          showAddBtn
          @change="getCurCountry"
          @listUpdate="handleTreeUpdate"
        />
        <InfiniteList
          :items="cities"
          :currentIndex.sync="curCityIndex"
          :parentId="curCountryId"
          type="2"
          level="2"
          :showAddBtn="!!treeList.length"
          @change="getCurCity"
          @listUpdate="handleTreeUpdate"
        />
        <InfiniteList
          :items="areas"
          :currentIndex.sync="curAreaIndex"
          :parentId="curCityId"
          type="2"
          level="3"
          :showAddBtn="!!cities.length"
          @listUpdate="handleTreeUpdate"
        />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
  import { mapActions } from 'vuex'
  import InfiniteList from './infiniteList'
  
  export default {
    components: {
      InfiniteList
    },
    data() {
      return {
        columns: ['国家（States）', '城市（Citys）', '区域（Area）'],
        treeList: [],
        curCountryIndex: 0,
        curCityIndex: 0,
        curAreaIndex: 0,
      }
    },
    computed: {
      cities() {
        return this.$val(this.treeList, `${this.curCountryIndex}.child`, [])
      },
      areas() {
        return this.$val(this.cities, `${this.curCityIndex}.child`, [])
      },
      curCountryId() {
        return this.$val(this.treeList, `${this.curCountryIndex}.id`)
      },
      curCityId() {
        return this.$val(this.cities, `${this.curCityIndex}.id`)
      }
    },
    methods: {
      getTreeList() {
        this.queryTreeForeign().then(res => {
          this.treeList = res.data || []
        })
      },
      getCurCountry() {
        this.curCityIndex = 0
        this.curAreaIndex = 0
      },
      getCurCity() {
        this.curAreaIndex = 0
      },
      handleTreeUpdate() {
        this.getTreeList()
      },
      ...mapActions('data', [
        'queryTreeForeign',
      ])
    },
    mounted() {
      this.getTreeList()
    },
    destroyed() {}
  }
</script>

<style lang="less">
  .page-area {
    .el-card.table-card .el-card__body {
      padding-bottom: 0;
    }
    .btn {
      cursor: pointer;
    }
  }
  .page-area-hd,
  .page-area-bd {
    line-height: 40px;
    padding: 0 10px;
  }
  .page-area-col {
    width: 20%;
    padding: 0 10px;
    max-width: 300px;
  }
</style>
