<template>
  <div class="team-container">
    <Row>
      <Col :span='6'>
        <div>
          <Divider  orientation="left" >未分组</Divider>

          <div class="team-scroll">
            <div class="dragArea">
              <draggable
                class="list-group"
                :list="student_task_list"
                :clone="clone"
                @start="start;drag=true"
                :group="{ name: 'people', pull: pullFunction }"
                @end="drag = false"
                v-bind="dragOptions"
              >
                <div v-for="(item,index) in student_task_list" :key="index" class="item">{{item.name}}</div>
              </draggable>
            </div>
          </div>

        </div>
      </Col>

      <Col :span='17' :offset="1" style="border-left: 1px solid #ccc;padding-left: 10px;" >
        <div >
          <Divider  orientation="left">已分组</Divider>
          <div style="border-bottom: 1px solid #ccc;">
            每组人数：
            <InputNumber v-model="team_size" size="small"></InputNumber>
            <Button type="default" size="small" @click="radomRestribute">随机分组</Button>
            <Button type="error" size="small" style="margin-left: 20px;" @click="redistribute">重新分配</Button>
          </div>

            <div class="team-scroll">
              <div v-for="(team,index) in  team_list" :key="`i_${index}`" class="team-list">
                  <div
                    class="btn-group list-group-item"
                  >
                    <h3>
                      小组{{index+1}}
                      <Button
                        type="text"
                        size="small"
                        @click="del_team(index,team)"
                        style="margin-left: 20px;"
                      >删除分组</Button>
                      <Button
                        type="text"
                        size="small"
                        style="margin-left: 20px;"
                        @click="open('add-tudent',index,`添加小组${index+1}组员`,400)"
                      >添加组员</Button>
                    </h3>
                  </div>
                <draggable
                  class="dragArea list-group"
                  :list="team"
                  :clone="clone"
                  group="people"
                  v-bind="dragOptions"
                >
                  <div v-for="(student,index1) in team" :key="index1" class="item">
                    {{student.name}} <span class="team-leader">{{index1 === 0 ? '(组长)' : ''}}</span>
                    <Icon type="md-close" style="float:right;line-height: 22px;cursor:pointer;" @click="move(team,index1)"/>
                  </div>
                </draggable>
              </div>
            </div>

            <div>
              <Button
                type="success"
                @click="team_list.push([])"
                icon="md-add"
                size="small"
              >新增分组</Button>
            </div>
          </div>
        </Col>

      </Row>

    <Spin fix v-show="loading"></Spin>

    <Modal v-model="modal" :title="title" :width="modal_width">
      <div v-if="target === 'add-tudent'" class="modal-content-default">
        <Input v-model="keyword" style="width: 200px">
        <span slot="prepend">搜索</span>
        </Input>

        <p v-if="search_list.length === 0" style="margin-top: 30px;color: #666">暂无数据...</p>

        <ul class="list-group">
          <transition-group name="list-complete" tag="p">
            <li class="item undrapable" v-for="(item,index) in search_list" @click="add(item,target_id)" :key="`search_list_${index}`">
              {{item.name}}
            </li>
          </transition-group>
        </ul>

      </div>
    </Modal>

  </div>
</template>
<script>
import draggable from 'vuedraggable'
import modal_mixin from '@/view/mixins/modal_mixin'
export default {
  props: {
    value: '',
    team_list: {
      type: Array,
      default: () => { return [] }
    }
  },
  mixins: [modal_mixin],
  components: {
    draggable
  },
  data () {
    return {
      loading: false,
      team_size: 1,
      drag: false,
      keyword: '',
      saving: false,
      student_task_list: []
    }
  },
  watch: {
    team_list (n, o) {
      let arr = this.dealData(n)
      this.$emit('input', arr)
    }
  },
  computed: {
    search_list () {
      return this.student_task_list.filter(item => {
        let reg = new RegExp(this.keyword, 'i')
        return reg.test(item.name)
      })
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    clone (item) {
      return item
    },
    pullFunction () {
      return this.controlOnStart ? 'clone' : true
    },
    start ({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey
    },
    del_team (index, students) {
      this.student_task_list = this.student_task_list.concat(students)
      this.team_list.splice(index, 1)
    },
    move (team, index) {
      this.student_task_list.push(team[index])
      team.splice(index, 1)
    },
    check_team_has_empty (list) {
      let tmparr = list.filter(item => {
        // 为空的组
        return item.length === 0
      })
      return tmparr.length > 0
    },
    dealData (team_list) {
      let arr = []
      team_list.forEach((team, index) => {
        team.forEach((student, index1) => {
          let student_task = {
            id: student.id,
            is_team_leader: index1 === 0 ? 1 : 0,
            team_id: index + 1,
            student_id: student.student_id,
            name: student.name
          }
          arr.push(student_task)
        })
      })
      return arr
    },
    redistribute () {
      this.team_list.forEach((team, index) => {
        team.forEach((student, index1) => {
          this.student_task_list.push(student)
        })
      })
      this.update_team_list([[]])
    },
    radomRestribute () {
      this.redistribute() // 放回未分配
      this.student_task_list.sort(function () {
        return 0.5 - Math.random()
      })
      let arr = []
      for (var i = 0; i < this.student_task_list.length; i += this.team_size) {
        arr.push(
          this.student_task_list.slice(i, i + this.team_size)
        )
      }
      this.update_team_list(arr)
      this.student_task_list = []
    },
    add (item, team_id) {
      let index = this.student_task_list.findIndex(student => { return student.student_id === item.student_id })
      this.team_list[team_id].push(item)
      this.student_task_list.splice(index, 1)
      this.keyword = ''
      this.$Message.success('添加成功!')
    },
    update_team_list (val) {
      this.$emit('update:team_list', val)
    },
    validate (callback) {
      let flag = true
      if (this.student_task_list.length > 0) {
        flag = false
        callback && callback(flag, '请把所有学生分组')
        return false
      }
      if (this.check_team_has_empty(this.team_list)) {
        flag = false
        callback && callback(flag, '请把所有组都分配学生')
        return false
      }
      callback && callback(flag, '')
      return false
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" >
  .team-list {
    margin-bottom: 30px;
    li {
      height: 40px;
      border: 1px solid #ccc;
      margin: 10px;
    }
  }
  .student-list {
    li {
      height: 40px;
      border: 1px solid #ccc;
      margin: 10px;
    }
  }
  .list-group {
    .item {
      border: 1px solid #ccc;
      padding: 5px;
      cursor: move;
      margin: 4px 4px;
      width: 140px;
      display: inline-block;
      line-height: 24px;
      // transition: all 0.2s;
      &:hover {
        box-shadow: 1px 2px 3px #ccc;
      }
    }
  }
  .list-group-item{
    margin-top: 20px;
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .team-leader{
    color: purple;
  }
  .undrapable{
    cursor: pointer!important;
  }

  .list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.team-container{
  border: 1px solid #ccc;
}
</style>
