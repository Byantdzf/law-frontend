<template>
  <AppLazyLoad
   class="app-table"
   :id="elnid"
   :data="columns"
   :tips="$t('text.loading')"
  >
    <el-table
      ref="elTable"
      :data="list"
      v-bind="tableBind"
      v-on="$listeners"
      highlight-current-row
      @selection-change="selectChange"
      @sort-change="sortChange"
    >
      <slot>
        <template v-if="list.length">
          <template v-for="tp in typesColumns">
            <el-table-column
              v-if="tp.type === 'expand'"
              v-bind="tp.props"
              type="expand"
              :key="tp.type"
            >
              <template slot-scope="props">
                <slot name="expand" v-bind="props"></slot>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :label="`${ tp.type == 'index' ? $t('text.index') : '' }`"
              :key="tp.type"
              :type="tp.type"
              v-bind="tp.props"
            >
            </el-table-column>
          </template>
        </template>
        <app-table-column v-for="col in renderColumns" :key="col.prop" :col="col"/>
      </slot>
      <template v-if="$slots && $slots.append" slot="append">
        <slot name="append"></slot>
      </template>
    </el-table>
    <el-pagination
      v-if="total"
      class="ta-r"
      v-bind="defaultPagination"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="tableParams.rows"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </AppLazyLoad>
</template>

