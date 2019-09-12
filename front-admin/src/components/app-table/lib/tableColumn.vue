<template>
	<el-table-column v-bind="getColBind(col)">
    <template
      v-if="!col.children || !col.children.length"
      slot-scope="scope"
    >
      <component
        :is="col.component"
        v-bind="getCptBind(scope, col)"
        v-on="col.on"
      />
    </template>
    <template v-if="col.children && col.children.length">
      <app-table-column
        v-for="v in col.children"
        :key="v.label"
        :col="v"
      />
    </template>
  </el-table-column>
</template>

<script>
  import { TableColumn } from 'element-ui'
  import { isFunction, merge } from 'lodash-es'
	export default {
    name: 'app-table-column',
    components: {
      [TableColumn.name]: TableColumn
    },
		props: {
			col: Object
    },
    inheritAttrs: false,
		methods: {
			getColBind (col) {
        const bind = Object.assign({}, col)
        const dels = ['component', 'on', 'propsHandler', 'children']

        dels.forEach(v => {
          delete bind[v]
        })

        return bind
      },
      getCptBind ({ row, column }, col) {
        const { field } = col
        const value = row[field]
        const readonly = row.readonly
        const handler = col.propsHandler
        const props = {
          ...col,
          row,
          col,
          column,
          field,
          value,
          readonly
        }
        const _props = isFunction(handler) ? handler(props) : {}

        return merge(props, _props)
      }
		}
	}
</script>