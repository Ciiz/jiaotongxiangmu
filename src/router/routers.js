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
    path: '/pano_preview',
    name: 'pano_preview',
    meta: {
      hideInBreak: true,
      hideInMenu: true
    },
    component: () => import('@/view/pages/pano-preview.vue')
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
  },
  {
    path: '/live_public',
    name: 'live_public',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/teacher_common/courseware/courseware_live_public.vue')
  },
  {
    path: '/live_teacher',
    name: 'live_teacher',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/teacher_common/courseware/live_teacher.vue')
  },
  {
    path: '/live_student',
    name: 'live_student',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/class_common/courseware/live_student.vue')
  },
  {
    path: '/live_online',
    name: 'live_online',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/alone/courseware_live_nPublic.vue')
  },
  {
    path: '/online_qrcode',
    name: 'online_qrcode',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/alone/courseware_live_teacherNew.vue')
  }
]

const indexRouter = [
  {
    path: '/',
    name: '/',
    component: Main,
    redirect: '/index',
    meta: {
    },
    children: [
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
        path: 'live',
        name: 'live',
        meta: {
          title: '直播',
          hideInMenu: false
        },
        component: () => import('@/view/pages/live.vue')
      }
    ]
  },
  {
    path: '/teachingSystem',
    name: 'teachingSystem',
    meta: {
      title: '教学系统',
      hideInMenu: false,
      keepAlive: true
    },
    component: () => import('@/view/pages/teachingSystem.vue'),
    children: [
      // 教师
      {
        path: 'MyCourse',
        name: 'MyCourse',
        meta: {
          title: '我的课程',
          keepAlive: true
        },
        component: () => import('@/view/teachingSystem_page/myCourse.vue'),
        children: [
          {
            path: '/',
            redirect: { name: 'course_courseware' }
          },
          {
            path: 'course_courseware',
            name: 'course_courseware',
            meta: {
              title: '课件列表',
              keepAlive: true
            },
            component: () => import('@/view/teacher_page/courseware_manage/course_courseware.vue')
          },
          {
            path: 'course_courseware_detail',
            name: 'course_courseware_detail',
            meta: {
              title: '课程详情',
              keepAlive: true
            },
            component: () => import('@/view/teacher_common/course/course_detail.vue')
          },
          {
            path: 'course_students_manage',
            name: 'course_students_manage',
            meta: {
              title: '学生管理',
              keepAlive: true
            },
            component: () => import('@/view/teacher_common/course/course_students.vue')
          },
          {
            path: 'show_attendance',
            name: 'show_attendance',
            meta: {
              title: '查看考勤',
              keepAlive: true
            },
            component: () => import('@/view/teacher_common/attendance/attendance_list.vue')
          }
        ]
      },
      // 学生
      {
        path: 'StudentCourse',
        name: 'StudentCourse',
        meta: {
          title: '我的课程',
          keepAlive: true
        },
        component: () => import('@/view/teachingSystem_page/myCourse.vue'),
        children: [
          {
            path: '/',
            redirect: { name: 'course_coursewares' }
          },
          {
            path: 'course_coursewares',
            name: 'course_coursewares',
            meta: {
              title: '课件列表',
              keepAlive: true
            },
            component: () => import('@/view/class_common/course/course_coursewares')
          },
          {
            path: 'student_courseware_detail',
            name: 'student_courseware_detail',
            meta: {
              title: '课程详情',
              keepAlive: true
            },
            component: () => import('@/view/class_common/course/course_detail')
          }
        ]
      },
      {
        path: 'course',
        name: 'teacher_course',
        meta: {
          title: '课程管理',
          keepAlive: true
        },
        component: () => import('@/view/teacher_page/course_manage/course_manage.vue')
      },
      {
        path: 'course_courseware_manage',
        name: 'course_courseware_manage',
        meta: {
          title: '课件',
          icon: 'md-calendar',
          // hideInMenu: true,
          keepAlive: true
        },
        component: () => import('@/view/teacher_page/courseware_manage/course_courseware_manage.vue')
      },
      {
        path: 'correct',
        name: 'correct',
        meta: {
          title: '批改'
        },
        component: () => import('@/view/teacher_page/course_manage/correct.vue')
      },
      {
        path: 'teacherassess',
        name: 'teacherassess',
        meta: {
          title: '考核与评价',
          keepAlive: true,
          icon: 'md-list-box'
        },
        component: () => import('@/view/teacherassess/index')
      },
      {
        path: 'assess_for_student',
        name: 'assess_for_student',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/teacherassess/components/assess_for_student')
      },
      {
        path: 'watcheva_assess',
        name: 'watcheva_assess',
        meta: {
          hideInMenu: true,
          title: '考核与评价',
          icon: 'md-list-box'
        },
        component: () => import('@/view/teacherassess/components/watcheva_assess')
      },
      {
        path: 'teacher_personalinformation',
        name: 'teacher_personalinformation',
        meta: {
          title: '个人信息',
          icon: 'md-person',
          keepAlive: true
        },
        component: () => import('@/view/teacher_personalinformation')
      },
      {
        path: 'message',
        name: 'message',
        meta: {
          title: '消息留言',
          icon: 'md-briefcase',
          hideInMenu: true
        },
        component: () => import('@/view/single-page/message')
      },
      // 学生
      {
        path: 'courseware_class/:courseware_id',
        name: 'courseware_class',
        meta: {
          title: '课时(课前-课中-课后)',
          hideInMenu: true,
          icon: 'md-briefcase'
        },
        component: () => import('@/view/class_common/courseware/courseware_class')
      },
      {
        path: 'student_notes',
        name: 'student_notes',
        meta: {
          title: '课堂笔记',
          icon: 'ios-create',
          keepAlive: true
        },
        component: () => import('@/view/single-page/student_notes')
      },
      {
        path: 'task',
        name: 'task',
        meta: {
          title: '任务',
          keepAlive: true
        }
      },
      {
        path: 'homework_exam',
        name: 'homework_exam',
        meta: {
          title: '作业测试',
          keepAlive: true
        },
        component: () => import('@/view/single-page/homework_exam')
      },
      {
        path: 'examine',
        name: 'examine',
        meta: {
          title: '考核与评价',
          icon: 'ios-paper',
          keepAlive: true
        },
        component: () => import('@/view/evaluation/evaluation'),
        children: [
          {
            path: 'course_score',
            name: 'course_score',
            meta: {
              title: '课程成绩',
              keepAlive: true
            },
            component: () => import('@/view/evaluation/component/course_score')
          },
          {
            path: 'attendance_student',
            name: 'attendance_student',
            meta: {
              title: '查看考勤',
              keepAlive: true
            },
            component: () => import('@/view/teacher_common/attendance/attendance_student')
          },
          {
            path: 'task',
            name: 'task',
            meta: {
              title: '任务',
              keepAlive: true
            },
            component: () => import('@/view/evaluation/component/task')
          },
          {
            path: 'homework',
            name: 'homework',
            meta: {
              title: '作业',
              keepAlive: true
            },
            component: () => import('@/view/evaluation/component/homework')
          },
          {
            path: 'exam',
            name: 'exam',
            meta: {
              title: '测试',
              keepAlive: true
            },
            component: () => import('@/view/evaluation/component/exam')
          }
        ]
      },
      {
        path: 'profile',
        name: 'profile',
        meta: {
          title: '个人信息',
          icon: 'md-person',
          keepAlive: true
        },
        component: () => import('@/view/user/profile')
      }
    ]
  }
]

