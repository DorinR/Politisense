const JobAction = require('../JobAction').AbstractJobAction

class SelectionAction extends JobAction {
  constructor (selector = 'xml') {
    super()
    this.raw = []
    this.selected = []
    this.selector = selector
  }

  async perform (raw) {
    let input
    if (raw.selected) {
      input = raw.selected
    } else {
      input = raw
    }
<<<<<<< HEAD
    input = input.sort()
=======
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
    input.forEach((item) => {
      if (!item) {
        return
      }
      const i = item.toLowerCase()
      if (i.includes(this.selector.toLowerCase())) {
        this.selected.push(item)
      } else {
        this.raw.push(item)
      }
    })
    console.log(`INFO: Found ${this.selected.length} desired links and ${this.raw.length} other links`)
    return {
      other: this.raw,
      selected: this.selected
    }
  }
}

module.exports.Selector = SelectionAction
