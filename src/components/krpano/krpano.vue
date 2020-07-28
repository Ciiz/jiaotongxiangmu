<template>
  <div style="width: 100%; height: 100%">
    <div :id="krpano_id" class="pano-container" style="width:100%;height:100%">

      <!-- 场景预览start -->
      <transition name="fade">
        <div class="scene-container" v-show="scenes_preview">
          <div class="item" v-for="(scene,index) in scenes" :key="index" @click="scene_switch(scene.scene,index)">
            <div class="img">
              <img :src="scene.url" alt="">
            </div>
            <div class="text">
              <!-- <h3>{{scene.name}}</h3> -->
              <!-- <p>{{scene.scene}}</p> -->
              <Input v-model="scene.title" v-if="editable"></Input>
              <p v-else>{{scene.title}}</p>
            </div>
          </div>
        </div>
      </transition>
      <!-- 场景预览end -->

      <!-- 功能start -->
      <div class="option-container" v-if="scenes.length>0">
        <div class="btn-base"
          :class="{'btn-music-start': !play_music,'btn-music-stop': play_music}"
          @click="handleMusicPlay()"
        ></div>
        <div class="btn-base btn-vr" @click="handleVrMode()"></div>
        <div class="btn-base"
          :class="{'btn-fullscreen': !fullscreen,'btn-unfullscreen': fullscreen}"
          @click="handleFullscreen()"
        ></div>
        <div class="btn-base btn-preview" @click="scenes_preview = !scenes_preview"></div>
      </div>
      <!-- 功能end -->

    </div>

    <!-- 编辑功能start -->
    <div class="option" v-if="editable">
      <Button type="primary" size="small" @click="to_edit('base_info')">基础</Button>
      <Button type="primary" size="small" @click="to_edit('set_as_default_vision')">设为初始视角</Button>
      <Button type="primary" size="small" @click="to_edit('hotspot')">热点</Button>
      <Button type="primary" size="small" @click="to_edit('special_effect')">特效</Button>
      <Button type="primary" size="small" @click="to_edit('bgm_commentary')">背景乐/音频</Button>
      <Button type="primary" size="small" @click="to_edit('preview')">预览</Button>
      <Button type="success" @click="save">保存</Button>
    </div>
    <!-- 编辑功能end -->

    <Modal v-model="modal" :title="title" width="800" footer-hide :fullscreen="fullscreen">

      <!-- 基础信息 -->
      <div v-if="target === 'base_info'" >
        <Form :modal="pano" :label-width="80">
          <FormItem label="封面">
            <ImageUpload
              v-model="pano.img"
              :extra="{type: 'pano',token:$store.state.user.token}"
            ></ImageUpload>
          </FormItem>
          <FormItem label="全景标题">
            <Input v-model="pano.pano_name"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input type="textarea" v-model="pano.description"></Input>
          </FormItem>
          <FormItem label="排序">
            <InputNumber v-model="pano.sort"></InputNumber>
          </FormItem>
          <FormItem label="开场动画">
            <RadioGroup v-model="update_record.islittleplanet" >
              <Radio :true-value="'yes'" false-value="no"  label="yes">是</Radio>
              <Radio :true-value="'yes'" false-value="no"  label="no">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="自动播放">
            <RadioGroup v-model="update_record.autoplay" >
              <Radio :true-value="'yes'" false-value="no"  label="yes">是</Radio>
              <Radio :true-value="'yes'" false-value="no"  label="no">否</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>

      <!-- 特效 -->
      <SpecialEffect
        v-if="target === 'special_effect'"
        v-model="scenes[cur_scene_index].special_type"
        @on-change="handleSpecialEffectChange"
      ></SpecialEffect>

      <!-- 热点 -->
      <Hotspot
        v-if="target === 'hotspot'"
        v-model="scenes[cur_scene_index].hotspot"
        @on-delete="handleHotspotDelete"
        @add-hotspot-success="handleAddHotspot"
        :sceneList="scenes"
        ></Hotspot>

      <!-- 背景乐/解说 -->
      <div v-if="target === 'bgm_commentary'">
        <Form :label-width="100">
          <FormItem label="背景乐">
            <FileUpload
              :fileObj="scenes[cur_scene_index].bgm"
              @on-change="(file)=>{scenes[cur_scene_index].bgm = file}"
              :extra="{type: 'pano.music',token:$store.state.user.token}"
              :format="['mp3']"
            ></FileUpload>
          </FormItem>
          <FormItem label="解说音乐">
            <FileUpload
              :fileObj="scenes[cur_scene_index].commentary"
              @on-change="(file)=>{scenes[cur_scene_index].commentary = file}"
              :extra="{type: 'pano.music',token:$store.state.user.token}"
              :format="['mp3']"
            ></FileUpload>
          </FormItem>
        </Form>
      </div>

      <!-- 热点内容展示 start-->
      <img :src="target_id" v-if="target === 'image'" width="100%" alt="">
      <video :src="target_id" v-if="target === 'video' && target_id.search(/mp4|avi|rmvb|mkv$/ig) !== -1" controls></video>
      <audio :src="target_id" v-if="target === 'video' && target_id.search(/mp3$/ig) !== -1" controls></audio>
      <div v-html="target_id" v-if="target === 'text'"></div>
      <!-- 热点内容展示 end-->
    </Modal>
    </div>