<script>
  import { Table, TableColumn, Pagination } from 'element-ui'
  import { cloneDeep, isArray, isNumber, isPlainObject, isFunction } from 'lodash-es'
  import AppLazyLoad from "@/components/app-lazy-load"
  import AppTableColumn from '../lib/tableColumn'
  import Text from '../lib/text'
  import Button from '../lib/btn'
  import methods from './methods'
  import { get } from '@/utils/xhr'
  import { getTreeData } from '@/utils/tools'
  import Hash from '@/mixins/hash'

  const BOOLEAN_KEYS = [
    'fit',
    'stripe',
    'border',
    'show-header',
    'highlight-current-row',
    'default-expand-all',
    'show-summary'
  ]

  const TYPES = ['selection', 'expand', 'index']

  const COLUMN_KEY_MAP = {
    label: 'label',
    prop: 'field'
  }

  const PAGE_KEY = 'pageNo'
  const SIZE_KEY = 'pageSize'

  let vmCount = 0

  export default {
    name: 'app-table',
    components: {
      AppLazyLoad,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [AppTableColumn.name]: AppTableColumn,
      [Pagination.name]: Pagination
    },
    mixins: [methods, Hash],
    props: {
      columns: [String, Array],
      columnType: [String, Array],
      columnTypeProps: {
        type: Object,
        default() {
          return {
            selection: {
              width: 55
            },
            index: {
              width: 60
            }
          }
        }
      },
      columnKeyMap: Object,
      columnsProps: {
        type: Object,
        default() {
          return {
            minWidth: 100
          }
        }
      },
      columnsSchema: Object,
      columnsHandler: Function,
      theaderSchema: Object,
      isReady: {
        type: Boolean,
        default: true
      },
      params: Object,
      pageSizes: {
        type: Array,
        default () {
          return [10, 20, 30, 40, 50]
        }
      },
      url: String,
      radio: Boolean,
      dataFormater: Function,
      listKey: {
        type: String,
        default: 'list'
      },
      totalKey: {
        type: String,
        default: 'totalRow'
      },
      pagination: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      const _dp = {
        background: true,
        layout: "total, prev, pager, next, sizes, jumper"
      }
      return {
        defaultPagination: { ..._dp, ...this.pagination },
        currentPage: 1,
        total: 0,
        list: [],
        selected: [],
        defaultParams: {
          [PAGE_KEY]: 1,
          [SIZE_KEY]: 10,
        },
        otherParams: {},
        elnid: `app-table__${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
        pageHashKey: '',
        rowsHashKey: ''
      }
    },
    computed: {
      // 处理 $attrs 里面 Boolean 类型的 prop 和统一 prop 命名 
      tableBind() {
        const { $attrs } = this
        const bind = {}

        Object.keys($attrs).forEach(key => {
          const v = $attrs[key]
          const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase()
          bind[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v
        })

        return bind
      },
      resColumns() {
        const map = Object.assign({}, COLUMN_KEY_MAP, this.columnKeyMap)
        const schema = Object.assign({}, this.theaderSchema)
        const columns = cloneDeep(this.columns).map(v => {
          for(let key in schema) {
            schema[key].includes(v[map.prop]) && (v.parentId = key)
          }
          v.id = v[map.prop]

          return v
        })

        return columns
      },
      renderColumns() {
        const {
          resColumns: columns,
          columnKeyMap,
          columnsHandler,
          columnsProps: props,
          columnsSchema: schema
        } = this
        const map = Object.assign({}, COLUMN_KEY_MAP, columnKeyMap)

        for(let key in schema) {
          if(~key.indexOf(',')) {
            key.split(',').forEach(v => {
              schema[v] = Object.assign({}, schema[key], schema[v])
            })
            delete schema[key]
          }
        }
        
        const renderColumns = getTreeData(columns.map(col => {
          const mix = schema && schema[col[map.prop]] || {}
          const it = Object.assign({}, {
            component: col.type === 'button' ? Button : Text
          }, props, col, mix)

          it.label = it[map.label]
          it.prop = it[map.prop]
          
          return it
        }))

        return columnsHandler && columnsHandler(renderColumns) || renderColumns
      },
      // 用于渲染特殊列
      typesColumns() {
        const { columnType: type, columnTypeProps } = this
        let typeColums = []

        if (typeof type === 'string' && ~TYPES.indexOf(type)) {
          typeColums = [type]
        }
        if (Array.isArray(type)) {
          typeColums = type.filter(it => ~TYPES.indexOf(it))
        }

        const map = columnTypeProps || {}
        
        if(this.radio && map['selection']) {
          map['selection']['label-class-name'] = 'radio'
        }

        return typeColums.map(type => {
          return {
            type,
            props: map[type]
          }
        })
      },
      queryParams() {
        let { query = {} } = this.$route
        let params = {}

        if(query[this.pageHashKey]) {
          params[PAGE_KEY] = Number(query[this.pageHashKey])
        }
        if(query[this.rowsHashKey]) {
          params[SIZE_KEY] = Number(query[this.rowsHashKey])
        }
        // console.log(query, params)
        return params
      },
      tableParams() {
        return Object.assign({}, this.defaultParams, this.otherParams, this.queryParams, this.params)
      }
    },
    watch: {
      url() {
        this.getList()
      },
      params: {
        handler: function(newval) {
          if (!newval[PAGE_KEY]) {
            this.setLocationQuery(this.pageHashKey, 1)
          }
        },
        deep: true
      },
      tableParams: {
        handler: function(newval) {
          this.currentPage = newval[PAGE_KEY]
          this.isReady && this.getList()
        },
        deep: true
      }
    },
    methods: {
      // 列表条数改变
      handleSizeChange(val) {
        this.setLocationQuery(this.rowsHashKey, val)
        this.$emit('handleSizeChange', val)
      },
      // 列表当前页改变
      handleCurrentChange(val) {
        this.setLocationQuery(this.pageHashKey, val)
        this.$emit('handleCurrentChange', val)
      },
      // 列表选择改变
      selectChange(values) {
        this.selected = values;
        if(this.radio && values.length > 1) {
          let table = this.$refs.elTable
          table.toggleRowSelection(values[0], false)
          this.$emit('selection-change', values.shift())
        }else {
          this.$emit('selection-change', values)
        }
      },
      // 排序
      sortChange({ prop, order }) {
        const sortFields = this.resColumns.filter(v => v.sortable).map(v => v.field)

        sortFields.forEach(v => {
          delete this.otherParams[v]
        })

        if (order) {
          this.$set(this.otherParams, prop, order)
        } else {
          this.otherParams = {}
        }
      },
      // 获取表体数据
      async getList() {
        try {
          let params = { ...this.tableParams }
  
          for(let key in params) {
            ((!isNumber(params[key]) && !params[key]) || !~params[key]) && (delete params[key])
          }

          const res = await get(this.url, params)
          const data = res.data || {}

          if(isPlainObject(data)) {
            this.list = data[this.listKey] || []
          } else {
            this.list = data || []
          }

          this.list.forEach((v, i) => {
            const idx = (params[PAGE_KEY] - 1) * params[SIZE_KEY] + i + 1
            v.index = v.index || idx
          });

          if(isFunction(this.dataFormater)) {
            const arr = this.dataFormater([...this.list])

            if(isArray(arr)) {
              this.list = arr
            }
          }

          this.total = data[this.totalKey]

          this.pagerLimit()

          this.$emit('dataReady', {
            list: this.list,
            total: this.total,
            currentPage: this.currentPage,
            res
          })
        } catch (error) {
          this.$emit('dataReady', {
            list: [],
            total: 0,
            currentPage: 1,
            error
          })
        }
      },
      // 更新列表
      updateList(index, row) {
        this.$set(this.list, index, { ...row })
      },
      toggleRowSelection(row, selected) {
        this.$nextTick(() => {
          this.$refs.elTable.toggleRowSelection(row, selected)
        })
      },
      // 获取数据
      getData() {
        return {
          list: this.list,
          total: this.total,
          selected: this.selected,
          currentPage: this.currentPage
        }
      },
      // 过滤掉小数点和超过范围的输入
      pagerLimit(rows = this.tableParams[SIZE_KEY], total = this.total) {
        this.pageInput = document.querySelector(`#${this.elnid} .el-pagination__editor input`)
        if (this.pageInput) {
          this.pageInput.onkeyup = function (ev) {
            if (this.value > Math.ceil(total / rows)) {
              this.value = Math.ceil(total / rows)
            }
            if (ev.keyCode == 110 || ev.keyCode == 190) {
              let val = this.value
              this.value = ''
              this.value = val
              return
            }
          }
        }
      }
    },
    mounted() {
      vmCount ++
      this.pageHashKey = `t${ vmCount }_page`
      this.rowsHashKey = `t${ vmCount }_rows`
    },
    destroyed() {
      this.removeLocationQuery([this.pageHashKey, this.rowsHashKey])
      vmCount --
    }
  }
</script>

<style lang="less">
  .app-table {
    .el-pagination {
      padding: 0 20px;
      margin-top: 20px;
    }
    .el-pagination__jump {
      margin-left: 0;
    }
    .el-table__header {
      .el-table-column--selection {
        .radio {
          width: 0;
          height: 0;
          overflow: hidden;
        }
      }
    }
    .app-table-btns {
      .el-link + .el-link {
        margin-left: 10px;
      }
    }
    .app-table-imgs {
      line-height: 1;
      .el-image {
        width: 40px;
        height: 40px;
      }
    }
  }
</style>
