const JobAction = require('../JobAction').AbstractJobAction

class SelectionGroupAction extends JobAction {
  constructor (selector = 'xml', group = []) {
    super()
    this.selector = selector
    this.group = group.sort()
  }

  async perform () {
    let output = this.primaryFilter(this.group)
    if(output.length < 1) {
      output = this.fallbackFilter(this.group)
    }

    console.debug(`INFO: ${output[0] ? 'Found' : 'Did not find'} selector: ${this.selector} in group`)
    return output[0]
  }

  primaryFilter(group) {
    return group.filter(url => {
      url = url.toLowerCase()
      return url.includes(this.selector.toLowerCase())
    })
  }

  fallbackFilter(group) {
    const selectors = this.selector.split('-')
    return group.filter(url => {
      url = url.toLowerCase()
      return selectors.every(selector => {
        return url.includes(selector)
      })
    })
  }
}

module.exports.SelectionGroupAction = SelectionGroupAction