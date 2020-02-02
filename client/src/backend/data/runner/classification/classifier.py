#!/usr/local/bin/env python3.7

from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse.csc import csc_matrix
import sys
import json
import numpy
import enchant

def english_only_tokens(content):
    print("INFO: removing french tokens..")
    tokens = content.split()
    string = ""
    d_en = enchant.Dict('en_GB')
    d_fr = enchant.Dict('fr_FR')
    for t in tokens:
        if d_en.check(t) and not d_fr.check(t):
            string += t + " "
    return string

def read_in_files(file_list):
    print("INFO: starting TFIDF classification", file=sys.stdout)
    position = 1
    corpus = dict()
    print("INFO: unpacking passed JSON", file=sys.stdout)
    while( len(sys.argv) > position):
        obj = None
        with open(sys.argv[position], 'r') as content_file:
            obj = content_file.read()
        obj = json.loads(obj)
        bill = obj['name']
        content = english_only_tokens(obj['content'])
        print("INFO: adding bill: %s to corpus" % (bill), file=sys.stdout)
        corpus[bill] = content
        position+=1
    return corpus

def classify_corpus(corpus):
    print("INFO: Finished classifying %i bills" % (len(sys.argv) - 1), file=sys.stdout)
    vectorizer = TfidfVectorizer(stop_words='english', token_pattern=r'[a-zA-z]{3,}', ngram_range=(1,2))
    document_term_mat = vectorizer.fit_transform(corpus.values())
    feature_names = vectorizer.get_feature_names()
    return (document_term_mat, feature_names)

def create_return_classifications(values, terms, corpus):
    classifications = dict()
    iterable = [((i, j), values[i,j]) for i, j in zip(*values.nonzero())]
    for it in iterable:
        bill_id = it[0][0]
        bill = list(corpus.keys())[bill_id]
        term_id = it[0][1]
        term = terms[int(term_id)]
        score = it[1]
        if bill not in classifications:
            classifications[bill] = dict()    
        classifications[bill][term] = score
    return classifications

def write_to_file(classifications):
    with open("classifications.json", "w+") as output_file:
        output_file.write(json.dumps(classifications))

print("INFO: TFIDF module invoked with %i documents" % (len(sys.argv) - 1), file=sys.stdout)
corpus = read_in_files(sys.argv)
(values, terms) = classify_corpus(corpus)
classifications = create_return_classifications(values, terms, corpus)
write_to_file(classifications)
print("INFO: returning bills..", file=sys.stdout)
exit(0)
