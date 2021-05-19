<template>
  <Table row-key="id" :columns="columns" :data="data12" border width='1084'></Table>
</template>
<script>

import { get_arrange } from '@/api/system'
export default {
  props: {
    data: Object

  },
  data () {
    return {
      num: 1,
      columns: [
        {
          title: ' ',
          key: 'name',
          tree: true,
          align: 'center',
          width: 600,
          render: (h, params) => {
            return (
              <div>
                <div style="min-width:137px;text-align:center;">
                  {params.row.name}
                </div>
              </div>
            )
          }
        },
        {
          title: '内容',
          key: 'age',
          align: 'center',
          render: (h, params) => {
            return (
              <div style="min-width:137px;text-align:center;color:#00AEFF;cursor:pointer" v-show={params.row.address} >
                预览
              </div >
            )
          }
        },
        {
          title: '学习进度进程',
          key: 'address',
          align: 'left',
          render: (h, params) => {
            return (
              <div v-show={params.row.address}>
                当前进度： <span style='color:#00AEFF' v-show={params.row.address > 0 && params.row.address < 100}>{params.row.address}</span>
                <span style='color:red' v-show={params.row.address == 0}>{params.row.address}</span>
                <span v-show={params.row.address == 100}>{params.row.address}</span>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'address',
          align: 'center',
          render: (h, params) => {
            return (
              <div v-show={params.row.address} style='color: #00AEFF;font-size: 14px;cursor:pointer' onClick={() => { this.handleclick(params.row.id) }} >
                查看进度
              </div>

            )
          }
        }
      ],
      data12: [
        {
          id: '10',
          name: '第一阶段',
          children: [{}]
        },
        {
          id: '101',
          name: '第二阶段',
          children: [
            {
              id: '10100',
              name: 'Blackn',
              age: "预览",
              address: '0'
            },
            {
              id: '10101',
              name: 'Joe Blackn',
              age: "预览",
              address: '19'
            },
            {
              id: '10102',
              name: 'Jon Snow',
              age: "预览",
              address: '100',
            }
          ]
        },
        {
          id: '102',
          name: '第三阶段',
          children: [
            {}
          ]

        },
        {
          id: '103',
          name: '第四阶段',
          children: [{}]

        }
      ]
    }
  },

  methods: {

    handleclick (id) {
      this.$emit('handleclick', id)
    }
  },
  async mounted () {
    setTimeout(() => {
      console.log(this.data);
    }, 2000)

    let res = await get_arrange({ class_id: this.data.id, class_task_id: '' })
    console.log(res);
    this.arrangeList = res.data
  },
  created () {
    // 此处有效
    // this.columns[1].className = "color_title";
  }
}
</script>
<style lang='less' scoped>
/deep/.ivu-table-cell-tree {
  float: right;
  clear: both;
  margin-right: 200px;
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  .ivu-icon-ios-add:before {
    content: "\F116";
    font-size: 20px;
  }
  .ivu-icon-ios-remove:before {
    content: "\F124";
    font-size: 20px;
  }
}
/deep/.ivu-table-header table thead tr th {
  font-size: 14px;
  color: #00aeff !important;
  font-family: Microsoft YaHei;
  font-weight: bold;
}
</style>