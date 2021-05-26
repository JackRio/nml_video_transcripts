import json
import os

from flask import Flask, request

from transcripts.api import topic_extraction, youtube_api, wiki_api

app = Flask(__name__)


class WebTranscripts:
    def __init__(self):
        self.youtube = youtube_api.YoutubeURLTranscriptions()

        self.wiki = wiki_api.WikiSearch()

        self.ner = topic_extraction.TokenClassification()
        self.summarization = topic_extraction.TextSummarization()

        self.url = None
        self.captions = None


web_obj = WebTranscripts()


# app route for wiki and google search.
@app.route('/transcript', methods=['GET', 'POST'])
def send_transcripts():
    if request.method == 'POST':
        response = request.get_json()
        web_obj.url = response['url']

        # TODO: Add edge cases.
        # Function calls
        transcript = web_obj.youtube.url_to_transcipts(url=web_obj.url)
        wiki_trans = dict()
        wiki_trans['__transcript'] = transcript

        return wiki_trans


@app.route('/topics', methods=['GET', 'POST'])
def send_topics():
    if request.method == 'POST':

        web_obj.captions = web_obj.youtube.url_to_json(url=web_obj.url)

        topics = web_obj.ner.tokenize(data=web_obj.captions)

        wiki_urls = dict()

        for topic in topics:
            if web_obj.wiki.check_page(topic):
                wiki_urls[topic] = web_obj.wiki.fetch_url()
                web_obj.wiki.reset()

        return wiki_urls
    else:
        return dict()


@app.route('/summary', methods=['GET', 'POST'])
def send_summary():
    if request.method == 'POST':

        summary = web_obj.summarization.summarize(data=web_obj.captions)
        response = {'summary': summary}
        return response
    else:
        response = {'summary': web_obj.captions}
        return response


@app.route('/click_rate', methods=['GET', 'POST'])
def click_rate():
    try:
        if request.method == 'POST':
            click_rate_data = request.get_json()
            with open('./click_rate/rate.json', 'r+') as f:
                data = json.load(f)
                data['click_rates'].append(click_rate_data)
                f.seek(0)
                json.dump(data, f)
            return 'Success'

    except Exception:
        return "Failed to store"


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