const mobileStudent = [
  {
    path: '/entry',
    name: 'entry',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/pages/entry.vue')
  },
  {
    path: '/mobileLogin',
    name: 'mobileLogin',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/pages/login.vue')
  },
  {
    path: '/mobile',
    name: 'mobile',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/pages/index.vue'),
    children: [
      {
        path: '/',
        redirect: { name: 'showIndex' }
      },
      {
        path: 'showIndex',
        name: 'showIndex',
        meta: {
          title: '首页',
          keepAlive: true
        },
        component: () => import('@/view/mobile_page/show/view/index/showIndex.vue')
      },
      {
        path: 'mobileMessage',
        name: 'mobileMessage',
        meta: {
          title: '消息',
          keepAlive: true
        },
        component: () => import('@/view/mobile_page/show/view/message/message.vue')
      },
      {
        path: 'mobileCourse',
        name: 'mobileCourse',
        meta: {
          title: '课程',
          keepAlive: true
        },
        component: () => import('@/view/mobile_page/show/view/course/course.vue')
      },
      {
        path: 'mobileUserCenter',
        name: 'mobileUserCenter',
        meta: {
          title: '个人中心',
          keepAlive: true
        },
        component: () => import('@/view/mobile_page/show/view/userCenter/userCenter.vue')
      }
      // {
      //   path: 'student_courseware_detail',
      //   name: 'student_courseware_detail',
      //   meta: {
      //     title: '课程详情',
      //     keepAlive: true
      //   },
      //   component: () => import('@/view/class_common/course/course_detail')
      // }
    ]
  },
  {
    path: '/discuss',
    name: 'discuss',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/message/discuss.vue')
  },
  {
    path: '/systeminfoShow',
    name: 'systeminfoShow',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/message/systeminfoShow.vue')
  },
  {
    path: '/classNotice',
    name: 'classNotice',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/message/classNotice.vue')
  },
  {
    path: '/undo',
    name: 'undo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/message/undo.vue')
  },
  {
    path: '/taskIndex',
    name: 'taskIndex',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/taskIndex.vue')
  },
  {
    path: '/taskInfo',
    name: 'taskInfo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/taskInfo.vue')
  },
  {
    path: '/taskEvaluate',
    name: 'taskEvaluate',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/taskEvaluate.vue')
  },
  {
    path: '/taskAnswer',
    name: 'taskAnswer',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/taskAnswer.vue')
  },
  {
    path: '/examInfo',
    name: 'examInfo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/exam/examInfo.vue')
  },
  {
    path: '/objectQuestion',
    name: 'objectQuestion',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/exam/objectQuestion.vue')
  },
  {
    path: '/subjectQuestion',
    name: 'subjectQuestion',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/exam/subjectQuestion.vue')
  },
  {
    path: '/membersAnswer',
    name: 'membersAnswer',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/membersAnswer.vue')
  },
  {
    path: '/evaluateMembers',
    name: 'evaluateMembers',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/evaluateMembers.vue')
  },
  {
    path: '/membersAnswerDetail',
    name: 'membersAnswerDetail',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/task/membersAnswerDetail.vue')
  },
  {
    path: '/evaluate',
    name: 'evaluate',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/evaluate/evaluate.vue')
  },
  {
    path: '/attendance',
    name: 'attendance',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/attendance/attendance.vue')
  },
  {
    path: '/attendanceDetail',
    name: 'attendanceDetail',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/attendance/attendanceDetail.vue')
  },
  {
    path: '/teacherList',
    name: 'teacherList',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/teacherList/teacherList.vue')
  },
  {
    path: '/courseList',
    name: 'courseList',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/note/courseList.vue')
  },
  {
    path: '/noteList',
    name: 'noteList',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/note/noteList.vue')
  },
  {
    path: '/noteDetail',
    name: 'noteDetail',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/note/noteDetail.vue')
  },
  {
    path: '/homeworkExamIndex',
    name: 'homeworkExamIndex',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/homeworkExam/homeworkExamIndex.vue')
  },
  {
    path: '/mobileCourseware',
    name: 'mobileCourseware',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/courseware.vue')
  },
  {
    path: '/mobileCoursewareInfo',
    name: 'mobileCoursewareInfo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/coursewareInfo.vue')
  },
  {
    path: '/mobileLiveStudent',
    name: 'mobileLiveStudent',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/live_student.vue')
  },
  {
    path: '/mobileCourseTimetable',
    name: 'mobileCourseTimetable',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/courseTimetable.vue')
  },
  {
    path: '/mobileSelectcourse',
    name: 'mobileSelectcourse',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/selectcourse.vue')
  },
  {
    path: '/mobileChapterInfo',
    name: 'mobileChapterInfo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/chapterInfo.vue')
  },
  {
    path: '/mobileChapterDetail',
    name: 'mobileChapterDetail',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/course/chapterDetail.vue')
  },
  {
    path: '/mobileUserInfo',
    name: 'mobileUserInfo',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/mobile_page/show/view/userCenter/userInfo/userInfo.vue')
  }
]

const router = [...common, ...indexRouter, ...mobileStudent]
export default router
export { common }
export { mobileStudent }
