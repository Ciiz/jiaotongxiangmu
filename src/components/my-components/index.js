import Score from '../score'
import ImageUpload from '../image-upload'
import FileUpload from '../file-upload'
// import Editor from '../editor'

const components = {
  Score,
  ImageUpload,
  FileUpload,
  // Editor
}

const install = function (Vue, opts = {}) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })
}

export default { install }
