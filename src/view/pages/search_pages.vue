<template>
  <div class="search">
    <div class="search_school">
      <div class="search_s" v-if="searchResult.school_data.length !==0">
        <h3>|</h3> <span>共为您找到{{searchResult.school_data.length}}个学院</span>
      </div>
      <ul>
        <li v-for="(v,i) in searchResult.school_data" :key="i">
          <div class="search_schoolIcon"><img :src="v.school_icon" alt=""></div>
          <div class="search_schoolName">{{v.school_name}}</div>
        </li>
      </ul>
    </div>
    <div class="search_user">
      <div class="search_s" v-if="searchResult.teaher_data.length !==0">
        <h3>|</h3> <span>共为您找到{{searchResult.teaher_data.length}}个教师</span>
      </div>
      <ul>
        <li v-for="(v,i) in searchResult.teaher_data" :key="i"
          @click="$router.push({ path: `/teacher_homepage/${v.teacher_id}`})">
          <div class="search_userIcon"><img :src="v.icon" alt=""></div>
          <div class="search_userName">
            <span class="search_userName_name"> {{v.name}}</span>
            <div class="search_userName_footer">
              <span> 职业：{{v.major_name}}老师</span>
              <span> ta的课程：{{v.course_num}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="search_course">
      <div class="search_s" v-if="searchResult.course_data.length !==0">
        <h3>|</h3><span>共为您找到{{searchResult.course_data.length}}个课程</span>
      </div>
      <ul>
        <li v-for="(v,i) in searchResult.course_data" :key="i" @click="$router.push({ path: `/videojump/${v.id}` })">
          <div class="search_courseImg"><img :src="v.img" alt=""></div>
          <div class="search_courseFooter">
            <span class="search_courseFooter_name">{{v.course_name}}</span>
            <span>作者：{{v.name}}</span>
            <span>院校：{{v.school_name}}</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>

export default {
  data () {
    return {
    }
  },
  computed: {
    searchResult () {
      return this.$store.state.user.searchResult
    }
  },

  methods: {

  },
  mounted () {
  }
}
</script>

<style lang='less' scoped>
.search {
  width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
  .search_s {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #2ba4e7ff;
    padding-bottom: 10px;
    h3 {
      color: #2ba4e7ff;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #010101;
    }
  }
  .search_school {
    margin: 10px 0;
    ul {
      li {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .search_schoolIcon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin-right: 20px;
          img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
          }
        }
        .search_schoolName {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #000000;
          line-height: 24px;
        }
      }
    }
  }
  .search_user {
    ul {
      li {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .search_userIcon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin-right: 20px;
          img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
          }
        }
        .search_userName {
          display: flex;
          flex-direction: column;
          .search_userName_name {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #000000;
          }
          .search_userName_footer {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #999999;
            line-height: 24px;
            span:nth-child(1) {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
  .search_course {
    ul {
      display: flex;
      flex-wrap: wrap;
      li:nth-child(5n) {
        margin-right: 0;
      }
      li {
        width: 200px;
        height: 230px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        margin: 20px 50px 20px 0;
        .search_courseImg {
          img {
            width: 200px;
            height: 150px;
            background: #000000;
            border-radius: 4px 4px 0px 0px;
          }
        }
        .search_courseFooter {
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 10px 10px;
          .search_courseFooter_name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
