exports.getInstance = (
  billId,
  billNumber,
  billSummary,
  billText,
  dateVoted
) => {
  return {
    billId,
    billNumber,
    billSummary,
    billText,
    dateVoted
  }
}
