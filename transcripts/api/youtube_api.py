import json
import re

from youtube_transcript_api import YouTubeTranscriptApi


class YoutubeURLTranscriptions:

    def url_to_json(self, url):
        video_id = re.search(r"v=(?P<video_id>[a-zA-Z\d_\-]+)", url).group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = self.clean_transcripts(transcript)
        return json.dumps(transcript)

    @staticmethod
    def clean_transcripts(transcript):
        cleaned_transcripts = list()
        for item in transcript:
            cleaned_transcripts.append(item['text'])
        return cleaned_transcripts


if __name__ == "__main__":
    class_name = YoutubeURLTranscriptions()
    print(class_name.url_to_json("https://www.youtube.com/watch?v=flthk8SNiiE"))
