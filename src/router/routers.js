// import Main from '@/components/main'
import Main from '@/view/layout/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

const common = [
  {
    path: '/regist',
    name: 'regist',
    meta: {
      title: '账号绑定',
      hideInMenu: true
    },
    component: () => import('@/view/user/regist.vue')
  },

  {
    path: '/bind',
    name: 'bind',
    meta: {
      title: 'bind',
      hideInMenu: true
    },
    component: () => import('@/view/user/bind/bind.vue')
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

const indexRouter = [
  // 首页
  {
    path: '/',
    name: '/',
    component: Main,
    redirect: '/index',
    meta: {
    },
    children: [
      // 搜索页面
      {
        path: 'search_pages',
        name: 'search_pages',
        meta: {
          title: '搜索页面'

        },
        component: () => import('@/view/pages/search_pages')
      },
      // 教师主页
      {
        path: 'teacher_homepage/:id',
        name: 'teacher_homepage',
        meta: {
          title: '教师主页',
          keepAlive: true
        },
        component: () => import('@/view/pages/teacher_homepage')
      },
      // 学生主页
      {
        path: 'student_homepage/:id',
        name: 'student_homepage',
        meta: {
          title: '教师主页',
          keepAlive: false
        },
        component: () => import('@/view/pages/student_homepage')
      },
      // 观看记录
      {
        path: 'look_History',
        name: 'look_History',
        meta: {
          title: '观看记录',
          keepAlive: true
        },
        component: () => import('@/view/pages/look_History')
      },
      // 首页视频跳转
      {
        path: 'videojump/:id',
        name: 'videojump',
        meta: {
          title: '首页视频播放',
          keepAlive: false,
          hideInMenu: false
        },
        component: () => import('@/view/video_index/videojump.vue')
      },
      {
        path: 'news',
        name: 'news',
        meta: {
          title: '新闻',
          hideInMenu: false
        },
        component: () => import('@/view/pages/news.vue')
      },
      {
        path: 'schoolyard',
        name: 'schoolyard',
        meta: {
          title: '校园慕课',
          hideInMenu: false
        },
        component: () => import('@/view/pages/schoolyard.vue')
      },
      {
        path: 'partner',
        name: 'partner',
        meta: {
          title: '合作院校',
          hideInMenu: false
        },
        component: () => import('@/view/pages/partner.vue')
      },
      {
        path: 'team',
        name: 'team',
        meta: {
          title: '教师团队',
          hideInMenu: false
        },
        component: () => import('@/view/pages/team.vue')
      },
      {
        path: '/index',
        name: 'index',
        meta: {
          title: '首页',
          hideInMenu: false,
          keepAlive: true
        },
        component: () => import('@/view/pages/course.vue')
      },


      {
        path: 'personal',
        name: 'personal',
        meta: {
          title: '个人中心',
          hideInMenu: false,
          keepAlive: true
        },
        component: () => import('@/view/pages/personal.vue'),
        children: [
          {
            path: '/',
            redirect: { name: 'personaldata' }
          },
          {
            path: 'personaldata',
            name: 'personaldata',
            meta: {
              title: '个人资料',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/personaldata.vue')
          },
          {
            path: 'record',
            name: 'record',
            meta: {
              title: '购买记录',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/record.vue')
          },
          {
            path: 'attention',
            name: 'attention',
            meta: {
              title: '关注',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/attention.vue')
          },
          {
            path: 'like',
            name: 'like',
            meta: {
              title: '喜欢',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/like.vue')
          },
          {
            path: 'fans',
            name: 'fans',
            meta: {
              title: '粉丝',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/fans.vue')
          },
          {
            path: 'wallet',
            name: 'wallet',
            meta: {
              title: '钱包',
              keepAlive: true
            },
            component: () => import('@/view/teacher_personal/wallet.vue')

          }
        ]

      }

    ]

  },
  // 内部系统
  {
    path: '/system_index',
    name: 'system_index',
    meta: {
      title: '内部系统页面'

    },
    component: () => import('@/view/inner_system/system_index'),
    children: [
      {
        path: '/',
        redirect: { name: 'system_index' }
      },
      {
        path: 'course_adm',
        name: 'course_adm',
        meta: {
          title: '课程管理',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/course_adm.vue')
      },
      {
        path: 'training_adm',
        name: 'training_adm',
        meta: {
          title: '培训班管理',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/training_adm.vue')
      },
      {
        path: 'person_test',
        name: 'person_test',
        meta: {
          title: '个人试题库',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/person_test.vue')
      },

      {
        path: 'resource_adm',
        name: 'resource_adm',
        meta: {
          title: '资源管理',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/resource_adm.vue')
      },
      {
        path: 'students_adm',
        name: 'students_adm',
        meta: {
          title: '学员管理',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/students_adm.vue')
      },
      {
        path: 'organization_exam',
        name: 'organization_exam',
        meta: {
          title: '组织考试',
          keepAlive: true
        },
        component: () => import('@/view/inner_system/organization_exam.vue')
      },
    ]

  }
]

const router = [...common, ...indexRouter]
export default router
export { common }
