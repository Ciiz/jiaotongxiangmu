module.exports = {
  apps: [],
  // USE: pm2 deploy ecosystem.config.js dev setup/update (第一次要setup,之后update)
  deploy: {
    dev: {// 开发测试环境
      user: 'root',
      host: '192.168.1.242',
      ref: 'origin/dev',
      repo: 'git@gitee.com:neohuan/zjy_student.git',
      path: '/opt/zjy_eto/Public/frontend',
      'post-deploy': 'npm install && npm run dev-build'
    },
    // USE: pm2 deploy ecosystem.config.js production setup/update (第一次要setup,之后update)
    production: {// 正式环境
      user: 'root',
      host: '10.15.3.65',
      port: '22088',
      ref: 'origin/master',
      repo: 'git@gitee.com:neohuan/zjy_student.git',
      path: '/data/zjy/zeto/Public/frontend',
      'post-deploy': 'npm install && npm run build'
    }
  }
}
