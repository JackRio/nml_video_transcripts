import re

from youtube_transcript_api import YouTubeTranscriptApi


class YoutubeURLTranscriptions:

    def url_to_transcipts(self, url):
        video_id = re.search(r"v=(?P<video_id>[a-zA-Z\d_\-]+)", url).group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript

    def url_to_json(self, url):
        video_id = re.search(r"v=(?P<video_id>[a-zA-Z\d_\-]+)", url).group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = self.clean_transcripts(transcript)
        return transcript

    # TODO: Send transcript from an endpoint

    @staticmethod
    def clean_transcripts(transcript):
        cleaned_transcripts = list()
        for item in transcript:
            cleaned_transcripts.append(item['text'])
        cleaned_transcripts = " ".join(cleaned_transcripts)
        return cleaned_transcripts


if __name__ == "__main__":
    class_name = YoutubeURLTranscriptions()
    output = class_name.url_to_transcipts("https://www.youtube.com/watch?v=flthk8SNiiE")
