import { Game, PlayerInfo, Goal, PersonInfo, Item, Epg } from './types'

const getImageUrl = (id: number): String =>
  `http://nhl.bamcontent.com/images/headshots/current/60x60/${id}@2x.jpg`

const findPersonInfo = (id: number, personInfo: PersonInfo[]): PersonInfo =>
  personInfo.find((person) => person?.id === id)

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
      awayTeam: game.teams.away.team?.name,
      homeGoals: game.teams.home?.score,
      awayGoals: game.teams.away?.score,
      homeWin: game.teams.home?.score > game.teams.away?.score,
      arena: game.venue?.name,
      date: game?.gameDate,
      gameIsFinished,
      requiredOvertime:
        gameIsFinished && game.linescore?.currentPeriodOrdinal !== '3rd',
      stars: getStars(game.decisions, personInfo),
      scorers: getScorers(game.scoringPlays, homeTeam?.id, personInfo),
      url: getHighlightsUrl(game.content.media.epg),
    }
  })
}

const getStars = (stars: any, roster: PersonInfo[]): PlayerInfo[] => {
  if (!stars) return []
  return [
    {
      ...stars.firstStar,
      position: 1,
      image: getImageUrl(stars.firstStar?.id),
      personInfo: findPersonInfo(stars.firstStar?.id, roster),
    },
    {
      ...stars.secondStar,
      position: 2,
      image: getImageUrl(stars.secondStar?.id),
      personInfo: findPersonInfo(stars.secondStar?.id, roster),
    },
    {
      ...stars.thirdStar,
      position: 3,
      image: getImageUrl(stars.thirdStar?.id),
      personInfo: findPersonInfo(stars.thirdStar?.id, roster),
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

export const getHighlightsUrl = (epgs: Epg[]): string => {
  const [extendedHighlights] = epgs.filter(
    (x) => x.title === 'Extended Highlights'
  )

  if (extendedHighlights.items) {
    const [item] = extendedHighlights.items

    const [playback] =
      item?.playbacks.filter((a) => a.name === 'HTTP_CLOUD_MOBILE') || []

    return playback?.url
  }

  return null
}
