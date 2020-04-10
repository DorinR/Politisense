module.exports = {
  Job: require('./Job').AbstractJob,
  BillLinkFetchJob: require('./BillLinkFetchJob').BillLinkFetchJob,
  BillPDFFetchJob: require('./BillPDFFetchJob').PDFRetrievalJob,
  ScrapeJob: require('./ScrapeJob').ScrapeJob,
  PoliticianFetchJob: require('./PoliticianFetchJob').PoliticianFetchJob,
  RoleFetchJob: require('./RoleFetchJob').RoleFetchJob,
  ClassificationJob: require('./ClassificationJob').ClassificationJob,
  CategoryGenerationJob: require('./CategoryGenerationJob').CategoryGenerationJob,
  VoteRecordFetchJob: require('./VoteRecordFetchJob').VoteRecordFetchJob,
  VoteParticipantFetchJob: require('./VoteParticipantFetchJob').VoteParticipantFetchJob,
  BillFetchJob: require('./BillFetchJob').BillFetchJob,
  LegislativeActivityFetchJob: require('./LegislativeActivityFetchJob').LegislativeActivityFetchJob,
  ExpenditureFetchJob: require('./ExpenditureFetchJob').ExpenditureFetchJob
}
