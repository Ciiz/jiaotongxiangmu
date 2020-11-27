<template>
  <div class="map-container">
    <div>
      关键词:<Input v-model="keyword" style="width: 150px" placeholder="关键词" />
      所在城市: <Input v-model="location" style="width: 150px" placeholder="所在城市" />
      考勤有效范围:
      <InputNumber v-model="radius" style="width: 80px" placeholder="考勤有效范围" @on-change="handleRangeChange" />米
      地点列表：<Select v-model="address_id" style="width: 200px;" @on-change="handleAddressChange">
        <Option v-for="address in address_list" :key="address.id" :value="address.id">{{address.address}}</Option>
      </Select>
      <Button type="primary" @click="open('address','','考勤地址管理')">考勤地址管理</Button>
      <Alert style="margin: 10px 10px;">双击地图或拖动地图中粉红色没字母的标记设置考勤位置。</Alert>
    </div>
    <baidu-map :center="{lng:lng,lat:lat}" @ready="mapReady" :zoom="zoom" @dblclick="dbclick" class="bm-view"
      ak="2NSf0hRUjyORiH1CDMWPrrlUNE53k8mi">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :showZoomInfo="true"></bm-navigation>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-marker @dragend="dragend" :position="{lng:lng,lat:lat}" :dragging="true" :clicking="true"
        :icon="{url: locationIcon, size: {width: 40, height: 40}}"></bm-marker>
      <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location"></bm-local-search>
    </baidu-map>
    <Modal v-model="modal" :title="title" :width="modal_width">
      <AttendanceAddress v-if="target === 'address'" @update-list="getAddressList"></AttendanceAddress>
    </Modal>
    <Button type="primary" @click="modalClose" class="modalClose">确定</Button>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation, BmCityList, BmGeolocation, BmMarker, BmLabel, BmLocalSearch, bmView, BmInfoWindow } from 'vue-baidu-map'
import locationIcon from '@/assets/images/location.svg'
import { get_address_list } from '@/api/data'
import AttendanceAddress from './attendance_address.vue'
import modal_mixin from '@/view/mixins/modal_mixin'
import { f } from 'tree-table-vue'
export default {
  mixins: [modal_mixin],
  components: {
    AttendanceAddress,
    BaiduMap,
    BmNavigation,
    BmCityList,
    BmGeolocation,
    BmMarker,
    BmLabel,
    BmLocalSearch,
    bmView,
    BmInfoWindow
  },
  props: {
    lng: '',
    lat: '',
    distance_range: 0
  },
  data () {
    return {
      keyword: '',
      location: '',
      radius: this.distance_range,
      zoom: 18,
      locationIcon: locationIcon,
      address_id: '',
      address_list: [],

    }
  },
  methods: {
    modalClose () {
      this.$emit('modalClose', false)
    },
    mapReady: function ({ BMap, map }) {
      map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      map.disableDoubleClickZoom() // 禁用双击放大
      // map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    },
    dragend: function (e) {
      this.handlePositionChange(e.point.lng, e.point.lat, this.distance_range)
    },
    dbclick: function (e) {
      this.handlePositionChange(e.point.lng, e.point.lat, this.distance_range)
    },
    handlePositionChange (lng, lat, distance_range) {
      this.$emit('update:lng', lng)
      this.$emit('update:lat', lat)
      this.$emit('position-change', lng, lat, distance_range)
    },
    handleRangeChange (val) {
      this.$emit('update:distance_range', val)
      this.$emit('position-change', this.lng, this.lat, this.radius)
    },
    getAddressList () {
      get_address_list().then(res => {
        if (res.code === 200) {
          this.address_list = res.data.list
        }
      })
    },
    handleAddressChange (val) {
      let index = this.address_list.findIndex((item) => { return item.id === val })
      let addr = this.address_list[index]
      this.handlePositionChange(addr.lng, addr.lat, this.distance_range)
    }
  },
  mounted () {
    this.getAddressList()
  }
}
</script>
<style scoped lang="less">
.bm-view {
  width: 100%;
  height: 500px;
}
.map-container {
  .modalClose {
    margin-top: 20px;
    margin-left: 890px;
  }
}
</style>
