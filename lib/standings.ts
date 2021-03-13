import fetch from 'node-fetch'


export const getStandings = async () : Promise<any> => {
  const getSeason = () => {
    const d = new Date(),
      year = d.getFullYear()

    if(d.getMonth() >= 9) {
      return year + '' + (year + 1)
    } else {
      return (year - 1) + '' + year
    }
  }

	const season = getSeason()
	const url = `https://statsapi.web.nhl.com/api/v1/standings?expand=standings.record,standings.team,standings.division,standings.conference,team.schedule.next,team.schedule.previous&season=${season}`;
  const response = await fetch(url)
  const standings = await response.json()

  return standings?.records.map(({ division, teamRecords}) => ({
    division: division.name,
    teamRecords: teamRecords.map(post => ({
      team: post.team.name,
      points: post.points,
      ...post.leagueRecords,
      ...post.streak,
      gamesPlayed: post.gamesPlayed,
      divisionRank: post.divisionRank,
      leagueRank: post.leagueRank
    }))
  }))
}