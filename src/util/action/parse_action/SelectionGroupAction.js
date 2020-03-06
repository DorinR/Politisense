const JobAction = require('../JobAction').AbstractJobAction

class SelectionGroupAction extends JobAction {
  constructor (selector = 'xml', group = []) {
    super()
    this.selector = selector
    this.group = group.sort()
  }

  async perform () {
    let output = SelectionGroupAction.primaryFilter(this.group, this.selector)
    if (output.length < 1) {
      output = SelectionGroupAction.fallbackFilter(this.group, this.selector)
    }

    console.debug(`INFO: ${output[0] ? 'Found' : 'Did not find'} selector: ${this.selector} in group`)
    return output[0]
  }

  static primaryFilter (group, selector) {
    return group.filter(url => {
      url = url.toLowerCase()
      return url.includes(selector.toLowerCase())
    })
  }

  static fallbackFilter (group, selector) {
    const selectors = selector.split('-')
    return group.filter(url => {
      url = url.toLowerCase()
      return selectors.every(selector => {
        return url.includes(selector)
      })
    })
  }
}

module.exports.SelectionGroupAction = SelectionGroupAction
