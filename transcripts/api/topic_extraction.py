import re

import nltk
import spacy
from spacy.lang.en import English
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

parser = English()
en_stop = set(nltk.corpus.stopwords.words('english'))


class TokenClassification:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_lg')

    def tokenize(self, data):

        doc = self.nlp(data)
        entities = set()

        label_list = ['PERSON', 'NORP', 'FACILITY', 'ORGANIZATION', 'GPE', 'LOCATION', 'PRODUCT',
                      'EVENT', 'WORK_OF_ART', 'LAW', 'LANGUAGE']
        for ent in doc.ents:
            if ent.label_ not in label_list:
                continue

            entities.add(ent.text)

        if len(entities) < len(list(doc.sents)) * 0.1 or len(entities) < 5:
            for token in doc:
                if token.tag_ == "NNP" and not token.is_stop and len(token.text) > 3:
                    entities.add(token.text)

        return list(entities)


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


if __name__ == "__main__":
    from youtube_api import YoutubeURLTranscriptions

    class_name = YoutubeURLTranscriptions()
    data = class_name.url_to_json("https://www.youtube.com/watch?v=yFPfO_eHJdY")

    tk = TokenClassification()
    topics = tk.tokenize(data)
    print(topics)
