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
    input = input.sort()
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
    console.debug(`INFO: Found ${this.selected.length} desired links and ${this.raw.length} other links`)
    return {
      other: this.raw,
      selected: this.selected
    }
  }
}

module.exports.Selector = SelectionAction
