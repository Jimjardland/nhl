import * as got from 'got'
import * as moment from 'moment'
import * as queryString from 'query-string'
import { formatGames } from './highlights'

export const getHighlights = async (from?, to?) => {
  const params = {
    startDate: from || moment().subtract(1, 'days').format('YYYY-MM-DD'),
    endDate: to || moment().format('YYYY-MM-DD'),
    leaderCategories: 'points,goals,assists',
    leaderGameTypes: 'R',
    expand:
      'schedule.teams,schedule.linescore,schedule.game.content.media.epg,schedule.decisions,schedule.scoringplays,schedule.game.content,team.roster,roster.person',
  }

  const url = `https://statsapi.web.nhl.com/api/v1/schedule?${queryString.stringify(
    params
  )}`

  const { body: gameData } = await got(url, {
    json: true,
    headers: { 'Content-type': 'application/json' },
  })

  return gameData.dates.map((gameDay) => {
    return {
      day: moment(gameDay.date).format('dddd MMMM Do YYYY'),
      games: formatGames(gameDay.games),
    }
  })
}
