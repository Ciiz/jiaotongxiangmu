<template>
  <div class="person_test">
    <Tabs value="name1" name='name_coures'>
      <TabPane label="题库" name="name1">
        <div class="person_testH">
          <Row>
            <Col span="5">
            <div style="width:100%"> &nbsp </div>
            </Col>
            <Col span="14">
            <Button type="info">+ 新增试题</Button>
            <Button>题库查看</Button>
            <Button>导入试题</Button>
            <Button>导出所选题()</Button>
            <Button>移动到分类</Button>
            <Button>删除试题</Button>
            </Col>
            <Col span="5">
            <Input placeholder="输入关键字" style="width: auto">
            <Icon type="ios-search" slot="suffix" />
            </Input>
            </Col>
          </Row>
        </div>
        <div class="person_testC">
          <Row>
            <Col span="5">
            <div class="person_testC_c">
              <span style="color: #333333;font-size: 14px;font-weight: bold;font-family: Microsoft YaHei;">试题分类列表</span>
              <div class="person_testC_cb">
                <div class="person_testC_icon">?</div>
                <span>需要新建子分类、重命名、删
                  除分类，请单击右键操作</span>
              </div>
              <Button type="info" style="width:100%">+新建根分类</Button>
              <Input search enter-button placeholder="搜索分类" />
            </div>
            <div class="person_testC_list">
              <!-- <Tree :data="data5" :render="renderContent" class="demo-tree-render"></Tree> -->

            </div>
            </Col>

            <Col span="19">
            2
            </Col>
          </Row>
        </div>
      </TabPane>

      <TabPane label="试题库" name="name2">
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>
        <div>1232</div>

      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {


    }
  },
  methods: {



  }
}
</script>

<style lang='less' scoped>
/deep/.ivu-tabs-tab {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #666666;
}
/deep/.ivu-btn {
  margin-right: 30px;
}
/deep/.ivu-tabs-bar {
  background-color: #fff;
  height: 48px;
}
.person_test {
  .person_testH {
    height: 48px;
    line-height: 48px;
    background: #ffffff;
  }
  .person_testC {
    margin-top: 10px;

    .person_testC_c {
      background-color: #fff;
      width: 316px;
      height: 208px;
      padding: 20px 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .person_testC_cb {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #999999;
        display: flex;
      }
      .person_testC_icon {
        width: 20px;
        height: 18px;
        background-color: #999999;
        border-radius: 50%;
        color: #fff;
        font-size: 14px;
        text-align: center;
        margin-right: 10px;
      }
      /deep/.ivu-input-search {
        background-color: #57c5f7 !important;
        border-color: #57c5f7 !important;
        // border: none;
      }
    }
  }
}
</style>
