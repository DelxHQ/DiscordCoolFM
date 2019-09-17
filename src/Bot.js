const { Client, RichEmbed } = require('discord.js')

const client = new Client({ disableEveryone: true })

const fetch = require('snekfetch')

const PREFIX = 'cool!'
const API_URI = 'https://listenapi.planetradio.co.uk/api9/initdadi/cool-fm?stationRelated.StationType[]=radio&stationRelated.StationType[]=box%20set&stationBrandRelated.StationType[]=radio&stationBrandRelated.StationType[]=box%20set&include=stationStreams'
const STREAM_URI = 'https://stream-al.planetradio.co.uk/coolfm.mp3?direct=true'

let SONG_INFO = {
  title: '',
  image: '',
  appleMusicUrl: ''
}

setInterval(function () {
  fetchSongInfo()
}, 30 * 1000)

client.on('ready', () => {
  fetchSongInfo()

  setInterval(function () {
    client.user.setPresence({ game: { name: `${SONG_INFO.title}`, type: 'LISTENING' } })
  }, 25 * 1000)
})

client.on('message', async message => {
  if (message.author.bot) return
  if (!message.content.startsWith(PREFIX)) return

  const voiceChannel = message.member.voiceChannel

  if (message.content == PREFIX + 'join') {
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play CoolFM!')

    const broadcast = message.client.createVoiceBroadcast()

    voiceChannel.join().then(connection => {
      message.channel.send(':thumbsup: Successfully joined the voice channel!')

      broadcast.playStream(STREAM_URI)
      connection.playBroadcast(broadcast)
    })
  }

  if (message.content == PREFIX + 'np') {
    message.channel.send(new RichEmbed()
      .setColor('#2B6DC2')
      .setURL(SONG_INFO.appleMusicUrl)
      .setImage(SONG_INFO.image)
      .setTitle(SONG_INFO.title))
  }

  if (message.content == PREFIX + 'leave') {
    await voiceChannel.leave()
    message.channel.send(':no_entry: I have left the voice channel successfully!')
  }
})

async function fetchSongInfo() {
  fetch.get(API_URI).then(r => {
    const body = r.body

    if (!body.stationNowPlaying.nowPlayingImage) return SONG_INFO.image = 'https://static-media.streema.com/media/cache/09/57/095768dc1e9f7255f5549795235f2898.jpg'

    SONG_INFO.title = body.stationNowPlaying.nowPlayingTrack + ' - ' + body.stationNowPlaying.nowPlayingArtist
    SONG_INFO.image = body.stationNowPlaying.nowPlayingImage
    SONG_INFO.appleMusicUrl = body.stationNowPlaying.nowPlayingAppleMusicUrl
  })
}

client.login(process.env.COOL_TOKEN)