import * as moment from 'moment'
import * as queryString from 'query-string'
import { Highlights } from './types'
import { formatGames } from './highlights'
import { getStandings } from './standings'
import fetch from 'node-fetch'

export const getHighlights = async (
  startDate?: string,
  endDate?: string
): Promise<Highlights[]> => {
  const params = {
    startDate: startDate || moment().subtract(3, 'days').format('YYYY-MM-DD'),
    endDate: endDate || moment().format('YYYY-MM-DD'),
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

  const highlights = gameData?.dates.map((gameDay) => {
    return {
      day: moment(gameDay.date).format('dddd MMMM Do YYYY'),
      date: gameDay.date,
      games: formatGames(gameDay.games),
    }
  })

  return highlights.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export const standings = async () => await getStandings()

export const getHighlightsAndStandings = async (
  startDate?: string,
  endDate?: string
): Promise<{highlights: Highlights[], standings: any[]}> => {
  const [highlights, standings] = await Promise.all([getHighlights(startDate, endDate), getStandings()])

  return {
    standings,
    highlights
  }
}