</template>
<script>
import modal_mixin from './modal_mixin'
import Hotspot from './hotspot'
import SpecialEffect from './special_effect'
import { specialList } from './data'
import { fullScreen, exitFullscreen } from '@/libs/util'
import { course_pano } from '@/api/common'
export default {
  components: {
    Hotspot, SpecialEffect
  },
  mixins: [modal_mixin],
  props: {
    pano_id: '',
    editable: {
      type: Boolean,
      default: true
    },
    styleCls: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      t_id: '',
      vars: {},
      specialList: specialList,
      krpano_id: `krpano_id${this._uid}`,
      play_music: true, // 背景乐、解说播放
      fullscreen: false,
      scenes_preview: true, // 场景预览
      update_record: {
        scene: [
          {
            url: '', // 该场景的缩略图地址
            name: '', // 该场景标题
            scene: '', // 该场景的跳转名称
            hotspot: [], // 该场景热点信息，每创建一个热点push一个新对象
            hlookat: 0, // 全景视图水平坐标
            vlookat: 0, // 全景视图垂直坐标
            special_type: {}, // 该场景是否启用特效，未启用为空字符串
            music_view: {
              bgm: {

              },
              commentary: {

              }
            }, // 该场景背景乐配置
            radar: {}, // 该场景沙盘配置
            is_upload_bgm: false, // 是否上传了bgm
            is_upload_commentary: false // 是否上传了解说音频
          }
        ],
        islittleplanet: 'yes',
        autoplay: 'yes'
      },

      initvars: {}, // xml的初始值(暂时没用)
      krpano: null,
      pano: {}, // 数据
      cur_scene_index: '',
      scenes: []
    }
  },
  watch: {
    pano_id (n, o) {
      this.getInfo()
    }
  },
  methods: {
    to_edit (type) {
      switch (type) {
        case 'base_info': {
          this.open('base_info', '', '基础信息修改')
          break
        }
        case 'special_effect': {
          this.open('special_effect', '', '特效')
          break
        }
        case 'hotspot': {
          this.open('hotspot', '', '热点')
          break
        }
        case 'set_as_default_vision': {
          this.scenes[this.cur_scene_index].hlookat = this.krpano.get('view.hlookat')
          this.scenes[this.cur_scene_index].vlookat = this.krpano.get('view.vlookat')
          this.$Message.success('设置成功')
          break
        }
        case 'bgm_commentary' : {
          this.open('bgm_commentary', '', '背景乐/解说')
          break
        }
        case 'preview': {
          let routeData = this.$router.resolve({
            name: 'pano_preview',
            query: {
              pano_id: this.pano_id,
              pano_type: 'pano'
            }
          })
          window.open(routeData.href, '_blank')
        }
      }
    },
    handleMusicPlay () { // 控制音乐播放
      this.play_music = !this.play_music
      let cur_scene = this.scenes[this.cur_scene_index]
      if (this.play_music) {
        cur_scene.music_view.bgm.playing && this.krpano.call("playsound(bgmsnd,'" + cur_scene.bgm.url + "',0);")
        cur_scene.music_view.commentary.playing && this.krpano.call("playsound(jssnd,'" + cur_scene.commentary.url + "',0);")
      } else {
        this.krpano.call('stopsound(bgmsnd)')
        this.krpano.call('stopsound(jssnd)')
      }
    },
    handleVrMode () {
      this.krpano.call('WebVR.enterVR();')
    },
    handleFullscreen () {
      this.fullscreen = !this.fullscreen
      if (this.fullscreen) {
        fullScreen(`${this.krpano_id}`)
      } else {
        exitFullscreen()
      }
      // this.krpano.set('fullscreen', this.fullscreen)
    },
    handleSpecialEffectChange (special_effect) {
      let name = 'snow'
      if (!special_effect) {
        this.krpano.call('removeplugin(' + name + ')')
        return
      }
      if (special_effect.value !== undefined && special_effect.value !== '') {
        this.krpano.call(`removeplugin(${name})`)
        this.krpano.call("addplugin('" + name + "')")
        this.krpano.set('plugin[' + name + '].url', `${this.fileDomain}/pano/plugins/snow.js`)
        this.krpano.set('plugin[' + name + '].alturl', `${this.fileDomain}/pano/plugins/snow.swf`)
        this.krpano.set('plugin[' + name + '].floor', '1')
        this.krpano.set('plugin[' + name + '].zorder', '1')
        this.krpano.set('plugin[' + name + '].mode', 'image')
        this.krpano.set('plugin[' + name + '].imageurl', `${this.fileDomain}/pano/item/action_img/${special_effect.value}.png`)
        this.krpano.set('plugin[' + name + '].speed', special_effect.speed)
        this.krpano.set('plugin[' + name + '].flakes', special_effect.flakes)
        this.krpano.set('plugin[' + name + '].shake', special_effect.shake)
        this.krpano.set('plugin[' + name + '].imagescale', special_effect.imagescale)
        this.krpano.set('plugin[' + name + '].wind', special_effect.wind)
        this.krpano.set('plugin[' + name + '].winddir', special_effect.winddir)
      } else {
        this.krpano.call('removeplugin(' + name + ')')
      }
    },
    handleHotspotDelete (hotspot_index) {
      let hotspot_name = this.scenes[this.cur_scene_index].hotspot[hotspot_index].name
      this.krpano.call('removehotspot("' + hotspot_name + '")')
      this.scenes[this.cur_scene_index].hotspot.splice(hotspot_index, 1)
    },
    handleAddHotspot (hotspot) {
      this.addHotspot(hotspot)
      this.scenes[this.cur_scene_index].hotspot.push(hotspot)
    },
    addHotspot (hotspot) {
      let _this = this
      // 添加热点
      if (hotspot.ath === 0) {
        hotspot.ath = this.krpano.get('view.hlookat')
      }
      if (hotspot.atv === 0) {
        hotspot.atv = this.krpano.get('view.vlookat')
      }
      let hotspot_name = hotspot.name
      this.krpano.call('addhotspot(' + hotspot_name + ');')
      this.krpano.set('hotspot["' + hotspot_name + '"].url', hotspot.iconurl)
      this.krpano.set('hotspot["' + hotspot_name + '"].ath', `${hotspot.ath}`)
      this.krpano.set('hotspot["' + hotspot_name + '"].atv', `${hotspot.atv}`)
      this.krpano.set('hotspot["' + hotspot_name + '"].width', '50')
      this.krpano.set('hotspot["' + hotspot_name + '"].height', '50')
      this.editable && this.krpano.call('set(hotspot[' + hotspot_name + '].ondown,draghotspot();)') // 热点可以拖拽移动
      this.krpano.set('hotspot[' + hotspot_name + '].onloaded', 'add_all_the_time_tooltip_for_VR();') // 热点设置文本框
      this.krpano.call('set(hotspot[' + hotspot_name + '].text,' + hotspot_name + ');') // 设置文本框显示内容
      this.krpano.set('hotspot[' + hotspot_name + '].onup', function () { // 鼠标松开·事件
        for (let i in _this.scenes[_this.cur_scene_index].hotspot) {
          let spot = _this.scenes[_this.cur_scene_index].hotspot[i]
          if (spot.name === _this.krpano.get('hotspot[' + hotspot_name + '].name')) {
            _this.scenes[_this.cur_scene_index].hotspot[i].ath = _this.krpano.get('hotspot[' + hotspot_name + '].ath')
            _this.scenes[_this.cur_scene_index].hotspot[i].atv = _this.krpano.get('hotspot[' + hotspot_name + '].atv')
          }
        }
      })

      _this.krpano.set('hotspot[' + hotspot_name + '].onclick', function () {
      // 添加点击事件
        switch (hotspot.type) {
          case 'switch': {
            let index = _this.getIndexByScene(hotspot.switch_scene)
            _this.scene_switch(hotspot.switch_scene, index)
            break
          }
          case 'image': {
            _this.open('image', hotspot.type_url)
            break
          }
          case 'url': {
            window.open(hotspot.type_url)
            break
          }
          case 'text': {
            _this.open('text', hotspot.content)
            break
          }
          case 'video': {
            _this.open('video', hotspot.type_url)
            break
          }
        }
      })
    },
    getIndexByScene (scene) {
      for (let i = 0; i < this.scenes.length - 1; i++) {
        if (this.scenes[i].scene === scene) {
          return i
        }
      }
      return 0
    },
    getInfo () {
      let _this = this
      course_pano(this.pano_id).then(res => {
        if (res.code === 200) {
          this.t_id = res.data.pano.id
          this.pano = res.data.pano
          if (this.pano.update_record) {
            this.pano.update_record = JSON.parse(this.pano.update_record)
            this.update_record = this.pano.update_record
            this.scenes = this.update_record.scene
          }
          let krpanoSWFObject = document.getElementById('krpanoSWFObject')
          if (krpanoSWFObject !== null) {
            krpanoSWFObject.parentNode.removeChild(krpanoSWFObject)
          }
          let head = document.getElementsByTagName('head')[0]
          let script = document.createElement('script')
          script.setAttribute('type', 'text/javascript')
          script.setAttribute('src', `${this.fileDomain}/pano/item/${_this.pano.item_name}/tour.js`) // JS文件的路径,必须
          head.appendChild(script)
          script.onload = () => {
            embedpano({
              swf: `${this.fileDomain}/pano/item/${_this.pano.item_name}/tour.swf`, // krpano全景图的swf文件路径  url占位符 :%SWFPATH% 的路径，不使用也不能删除
              xml: `${this.fileDomain}/pano/item/${_this.pano.item_name}/tour.xml`, // krpano全景图的xml文件路径
              target: _this.krpano_id,
              html5: 'auto',
              vars: _this.vars,
              initvars: _this.initvars,
              basepath: _this.baseUrl,
              onready: function (krpano) {
                _this.krpano = krpano
                _this.update_record.islittleplanet === 'yes' && _this.krpano.call('skin_view_littleplanet')
                setTimeout(() => {
                  krpano.set(`contextmenu.item[0].caption`, '英途信息')
                  krpano.set(`contextmenu.item[0].enabled`, 'false')
                  krpano.set(`contextmenu.item[1].caption`, '')
                  krpano.set(`contextmenu.item[2].caption`, '更改控制方向')
                  krpano.set(`contextmenu.item[3].caption`, '正常视角')
                  krpano.set(`contextmenu.item[4].caption`, '鱼眼视角')
                  krpano.set(`contextmenu.item[5].caption`, '立体视角')
                  krpano.set(`contextmenu.item[6].caption`, '建筑视角')
                  krpano.set(`contextmenu.item[7].caption`, '帕尼尼视角')
                  krpano.set(`contextmenu.item[8].caption`, '小行星视角')
                  krpano.set(`contextmenu.versioninfo`, 'false')
                  krpano.set(`contextmenu.fullscreen`, 'false')
                  krpano.set('autorotate.speed', '3') // 調整自動播放的速度
                  _this.update_record.autoplay === 'yes' && _this.krpano.set('autorotate.enabled', true)
                  var scene_count = _this.krpano.get('scene.count')
                  if (_this.scenes.length === 0) { // 新建的全景没有update_record
                    for (let i = 0; i < scene_count; i++) {
                      let thumburl = _this.krpano.get('scene[' + i + '].thumburl')
                      let name = _this.krpano.get('scene[' + i + '].title')
                      let scene = _this.krpano.get('scene[' + i + '].name')
                      _this.scenes.push({
                        url: thumburl, // 该场景的缩略图地址
                        name, // 该场景标题
                        title: '未命名', // 该场景标题
                        scene: scene, // 该场景的跳转名称
                        hotspot: [], // 该场景热点信息，每创建一个热点push一个新对象
                        hlookat: 0, // 全景视图水平坐标
                        vlookat: 0, // 全景视图垂直坐标
                        special_type: {
                          label: '',
                          value: '',
                          speed: 1,
                          shake: 1,
                          flakes: 1,
                          imagescale: 1,
                          wind: 0,
                          windir: 0
                        }, // 该场景是否启用特效，未启用为空字符串
                        music_view: {
                          bgm: {
                            playing: false
                          },
                          commentary: {
                            playing: false
                          }
                        }, // 该场景背景乐配置
                        radar: {}, // 该场景沙盘配置
                        is_upload_bgm: false, // 是否上传了bgm
                        is_upload_commentary: false // 是否上传了解说音频
                      })
                    }
                  }
                  setTimeout(() => {
                    _this.update_record.islittleplanet === 'yes' && _this.krpano.call('skin_view_normal') // 小行星视角切入正常视角，过渡效果：旋转切换 normalview
                    // _this.krpano.call('skin_view_normal') // 小行星开场后切换到正常视角
                  }, 3000)
                  setTimeout(() => {
                    _this.scene_switch(_this.scenes[0].scene, 0)
                  }, 100)
                }, 4000)
              },
              onerror: function (err) {
                console.error(err)
              }
            })
          }
        }
      })
    },
    scene_switch (scene, index) {
      this.cur_scene_index = index
      let cur_scene = this.scenes[index]
      this.krpano.call('loadscene(' + scene + ', null, MERGE,' + this.krpano.get('blendmodes[zoom-blend].blend') + ')')
      // 停止上一场景的背景乐
      this.krpano.call('stopsound(bgmsnd)')
      this.krpano.call('stopsound(jssnd)')
      // 播放背景乐
      if (cur_scene.bgm) this.krpano.call("playsound(bgmsnd,'" + cur_scene.bgm.url + "',0);")
      if (cur_scene.commentary) this.krpano.call("playsound(bgmsnd,'" + cur_scene.commentary.url + "',0);")
      // 设置初始视角
      this.krpano.set('view.hlookat', cur_scene.hlookat)
      this.krpano.set('view.vlookat', cur_scene.vlookat)
      // 加热点
      cur_scene.hotspot.forEach(item => {
        this.addHotspot(item)
      })
      // 加载特效
      this.handleSpecialEffectChange(cur_scene.special_type) // 加载特效
    },
    save () {
      let ur = JSON.stringify({
        scene: this.scenes,
        islittleplanet: this.update_record.islittleplanet,
        autoplay: this.update_record.autoplay
      })
      this.axios.request({
        method: 'post',
        url: 'index.php/Teacher/Pano/update',
        params: { id: this.pano.id },
        data: {
          id: this.pano.id,
          update_record: ur,
          pano_name: this.pano.pano_name,
          img: this.pano.img,
          sort: this.pano.sort,
          description: this.pano.description,
          video_url: this.pano.video_url
        }
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.message)
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  },
  destroyed () {
    // 页面关闭时关闭背景乐和解说
    this.krpano.call('stopsound(bgmsnd)')
    this.krpano.call('stopsound(jssnd)')
  }
}
</script>
<style lang="less">
#krpanoSWFObject>div:nth-of-type(2){
  display: none;
}
.pano-container{
  width: 1400px;
  height: 700px;
  margin: 0 auto;
  position: relative;
}
.option{
  margin-top: 10px;
  text-align: center;
  .ivu-btn{
    margin: 5px;
  }
}
.scene-container{
    position: absolute;
    z-index: 10000;
    width: 100%;
    bottom: 0;
    justify-content: center;
    background: rgba(5,4,5,0.2);
    display: flex;
    justify-content: center;

    .item{
      width: 200px;
      margin: 5px 10px;
      cursor: pointer;
      .img{
        height: 100px;
        overflow: hidden;
      }
      .text{
        padding: 0px 10px;
        margin-top:10px;
        text-align:center;
        color:#f5f5f5;
      }
      &:hover{
        box-shadow: 1px 2px 5px #fff;
        transition: all 0.4s;
      }
    }
}

