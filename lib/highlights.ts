import { Game, PlayerInfo, Goal, PersonInfo } from './types'

const getImageUrl = (id: number): String =>
  `http://nhl.bamcontent.com/images/headshots/current/60x60/${id}@2x.jpg`

const findPersonInfo = (id: Number, personInfo: PersonInfo[]): PersonInfo =>
  personInfo.find((person) => person?.id === id)

interface Item {
  guid: String
  mediastate: String
  mediaPlaybackId: String
  mediaFeedType: String
  callLetters: String
  eventId: String
  language: String
  freeGame: Boolean
  feedName: String
  gamePlus: Boolean
}

interface Epg {
  title: String
  platform: String
  items: Item[]
}

const getPersonInfo = (roster: any): PersonInfo[] =>
  roster.map(({ person }) => ({
    id: person?.id,
    primaryNumber: parseInt(person.primaryNumber, 10),
    nationality: person.nationality,
    captain: person.captain,
  }))

export const formatGames = (games): Game[] => {
  return games.map((game) => {
    const personInfo = getPersonInfo([
      ...game.teams.home.team.roster.roster,
      ...game.teams.away.team.roster.roster,
    ])

    const gameIsFinished = game.linescore.currentPeriodTimeRemaining === 'Final'
    const homeTeam = game.teams.home.team
    return {
      homeTeam: homeTeam.name,
      awayTeam: game.teams.away.team.name,
      homeGoals: game.teams.home.score,
      awayGoals: game.teams.away.score,
      homeWin: game.teams.home.score > game.teams.away.score,
      arena: game.venue.name,
      date: game.gameDate,
      gameIsFinished,
      requiredOvertime:
        gameIsFinished && game.linescore.currentPeriodOrdinal !== '3rd',
      url: getHighlightsUrl(game.content.media.epg),
      stars: getStars(game.decisions, personInfo),
      scorers: getScorers(game.scoringPlays, homeTeam?.id, personInfo),
    }
  })
}

const getStars = (
  { firstStar = {}, secondStar = {}, thirdStar = {} }: any,
  roster: PersonInfo[]
): PlayerInfo[] => {
  return [
    {
      ...firstStar,
      position: 1,
      image: getImageUrl(firstStar?.id),
      personInfo: findPersonInfo(firstStar?.id, roster),
    },
    {
      ...secondStar,
      position: 2,
      image: getImageUrl(secondStar?.id),
      personInfo: findPersonInfo(secondStar?.id, roster),
    },
    {
      ...thirdStar,
      position: 3,
      image: getImageUrl(thirdStar?.id),
      personInfo: findPersonInfo(thirdStar?.id, roster),
    },
  ]
}

const getScorers = (
  data: any,
  homeTeamId: number,
  roster: PersonInfo[]
): [Goal] => {
  return data.map((play) => {
    const scorer = play.players.find((info) =>
      info.playerType === 'Scorer' ? info : null
    )
    const assist = play.players.filter((info) =>
      info.playerType === 'Assist' ? info : null
    )

    return {
      scorer: {
        ...scorer,
        personInfo: findPersonInfo(scorer.player?.id, roster),
      },
      assist: assist.map((assist) => ({
        ...assist,
        personInfo: findPersonInfo(assist.player?.id, roster),
      })),
      homeTeamScored: homeTeamId === play.team?.id,
      description: play.result.description,
      standing: `${play.about.goals.home}-${play.about.goals.away}`,
      gwg: play.result.gameWinningGoal,
      emptyNet: play.result.emptyNet,
      strength: play.result.strength.code,
      period: play.about.ordinalNum,
      time: play.about.periodTime,
    }
  })
}

export const getHighlightsUrl = (epgs: Epg[]): String => {
  let videoId
  for (let i = 0; i < epgs.length; i++) {
    const epg = epgs[i]

    if (epg.items.length) {
      switch (epg.title) {
        case 'Recap':
          videoId = epg.items[0].mediaPlaybackId || false
          break
        case 'Extended Highlights':
          videoId = epg.items[0].mediaPlaybackId || false
          break
      }
    }
  }
  return videoId
    ? `https://www.nhl.com/video/embed/c-${videoId}&autoplay=true`
    : null
}
