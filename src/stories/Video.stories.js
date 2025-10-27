import '@ecu-dmt/ecu-component-library'

import { html } from 'lit'

// This default export determines where your story goes in the story list
export default {
  title: 'Example/Video',
  tags: ['autodocs'],
  component: 'ecu-video',
  render: ({
    videoID,
    playlistID,
    isVimeo
  }) => html`
    <div class="max-w-screen-md">
      <ecu-video .videoid=${videoID} .playlistid=${playlistID} .vimeo=${isVimeo}>
        <span class="sr-only">Video. Meet Helen Halton, Director of Postgraduate Nursing Studies and Nurse Practitioner at ECU's Chronic Disease Wellness Clinic. Play video</span>
      </ecu-video>
    </div>
  `
}

export const ShowYoutube = {
  name: 'Show YouTube Video',
  args: {
    videoID: 'bVhmAnrnNss',
    playlistID: '',
    isVimeo: false
  }
}

export const ShowYoutubePlaylist = {
  name: 'Show YouTube Playlist',
  args: {
    videoID: 'pVC5fw2MioE',
    playlistID: 'PL4D98974BDEA7B2CD',
    isVimeo: false
  }
}

export const ShowVimeo = {
  name: 'Show YouTube Vimeo',
  args: {
    videoID: '655102517',
    playlistID: '',
    isVimeo: true
  }
}
