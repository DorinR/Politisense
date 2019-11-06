class VoteRecord {
  /**
   *
   * @param {string} billNumber
   * @param {number} id
   * @param {string} name
   * @param {Object} voters
   */
  constructor(billNumber, id, name, voters) {
    this.billNumber = billNumber
    this.id = id
    this.name = name
    this.voters = voters
  }
}
