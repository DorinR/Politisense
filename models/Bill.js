class Bill {
  /**
   *
   * @param {number} id
   * @param {string} number
   * @param {string} title
   * @param {string} text
   * @param {string} textUrl
   * @param {string} dateVoted
   * @param {string} sponsorName
   */
  constructor(id, number, title, text, textUrl, dateVoted, sponsorName) {
    this.id = id
    this.number = number
    this.title = title
    this.text = text
    this.textUrl = textUrl
    this.dateVoted = dateVoted
    this.sponsorName = sponsorName
  }
}
