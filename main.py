from flask import Flask

from transcripts.api import topic_extraction, youtube_api, wiki_api, google_api

app = Flask(__name__)


class WebTranscripts:
    def __init__(self):
        self.youtube = youtube_api.YoutubeURLTranscriptions()

        self.wiki = wiki_api.WikiSearch()
        self.google = google_api.GoogleAPI()

        self.topic = topic_extraction.TopicExtraction()
        self.ner = topic_extraction.TokenClassification()
        self.summarization = topic_extraction.TextSummarization()


# @app.route('/incoming', methods=['GET', 'POST'])
def get():
    # if request.method == 'POST':

    # url = request.get_json()
    url = "https://www.youtube.com/watch?v=flthk8SNiiE"

    # Function calls
    captions = web_obj.youtube.url_to_json(url=url)

    # TODO: Change the method to get json file
    topics = web_obj.ner.tokenize(data=captions)

    # TODO: Not using this for now if the end to end is working we will define how to use this
    # ner = web_obj.ner.tokenize(data=captions)
    # summary = web_obj.summarization.summarize(data=captions)

    wiki_urls = dict()
    for topic in topics:
        if web_obj.wiki.check_page(topic):
            wiki_urls[topic] = web_obj.wiki.fetch_url()
            web_obj.wiki.reset()
        else:
            wiki_urls[topic] = web_obj.google.google_search(topic)

    return wiki_urls
    # else:
    #     message = {'text': 'Some wiki link'}
    #     return jsonify(message)


if __name__ == '__main__':
    web_obj = WebTranscripts()
    print(get())