.option-container{
  position: absolute;
  z-index: 10000;
  width: 60px;
  top: 30%;
  left: 20px;
  display: flex;
  flex-direction: column;
  .btn-base{
    width: 40px;
    height: 40px;
    z-index: 200;
    cursor: pointer;
    &:hover{
      background-color:rgba(34, 32, 32, 0.8);
    }
  }
  .btn-music-start{
    background: url('./img/music.png') no-repeat;
    background-size: 100%;
    background-color: rgba(34, 32, 32, 0.3);
  }
  .btn-music-stop{
    background: url('./img/music.png') no-repeat;
    background-size: 100%;
    background-position: 0 -40px;
    background-color: rgba(34, 32, 32, 0.3);
  }

  .btn-vr{
    background: url('./img/vtourskin.png') no-repeat;
    background-position: 2px 9px;
    background-size: 140%;
    background-color: rgba(34, 32, 32, 0.3);
  }
  .btn-fullscreen{
    background: url('./img/vtourskin.png') no-repeat;
    background-position: 4px -284px;
    background-size: 160%;
    background-color: rgba(34, 32, 32, 0.3);
  }
  .btn-unfullscreen{
    background: url('./img/vtourskin.png') no-repeat;
    background-position: -28px -284px;
    background-size: 160%;
    background-color: rgba(34, 32, 32, 0.3);
  }
  .btn-preview{
    background: url('./img/vtourskin.png') no-repeat;
    background-position: 5px -61px;
    background-size: 160%;
    background-color: rgba(34, 32, 32, 0.3);
  }
}
</style>
