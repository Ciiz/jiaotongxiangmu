<template>
<div>
  <Button type="success" icon="md-add" @click="toAdd">新增地址</Button>
  <Table :data="address_list" :columns="columns" :loading="loading"></Table>

  <Modal v-model="modal" :title="title" :width="modal_width" @on-ok="save" okText="保存" :styles="{top: '20px'}" :transition-names="['ease', 'fade']">
    <div>
      <Form :model="address" :label-width="120">
        <FormItem label="地点名称" prop="address">
          <Input v-model="address.address"/>
        </FormItem>
        <FormItem label="经度(longitude,lng)" prop="lng">
          <Input v-model="address.lng"/>
        </FormItem>
        <FormItem label="纬度(latitude,lat)" prop="lat">
          <Input v-model="address.lat"/>
        </FormItem>
        <FormItem label="地图搜索">
          <div style="margin-bottom: 20px">
            关键词:<Input v-model="keyword"  style="width: 150px" placeholder="输入地址搜索" />
            所在城市: <Input v-model="location"  style="width: 150px" placeholder="城市名称" />
          </div>
          <Alert style="margin: 10px 10px;">双击地图或拖动地图中粉红色没字母的标记设置考勤位置。</Alert>
          <baidu-map :center="{lng:address.lng,lat:address.lat}"  @ready="mapReady" :zoom="zoom" @dblclick="handlePositionChange" class="bm-view" ak="2NSf0hRUjyORiH1CDMWPrrlUNE53k8mi">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :showZoomInfo="true"></bm-navigation>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-marker @dragend="handlePositionChange" :position="{lng:address.lng,lat:address.lat}" :dragging="true" :clicking="true" :icon="{url: locationIcon, size: {width: 40, height: 40}}"></bm-marker>
            <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" ></bm-local-search>
          </baidu-map>
        </FormItem>
      </Form>
    </div>
  </Modal>

</div>
</template>
<script>
import { get_address_list, save_address, delete_address } from '@/api/data'
import modal_mixin from '@/view/mixins/modal_mixin'
import locationIcon from '@/assets/images/location.svg'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation, BmCityList, BmGeolocation, BmMarker, BmLabel, BmLocalSearch, bmView, BmInfoWindow } from 'vue-baidu-map'
export default{
  mixins: [modal_mixin],
  components: {
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
  data () {
    return {
      address_list: [],
      address: {
        id: '',
        lng: 113.271429,
        lat: 23.149958,
        address: ''
      },
      zoom: 18,
      locationIcon: locationIcon,
      location: '',
      keyword: '',
      loading: false,
      columns: [
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '经纬度',
          key: 'location',
          render: (h, params) => {
            let row = params.row
            return <div>{row.lng},{row.lat}</div>
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            let row = params.row
            return <div>
              <Button type="primary" size='small' onClick={() => { this.edit(row) }}>修改</Button>
              <Button type="error" size='small' onClick={() => { this.del(row.id) }}>删除</Button>
            </div>
          }
        }

      ]
    }
  },
  methods: {
    getAddressList () {
      this.loading = true
      get_address_list().then(res => {
        if (res.code === 200) {
          this.address_list = res.data.list
          this.$emit('update-list')
        }
        this.loading = false
      })
    },
    mapReady: function ({ BMap, map }) {
      map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      map.disableDoubleClickZoom() // 禁用双击放大
    },
    handlePositionChange: function (e) {
      this.address.lng = e.point.lng
      this.address.lat = e.point.lat
    },
    del (id) {
      delete_address(id).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getAddressList()
        }
      })
    },
    edit (item) {
      let _this = this
      setTimeout(() => {
        _this.address = item
      }, 200)
      this.open('address', '', '编辑地址')
    },
    toAdd () {
      this.address = {
        id: '',
        lng: 113.271429,
        lat: 23.149958,
        address: ''
      }
      this.open('address', '', '新增地址')
    },
    save () {
      const { id, lng, lat, address } = this.address
      save_address({ id, lng, lat, address }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
          this.getAddressList()
        }
      })
    }
  },
  mounted () {
    this.getAddressList()
  }
}
</script>
<style lang="less" scoped>
.bm-view {
    width: 80%;
    height: 500px;
}
</style>
