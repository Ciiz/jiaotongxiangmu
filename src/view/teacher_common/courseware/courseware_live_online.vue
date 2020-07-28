<template>
  <div class="online-box ">
   <div v-for="item in online_data.students" :key="item.id + 'online-id'" class="online-item">
       <Avatar :src="item.icon" />
       <span class="online-name">{{item.name}}</span>
       <Tag :color="item.online_status === true ? 'green' : 'red' ">{{item.online_status === true ? '在线' : '离线'}}</Tag>
   </div>
  </div>
</template>

<script>
export default {
  props: ['online_data'],
  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style>
.online-box{
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-wrap: wrap;
}
.online-item{
    margin: 5px 0;
    width: 50%;
    height:50px;
}
.online-name{
    display: inline-block;
    width: 80px;
    text-align: center;
}
</style>
