<template>
  <div class="map-out pd10">
    <el-form label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址"> {{ allAddress }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经度"> {{ addressObj.longitude }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="纬度"> {{ addressObj.latitude }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div id="container" class="container" ref="container"></div>
  </div>
</template>
<script
  type="text/javascript"
  src="http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=7dzzIS0gdAGNyEAXmlVztlgI6XVlEIpq&services=&t=20211018154739"
></script>

<script>
export default {
  name: "BMap",
  data() {
    return {
      addressObj: {
        province: "",
        city: "",
        district: "",
        street: "",
        streetNumber: "",
        longitude: "",
        latitude: "",
      },
    };
  },
  computed: {
    allAddress() {
      return (
        this.addressObj.province +
        this.addressObj.city +
        this.addressObj.district +
        this.addressObj.street +
        this.addressObj.streetNumber
      );
    },
  },
  created() {
    setTimeout(() => {
      this.renderMap();
    }, 500);
  },
  methods: {
    renderMap() {
      var that = this;
      var map = new window.BMapGL.Map("container"); // 创建Map实例
      map.centerAndZoom(
        new window.BMapGL.Point(118.80806218588357, 32.063274569836686),
        12
      ); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

      // var local = new window.BMapGL.LocalSearch(map, {
      //   renderOptions: { map: map }
      // })
      // local.search('景点')

      // 实例化地图
      var geoc = new window.BMapGL.Geocoder();
      map.addEventListener("click", function (e) {
        // 清除地图上所有的覆盖物
        map.clearOverlays();

        that.addressObj.longitude = e.latlng.lng;
        that.addressObj.latitude = e.latlng.lat;
        // console.log(e)
        var pt = e.latlng;
        var marker = new window.BMapGL.Marker(
          new window.BMapGL.Point(pt.lng, pt.lat)
        );
        map.addOverlay(marker);
        geoc.getLocation(pt, function (rs) {
          var addComp = rs.addressComponents;
          that.addressObj.province = addComp.province;
          that.addressObj.city = addComp.city;
          that.addressObj.district = addComp.district;
          that.addressObj.street = addComp.street;
          that.addressObj.streetNumber = addComp.streetNumber;
          that.$emit("getLocation", that.addressObj);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map-out {
  width: 600px;
  height: 700px;
}
.container {
  height: 100%;
  width: 100%;
  border: 1px solid red;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0;
}
</style>
