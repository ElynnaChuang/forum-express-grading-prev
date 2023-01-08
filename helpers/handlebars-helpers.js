const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  role: isAdmin => {
    if (isAdmin) {
      return 'admin'
    }
    return 'user'
  },
  relativeTimeFromNow: date => dayjs(date).fromNow(),
  setOption: isAdmin => {
    if (!isAdmin) {
      return 'admin'
    }
    return 'user'
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
