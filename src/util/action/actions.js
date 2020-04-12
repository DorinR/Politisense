module.exports = {
  Action: require('./JobAction').AbstractJobAction,
  LinkScraperAction: require('./fetch_action/LinkScraperAction').LinkScraper,
  FetchAction: require('./fetch_action/FetchAction').FetchAction,
  PDFFileRetrieverAction: require('./fetch_action/PDFFileRetrieverAction').PDFFileRetrieverAction,
  PDFParseAction: require('./parse_action/PDFParseAction').PDFParseAction,
  SelectionAction: require('./parse_action/SelectionAction').Selector,
  SelectionGroupAction: require('./parse_action/SelectionGroupAction').SelectionGroupAction,
  TextParserAction: require('./parse_action/TextParserAction').TextParser,
  XMLRetrieverAction: require('./fetch_action/XmlFileRetrieverAction').FileReader,
  HandleConnectionErrorAction: require('./error_action/HandleConnectionErrorAction').HandleConnectionErrorAction,
  RequeueAction: require('./queue_action/RequeueConnectionAction').RequeueAction,
  HandleDownloadErrorAction: require('./error_action/HandleDownloadErrorAction').HandleDownloadErrorAction,
  ParserWrapperAction: require('./wrapper_action/ParserWrapperAction').ParserWrapperAction,
  Errors: require('./error/errors'),
  QueryResponseAdapterAction: require('./adapter_action/QueryResponseAdapterAction').QueryResponseAdapterAction,
  BillClassificationAction: require('./classify_action/BillClassifyAction').BillClassificationAction,
  FileOutputAction: require('./classify_action/FileOutputAction').FileOutputAction,
  BillTagCreationAction: require('./classify_action/BillTagCreationAction').BillTagCreationAction,
  BillLinkFetchAdapterAction: require('./adapter_action/BillLinkFetchAdapterAction').BillLinkFetchAdapterAction,
  RoleFetchLinkAdapterAction: require('./adapter_action/RoleFetchLinkAdapterAction').RoleFetchLinkAdapterAction,
  RoleQueryResponseAdapterAction: require('./adapter_action/RoleQueryResponseAdapterAction').RoleQueryResponseAdapterAction,
  PoliticianAfterAdapterAction: require('./adapter_action/PoliticianAfterAdapterAction').PoliticianAfterAdapterAction,
<<<<<<< Updated upstream
  ExpenditureComputeAction: require('./classify_action/ExpenditureComputeAction').ExpenditureComputeAction,
  ClassificationResultAdapterAction: require('./adapter_action/ClassificationResultAdapterAction').ClassificationResultAdapterAction
=======
  ExpenditureComputeAction: require('./classify_action/ExpenditureComputeAction').ExpenditureComputeAction
>>>>>>> Stashed changes
}
