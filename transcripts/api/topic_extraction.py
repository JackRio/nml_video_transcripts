import json
import re

import gensim
import nltk
import spacy
from flair.data import Sentence
from flair.models import SequenceTagger
from gensim import corpora
from nltk.corpus import wordnet as wn
from nltk.stem.wordnet import WordNetLemmatizer
from spacy.lang.en import English
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


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
        print(type(data))
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
        self.tagger = SequenceTagger.load('ner')
        self.nlp = spacy.load('en_core_web_md')

    def tokenize_sentences(self, data):
        return [i for i in self.nlp(data).sents]

    def tokenize(self, data):
        spans = set()
        for sent in self.tokenize_sentences(data):
            sentence = Sentence(str(sent))
            self.tagger.predict(sentence)
            for entity in sentence.get_spans('ner'):
                text = entity.text
                text = re.sub('[^A-Za-z0-9 ]', '', text)
                spans.add(text)
        return list(spans)


class TextSummarization:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("sshleifer/distilbart-cnn-12-6")

    @staticmethod
    def clean_html(raw_html):
        cleanr = re.compile('<.*?>')
        cleantext = re.sub(cleanr, '', raw_html)
        return cleantext

    def summarize(self, data):
        inputs = self.tokenizer.encode("summarize: " + data, return_tensors="pt", truncation=True, max_length=1024)
        outputs = self.model.generate(inputs, max_length=250, min_length=450, length_penalty=2.0, num_beams=4,
                                      early_stopping=True)
        generated = self.tokenizer.decode(outputs[0])
        generated = self.clean_html(generated)

        return generated
