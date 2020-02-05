module.exports = {
  Action: require('./JobAction').AbstractJobAction,
  LinkScraperAction: require('./fetch_action/LinkScraperAction').LinkScraper,
<<<<<<< HEAD
  FetchAction: require('./fetch_action/FetchAction').FetchAction,
  PDFFileRetrieverAction: require('./fetch_action/PDFFileRetrieverAction').PDFFileRetrieverAction,
  PDFParseAction: require('./parse_action/PDFParseAction').PDFParseAction,
  SelectionAction: require('./parse_action/SelectionAction').Selector,
  SelectionGroupAction: require('./parse_action/SelectionGroupAction').SelectionGroupAction,
  TextParserAction: require('./parse_action/TextParserAction').TextParser,
=======
  PDFFileRetrieverAction: require('./fetch_action/PDFFileRetrieverAction').PDFFileRetrieverAction,
  PDFParseAction: require('./parse_action/PDFParseAction').PDFParseAction,
  SelectionAction: require('./parse_action/SelectionAction').Selector,
  TextParserAction: require('./parse_action/TextParserAction').TextParser,
  URLReaderAction: require('./fetch_action/UrlFileReaderAction').FileReader,
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
  XMLRetrieverAction: require('./fetch_action/XmlFileRetrieverAction').FileReader,
  HandleConnectionErrorAction: require('./error_action/HandleConnectionErrorAction').HandleConnectionErrorAction,
  RequeueAction: require('./queue_action/RequeueConnectionAction').RequeueAction,
  HandleDownloadErrorAction: require('./error_action/HandleDownloadErrorAction').HandleDownloadErrorAction,
<<<<<<< HEAD
  ParserWrapperAction: require('./wrapper_action/ParserWrapperAction').ParserWrapperAction,
  Errors: require('./error/errors'),
  FormatAction: require('./FormatAction').FormatAction,
  ClassifyAction: require('./classify_action/ClassifyAction').ClassificationAction,
  FileOutputAction: require('./classify_action/FileOutputAction').FileOutputAction,
  BillTagCreationAction: require('./classify_action/BillTagCreationAction').BillTagCreationAction
=======
  Errors: require('./error/errors')
>>>>>>> #211 [feature/scraper-refactor] : reorganisation of files for backend
}
