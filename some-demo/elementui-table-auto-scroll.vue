<!--
 * @Description: 
 * @Author: lzp
 * @Date: 2021-04-06 15:58:13
 * @LastEditTime: 2021-04-08 14:30:46
 * @LastEditors: xxx
-->
<template>
  <div class="main">
    <div class="setbox">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" size="small" label-width="px" label-position="left">
          <el-col :span="23">
            <el-form-item label-width="110px" label="数据刷新（秒）">
              <el-input-number v-model="formData.refreshTime" placeholder="单位/s" :step="1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="110px" label="滚动时间）">
              <el-input-number v-model="formData.rollTime" placeholder="单位/10ms" :step="1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="110px" label="滚动间距">
              <el-input-number v-model="formData.rollPx" placeholder="单位/px" :step="1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large">
              <el-button type="primary" @click="applyForm" size="mini">应用</el-button>
              <el-button @click="resetForm" size="mini">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div class="title1">
      <span>
        项目名称：
        <span class="xmmc">{{topInfo.项目名称}}</span>
      </span>
      <span>
        项目编码：
        <span>{{topInfo.项目编码}}</span>
      </span>
    </div>
    <div class="title2">
      <span class="title2_tip">
        组装:
        <span>{{topInfo.组装完成度}}%</span>
      </span>
      <span class="title2_tip">
        调试:
        <span>{{topInfo.调试完成度}}%</span>
      </span>
      <span class="title2_tip">
        项目负责人:
        <span>{{topInfo.项目负责人}}</span>
      </span>
      <span class="title2_tip">
        市场负责人:
        <span>{{topInfo.市场负责人}}</span>
      </span>
      <span class="title2_tip">
        出货日期:
        <span>{{topInfo.出货日期}}</span>
      </span>
      <span class="title2_tip">
        搬入日期:
        <span>{{topInfo.搬入日期}}</span>
      </span>
    </div>
    <el-table
      :data="jdrwInfo"
      height="100%"
      border
      style="width: 100%"
      v-show="autoPlay"
      ref="rw_table"
      @mouseenter.native="mouseEnter"
      @mouseleave.native="mouseLeave"
    >
      <el-table-column prop="JDRW_FZR_NAME" label="负责人"></el-table-column>
      <el-table-column prop="JDRW_RWMS" label="任务描述"></el-table-column>
      <el-table-column prop="JDRW_RWLX_NAME" label="项目阶段"></el-table-column>
      <el-table-column prop="JDRW_KSRQ" label="开始时间"></el-table-column>
      <el-table-column prop="JDRW_JSRQ" label="结束时间"></el-table-column>
      <el-table-column prop="JDRW_JD" label="进度"></el-table-column>
      <el-table-column prop="JDRW_WCQK" label="完成情况"></el-table-column>
    </el-table>
    <el-table
      :data="wtmxInfo"
      height="100%"
      border
      ref="wt_table"
      style="width: 100%"
      v-show="!autoPlay"
      @mouseenter.native="mouseEnter"
      @mouseleave.native="mouseLeave"
    >
      <el-table-column prop="WTFK_WTMS" label="问题描述"></el-table-column>
      <el-table-column prop="WTFK_XMDJLX_NAME" label="类型"></el-table-column>
      <el-table-column prop="WTFK_WTZT_NAME" label="状态"></el-table-column>
      <el-table-column prop="SY_PREAPPROVUSERNAMES" label="执行人"></el-table-column>
      <el-table-column prop="WTFK_JJR_NAME" label="解决人"></el-table-column>
      <el-table-column prop="WTFK_WTJJSJ" label="计划"></el-table-column>
      <el-table-column prop="SY_CREATEUSERNAME" label="登记人"></el-table-column>
      <el-table-column prop="SY_CREATETIME" label="登记"></el-table-column>
    </el-table>
  </div>
</template>

<script>
let rolltimer = '' // 自动滚动的定时任务
let changetimer = '' // 自动切换的定时任务
export default {
  name: 'index',
  data() {
    return {
      jdrwInfo: [],
      topInfo: {},
      wtmxInfo: [],
      // 默认的刷新，滚动时间，滚动间距
      refreshTime: 5,
      rollTime: 5,
      rollPx: 1,
      formData: {
        // 默认的设置
        refreshTime: 5,
        rollTime: 5,
        rollPx: 1,
      },
      autoPlay: true, // 两个表格是否自动切换，默认自动切换，鼠标移入表格停止自动切换
    }
  },
  created() {
    this.getXmInfo()
  },
  mounted() {
    this.autoRoll()
    this.autoChange()
  },
  methods: {
    // 获取数据
    getXmInfo() {
      const that = this
      JE.ajax({
        url: '/je/project/edms/xmgl/xm/getXmInfo',
        // params: { id: 'ST3He4WN6GGv87OGDSw' },
        params: { id: 'uu6MiZ9nFZoUAbTBrUA' },
        success: function (response) {
          var data = JE.getAjaxData(response)
          if (data.success) {
            that.jdrwInfo = data.obj.jdrwInfo
            that.topInfo = data.obj.topInfo[0]
            that.wtmxInfo = data.obj.wtmxInfo
          } else {
            JE.alert('获取数据失败！')
          }
        },
      })
    },
    // 应用自定义设置
    applyForm() {
      this.changeFunc()
      this.$message({
        message: '应用成功！',
        type: 'success',
      })
    },
    // 重置
    resetForm() {
      this.formData = {
        refreshTime: 5,
        rollTime: 5,
        rollPx: 1,
      }
      this.changeFunc()
      this.$message({
        message: '重置成功！',
        type: 'success',
      })
    },
    // 更新应用函数
    changeFunc() {
      this.refreshTime = this.formData.refreshTime
      this.rollTime = this.formData.rollTime
      this.rollPx = this.formData.rollPx
      this.autoRoll(true)
      this.autoChange(true)
      this.autoRoll()
      this.autoChange()
    },
    // 设置自动滚动
    autoRoll(stop) {
      if (stop) {
        clearInterval(rolltimer)
        return
      }

      // 拿到表格挂载后的真实DOM
      const table = this.autoPlay ? this.$refs.rw_table : this.$refs.wt_table
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果
      rolltimer = setInterval(() => {
        // 元素自增距离顶部像素
        divData.scrollTop += this.rollPx
        // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          // 重置table距离顶部距离
          divData.scrollTop = 0
        }
      }, this.rollTime * 10)
    },
    // 设置自动切换
    autoChange(stop) {
      if (stop) {
        clearInterval(changetimer)
        return
      }
      changetimer = setInterval(() => {
        this.autoPlay = !this.autoPlay
        this.autoRoll(true) // 先清除定时器
        this.autoRoll() // 再开启定时器
      }, this.refreshTime * 1000)
    },
    // 鼠标进入
    mouseEnter(time) {
      // 鼠标进入停止滚动和切换的定时任务
      this.autoRoll(true)
      this.autoChange(true)
    },
    // 鼠标离开
    mouseLeave() {
      // 开启
      this.autoRoll()
      this.autoChange()
    },
  },
}
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  width: 80%;
  .setbox {
    width: 19%;
    position: absolute;
    right: 0px;
    top: 27px;
    background-color: #efefef;
  }
  .title1 {
    margin: 10px 15px;
    font-size: 16px;
    color: #000;
    .xmmc {
      margin-right: 40px;
      color: rgb(0, 176, 240);
    }
  }
  .title2 {
    margin-left: 15px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #000;
    .title2_tip {
      margin-right: 20px;
    }
  }
}
</style>
