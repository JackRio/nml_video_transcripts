import json
import re
import requests

import gensim
import nltk
import spacy
from gensim import corpora
from nltk.corpus import wordnet as wn
from nltk.stem.wordnet import WordNetLemmatizer
from spacy.lang.en import English
from transformers import AutoTokenizer, AutoModelForTokenClassification

from constants import constants

# nltk.download('wordnet')
# nltk.download('stopwords')
spacy.load('en_core_web_trf')

parser = English()
en_stop = set(nltk.corpus.stopwords.words('english'))


class TopicExtraction:

    @staticmethod
    def tokenize(text):
        lda_tokens = []
        tkns = parser(text)
        for token in tkns:
            if token.orth_.isspace():
                continue
            elif token.like_url:
                lda_tokens.append('URL')
            elif token.orth_.startswith('@'):
                lda_tokens.append('SCREEN_NAME')
            else:
                lda_tokens.append(token.lower_)
        return lda_tokens

    @staticmethod
    def get_lemma(word):
        lemma = wn.morphy(word)
        if lemma is None:
            return word
        else:
            return lemma

    @staticmethod
    def get_lemma2(word):
        return WordNetLemmatizer().lemmatize(word)

    def prepare_text_for_lda(self, text):
        tkns = self.tokenize(text)
        tkns = [token for token in tkns if len(token) > 4]
        tkns = [token for token in tkns if token not in en_stop]
        tkns = [self.get_lemma(token) for token in tkns]
        return tkns

    def fetch_transcript(self, data):
        text_data = []
        data = json.loads(data)
        for line in data:
            tokens = self.prepare_text_for_lda(line)
            text_data.append(tokens)

        dictionary = corpora.Dictionary(text_data)
        corpus = [dictionary.doc2bow(text) for text in text_data]
        # pickle.dump(corpus, open('corpus.pkl', 'wb'))
        # dictionary.save('dictionary.gensim')

        NUM_TOPICS = 10
        lda_model = gensim.models.ldamodel.LdaModel(corpus, num_topics=NUM_TOPICS, id2word=dictionary, passes=15)
        # lda_model.save('model.gensim')
        topics = lda_model.print_topics(num_words=1)
        cleaned_topics = list()
        for topic in topics:
            cleaned_topics.append(re.search(r'[\"](\w+)', topic[1]).group(1))
        return cleaned_topics


class TokenClassification:
    def __init__(self):
        self.API_URL = "https://api-inference.huggingface.co/models/elastic/distilbert-base-cased-finetuned-conll03-english"
        self.headers = {"Authorization": f"Bearer {constants.API_TOKEN}"}

    def query(self, payload):
        data = json.dumps(payload)
        response = requests.request("POST", self.API_URL, headers=self.headers, data=data)
        return json.loads(response.content.decode("utf-8"))

    def tokenize(self, text):
        data = self.query(text)

