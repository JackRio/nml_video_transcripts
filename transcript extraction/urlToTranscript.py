from youtube_transcript_api import YouTubeTranscriptApi
import json
import re

class YoutubeURLTranscriptions:

    def url_to_json(url):
        video_id = re.search(r"v=(?P<video_id>[a-zA-Z\d_\-]+)", url).group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return json.dumps(transcript)
