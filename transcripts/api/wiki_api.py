import wikipediaapi

from transcripts.constants import constants


class WikiSearch:
    def __init__(self, language='en', set_logger=False):
        self.wiki_api = wikipediaapi.Wikipedia(language)
        self.current_page = None
        if set_logger:
            self._set_logger()

    @staticmethod
    def _set_logger():
        wikipediaapi.log.setLevel(level=wikipediaapi.logging.DEBUG)

        wikipediaapi.logging.basicConfig(filename=constants.LOG_FILE_PATH,
                                         format='%(asctime)s %(message)s')

    @staticmethod
    def validate_input(page=None):
        if isinstance(page, str):
            return True
        else:
            return False

    def check_page(self, topic=None):
        if self.validate_input(topic):
            try:
                wiki_topic = self.wiki_api.page(topic)
                self.current_page = wiki_topic
            except Exception:
                raise Exception("Unknown Server Error")
        else:
            raise Exception("Provide a topic")

        return wiki_topic.exists()

    def fetch_url(self, url_type='canonical'):
        if url_type == 'canonical':
            return self.current_page.canonicalurl
        elif url_type == 'full':
            return self.current_page.fullurl
        else:
            raise Exception("Invalid url type")

    def fetch_categories(self, top=5):
        categories = self.current_page.categories
        filtered_categories = list()
        for title in categories.keys():
            if any(topic in categories[title].title.lower() for topic in constants.CATEGORIES_STOP_LIST):
                continue
            try:
                category = categories[title].title.replace("Category:", "")
            except Exception:
                raise Exception("Issue with Category Filtering")

            filtered_categories.append(category)
        return filtered_categories[:top]

    def fetch_page(self):
        return self.current_page

    def fetch_summary(self, words_limit=100):
        if isinstance(words_limit, int):
            return self.current_page.summary[:words_limit]
        else:
            raise Exception("Invalid words limit range: Must be an integer")

    def reset(self):
        self.current_page = None


if __name__ == "__main__":
    wikipedia_object = WikiSearch()

    if wikipedia_object.check_page('Gradient'):
        # print(wikipedia_object.fetch_page())
        categories = wikipedia_object.fetch_categories()
        print(wikipedia_object.fetch_url(), categories)
        wikipedia_object.reset()
