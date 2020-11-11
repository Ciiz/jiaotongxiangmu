<template>
  <div class="aboutme">
    <cell title="关于我们">
      <span slot="left"><img src="@/assets/images/mobile_teacher/back.png" alt="" @click="$router.back(-1)"></span>
      <span slot="right"></span>
    </cell>
    <div class="aboutme_content">
      <div class="aboutme_content_icon">
        <img src="@/assets/images/public/yingtuicon.png" alt="">
      </div>
      <div class="aboutme_content_text">
        广州市英途信息软件股份有限公司成立于2009年，专注于教育行业的IT服务、软件开发、系统集成等业务，把为教育客户提供优秀的产品和专业的服务作为公司的目标，精心耕耘。如今公司已在虚拟现实教育应用、在线教学服务、课程资源建设、优质课程运营等多个领域积累了丰富的经验和成功案例，用户遍布全国。公司为国家级高新技术企业，广州市研发机构，是广东省虚拟现实教育产业技术创新联盟理事长单位。未来，公司将借助目前积累的技术优势，秉承“技于精，质于诚；敏于思，进于勤；成于信，合于心。”的企业文化，为中国教育信息化的发展和推动贡献出自己真挚的力量。
      </div>
    </div>
  </div>
</template>

<script>
import cell from '@/view/mobile_page/components/public_cell'
export default {
  components: {
    cell
  },

  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style lang='less' scoped>
.aboutme_content {
  background-color: #f3f3f3ff;
  height: 100vh;
  .aboutme_content_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 0;
    img {
      width: 3.96rem;
      height: 1.47rem;
    }
  }
  .aboutme_content_text {
    font-size: 0.34rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    padding: 0rem 0.6rem;
  }
}
</style>
