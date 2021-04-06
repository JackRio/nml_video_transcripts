from flask import Flask, jsonify, request

from transcripts.api import topic_extraction, youtube_api, wiki_api

app = Flask(__name__)


class WebTranscripts:
    def __init__(self):
        self.youtube = youtube_api.YoutubeURLTranscriptions()
        self.wiki = wiki_api.WikiSearch()
        self.topic = topic_extraction.TopicExtraction()


@app.route('/incoming', methods=['GET', 'POST'])
def get():
    if request.method == 'POST':

        # url = request.get_json()
        url = "https://www.youtube.com/watch?v=flthk8SNiiE"

        # Function calls
        captions = web_obj.youtube.url_to_json(url=url)

        # TODO: Change the method to get json file
        topics = web_obj.topic.fetch_transcript(data=captions)

        wiki_urls = dict()
        for topic in topics:
            if web_obj.wiki.check_page(topic):
                wiki_urls[topic] = web_obj.wiki.fetch_url()
                web_obj.wiki.reset()

        return jsonify(wiki_urls)
    else:
        message = {'text': 'Some wiki link'}
        return jsonify(message)


if __name__ == '__main__':
    web_obj = WebTranscripts()
    app.run()