import re

from youtube_transcript_api import YouTubeTranscriptApi


class YoutubeURLTranscriptions:

    def url_to_transcipts(self, url):
        video_id = self.url_to_id(url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript

    def url_to_json(self, url):
        video_id = self.url_to_id(url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = self.clean_transcripts(transcript)
        return transcript

    @staticmethod
    def url_to_id(url):
        return re.search(r"v=(?P<video_id>[a-zA-Z\d_\-]+)", url).group(1)

    @staticmethod
    def clean_transcripts(transcript):
        cleaned_transcripts = list()
        for item in transcript:
            text = re.sub('[^A-Za-z0-9.,:;\'\"?!]', ' ', item['text'])
            cleaned_transcripts.append(text)
        cleaned_transcripts = " ".join(cleaned_transcripts)
        return cleaned_transcripts


if __name__ == "__main__":
    class_name = YoutubeURLTranscriptions()
    output = class_name.url_to_json("https://www.youtube.com/watch?v=IUAHUEy1V0Q&t=1024s")
    print(output)