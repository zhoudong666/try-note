<template>
  <el-table-column
    v-bind="item"
    :key="item.prop"
    show-overflow-tooltip> 
      <template v-for="obj in item.__children">
        <my-table-column v-if="obj.__children" :item="obj" v-bind="obj" :key="obj.prop"></my-table-column>
        <el-table-column
          v-else
          :key="obj.prop"
          v-bind="obj"
          show-overflow-tooltip> 
          <template v-if="obj.__slotName" v-slot="scope">
            <slot :name="obj.__slotName" :data="scope"></slot>
          </template>
        </el-table-column>
      </template>
  </el-table-column>
</template>

<script>
import MyTableColumn from './tableColumn'

export default {
 name: 'MyTableColumn',
 components: {
   MyTableColumn
 },
 props: {
   item: {
     type: Object,
     default: () => {}
   }
 }
}
</script>
