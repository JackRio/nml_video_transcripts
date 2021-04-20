import pprint

from googleapiclient.discovery import build


class GoogleAPI:

    WIKI_LINK = 'en.wikipedia.org'

    def __init__(self):
        self.my_api_key = "AIzaSyCcCKQTFFrCxS9vIC8GO-r5Ax7DTDntwEg"
        self.my_cse_id = "1a7642359f2b7b50d"

    def search(self, search_term, api_key, cse_id, num):
        service = build("customsearch", "v1", developerKey=api_key)
        res = service.cse().list(q=search_term, cx=cse_id, num=num).execute()
        return res['items']

    @staticmethod
    def fetch_link(responses):
        # TODO: Check if response is there
        link = responses[0]['link']
        for response in responses:
            if response['displayLink'] == GoogleAPI.WIKI_LINK:
                link = response['link']
                break

        return link

    def google_search(self, topic):
        results = self.search(
            topic,
            self.my_api_key,
            self.my_cse_id,
            num=3)

        result_link = self.fetch_link(results)
        return result_link
