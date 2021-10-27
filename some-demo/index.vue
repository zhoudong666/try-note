<template>
  <div class="app-container">
    <!-- <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="Display_time"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table> -->
    <ttt border :columns="columns" :data="list2">
      <template slot="hobby" slot-scope="scope">
        <el-button slot="hobby" style="color:red;" :dddd="scope.data.row.hobby">{{scope.data.row.hobby}}</el-button>
      </template>
    </ttt>
  </div>
</template>

<script>
import { getList } from '@/api/table'

import ttt from '@/components/ttt'

export default {
  components: {
    ttt,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,



      // __slotName 用来指定作用域插槽
      // __children 用来指定多表头
      columns: [
        { type: 'index', width: '55', isIndex:true, label:'序号',align: 'center' },
        { type: 'selection', width: '55', align: 'center' },
        { label: '姓名', prop: 'name', align: 'center' },
        { label: '年龄', prop: 'age', align: 'center' },
        { label: '爱好', prop: 'hobby', align: 'center' ,__slotName: 'hobby'},
        { label: '学历', prop: 'education', align: 'center' ,__children:[
                  { label: '籍贯', prop: 'nativePlace', align: 'center' },
        { label: '备注', prop: 'remark', align: 'left', width: 200 },
        ]},

      ],
      list2: [
        { name: 'a1',
          age: 11,
          hobby: 'aa1',
          education: '大學1',
          nativePlace: '中國1',
          remark: 'remark1'
        },
        { name: 'a2',
          age: 22,
          hobby: 'bb2',
          education: '大學2大學2大學2大學2大學2大學2大學2大學2',
          nativePlace: '中國2',
          remark: 'remark2'
        },
        { name: 'a3',
          age: 33,
          hobby: 'cc3',
          education: '大學3',
          nativePlace: '中國3',
          remark: 'remark3'
        },
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then((response) => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
  },
}
</script>
