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
          :currentIndex.sync="curProvinceIndex"
          :parentId="chinaId"
          type="1"
          level="1"
          showAddBtn
          @change="getCurProvince"
          @listUpdate="handleTreeUpdate"
        />
        <InfiniteList
          :items="cities"
          :currentIndex.sync="curCityIndex"
          :parentId="curProvinceId"
          type="1"
          level="2"
          :showAddBtn="!!treeList.length"
          @change="getCurCity"
          @listUpdate="handleTreeUpdate"
        />
        <InfiniteList
          :items="counties"
          :currentIndex.sync="curCountyIndex"
          :parentId="curCityId"
          type="1"
          level="3"
          :showAddBtn="!!cities.length"
          @listUpdate="handleTreeUpdate"
        />
        <InfiniteList
          :items="towns"
          :currentIndex.sync="curTownIndex"
          :parentId="curCountyId"
          type="1"
          level="4"
          :showAddBtn="!!counties.length"
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
        columns: ['省/自治区/直辖市', '地级市', '市辖区/县/县级市', '乡/镇/街道'],
        treeList: [],
        curProvinceIndex: 0,
        curCityIndex: 0,
        curCountyIndex: 0,
        curTownIndex: 0,
        chinaId: 0
      }
    },
    computed: {
      cities() {
        return this.$val(this.treeList, `${this.curProvinceIndex}.child`, [])
      },
      counties() {
        return this.$val(this.cities, `${this.curCityIndex}.child`, [])
      },
      towns() {
        return this.$val(this.counties, `${this.curCountyIndex}.child`, [])
      },
      curProvinceId() {
        return this.$val(this.treeList, `${this.curProvinceIndex}.id`)
      },
      curCityId() {
        return this.$val(this.cities, `${this.curCityIndex}.id`)
      },
      curCountyId() {
        return this.$val(this.counties, `${this.curCountyIndex}.id`)
      }
    },
    methods: {
      getTreeList() {
        this.queryTreeChina().then(res => {
          this.treeList = res.data || []
        })
      },
      getCurProvince() {
        this.curCityIndex = 0
        this.curCountyIndex = 0
      },
      getCurCity() {
        this.curCountyIndex = 0
      },
      handleTreeUpdate() {
        this.getTreeList()
      },
      ...mapActions('data', [
        'queryTreeChina',
        'queryChinaId'
      ])
    },
    mounted() {
      this.getTreeList()
      this.queryChinaId().then(res => {
        this.chinaId = res.data
      })
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
