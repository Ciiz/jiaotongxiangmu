<template>
  <div>
    <Row>
      <Button type="primary" @click="add">添加热点</Button>
    </Row>
    <Table :data="value" :columns="columns"></Table>
    <Modal v-model="modal" :title="title" :mask-closable='false'>
      <Form :modal="hotspot" :label-width="100">
        <FormItem label="热点类型">
          <RadioGroup v-model="hotspot.type" @on-change="handleTypeChange">
            <Radio :label="item.value" v-for="item in typeList" :key="item.value">{{item.label}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="热点名称" >
          <Input v-model="hotspot.name"></Input>
        </FormItem>
        <FormItem label="水平坐标">
          <Input v-model="hotspot.ath"></Input>
        </FormItem>
        <FormItem label="垂直坐标">
          <Input v-model="hotspot.atv"></Input>
        </FormItem>
        <FormItem label="热点图标地址">
          <ImageUpload
            v-model="hotspot.iconurl"
            :extra="{type: 'pano',token:$store.state.user.token}"
          >
          </ImageUpload>
        </FormItem>
        <FormItem label="热点地址" v-if="['url','image','video'].indexOf(hotspot.type)!==-1">
          <Input v-model="hotspot.type_url" v-if="hotspot.type === 'url'"></Input>
          <FileUpload
            :fileObj="{url: hotspot.type_url, name: ''}"
            @on-change="(file)=>{hotspot.type_url = file.url;}"
            :extra="{type: hotspot.type === 'video' ?'pano.video':'pano.hot_spot_img',token:$store.state.user.token}"
            :format="hotspot.type === 'video' ? ['mp4','mp3']: ['jpg','jpeg','png','gif']"
          >
          </FileUpload>
        </FormItem>
        <FormItem label="场景名称" v-if="hotspot.type === 'switch'">
          <RadioGroup v-model="hotspot.switch_scene">
            <Radio v-for="item in sceneList" :key="item.scene" :label="item.scene">{{item.title}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="热点内容" v-if="hotspot.type==='text'">
          <Input type="textarea" v-model="hotspot.content"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  mixins: [modal_mixin],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    sceneList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      hotspot: {
        name: `hotspot_${this._uid}`, // 热点名称,
        ath: 0, // 热点坐标水平 未设置时默认值0 (number),
        atv: 0, // 热点坐标垂直 未设置时默认值0 (number),
        iconurl: '/item/hotspotimg/hotspot.png', // 热点图标地址,
        type: 'switch', // 热点类型 ： switch / text / image / url / video,
        type_url: '', // 热点地址/只有type为url,image,video时才有值，其他值为空,
        switch_scene: '', // 切换的场景名称/只有type为switch时才有值，其他值为空,
        content: '' // 热点内容/只有type为text时才有值，其它值为空
      },
      typeList: [
        {
          value: 'switch',
          label: '场景切换'
        },
        {
          value: 'image',
          label: '图片'
        },
        {
          value: 'url',
          label: '链接'
        },
        {
          value: 'video',
          label: '视频'
        },
        {
          value: 'text',
          label: '文字'
        }
      ],
      columns: [
        {
          title: '热点名称',
          key: 'name'
        },
        {
          title: '热点类型',
          key: 'type',
          render: (h, params) => {
            return (
              <div>
                {params.row.type === 'switch' ? '场景切换' : params.row.type === 'text' ? '文本展示' : params.row.type === 'image' ? '图片展示' : params.row.type === 'url' ? '网址链接' : params.row.type === 'video' ? '视频音频' : ''}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return (
              <div>
                <Button type="error" onClick={() => { this.del(params.index) }}>删除</Button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    del (index) {
      this.$emit('on-delete', index)
    },
    add () {
      this.open('', '', '添加热点')
    },
    handleTypeChange (type) {
      this.hotspot = {
        name: '',
        ath: 0,
        atv: 0,
        iconurl: '/item/hotspotimg/hotspot.png',
        type: type,
        type_url: '',
        switch_scene: '',
        content: ''
      }
    },
    save () {
      this.$emit('add-hotspot-success', this.hotspot)
      this.hotspot = {
        name: '',
        ath: 0, //
        atv: 0,
        iconurl: '/item/hotspotimg/hotspot.png',
        type: 'image',
        type_url: '',
        switch_scene: '',
        content: ''
      }
      this.modal = false
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">

</style>
