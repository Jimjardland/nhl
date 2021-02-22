import * as moment from 'moment'
import * as queryString from 'query-string'
import { Highlights } from './types'
import { formatGames } from './highlights'
import fetch from 'node-fetch'

export const getHighlights = async (): Promise<Highlights[]> => {
  const params = {
    startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    leaderCategories: 'points,goals,assists',
    leaderGameTypes: 'R',
    expand:
      'schedule.teams,schedule.linescore,schedule.game.content.media.epg,schedule.decisions,schedule.scoringplays,schedule.game.content,team.roster,roster.person',
  }

  const url = `https://statsapi.web.nhl.com/api/v1/schedule?${queryString.stringify(
    params
  )}`

  const response = await fetch(url)
  const gameData = await response.json()

  console.log('gamedata', gameData)

  return gameData?.dates.map((gameDay) => {
    return {
      day: moment(gameDay.date).format('dddd MMMM Do YYYY'),
      games: formatGames(gameDay.games),
    }
  })
}
