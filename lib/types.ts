export type PlayerInfo = {
  id: number
  fullName: string
  position: string
  image: string
  personInfo: PersonInfo
}

export type PersonInfo = {
  id: number
  primaryNumber: number
  nationality: string
  captain: boolean
}

export type Player = {
  player: PlayerInfo
  seasonTotal: number
  personInfo: PersonInfo
}

export type Goal = {
  scorer: Player
  assist: [Player]
  homeTeamScored: boolean
  gwg: boolean
  emptyNet: boolean
  strength: string
  period: string
  time: string
  description: string
  standing: string
}

export type Game = {
  homeTeam: string
  awayTeam: string
  homeGoals: number
  awayGoals: number
  homeWin: boolean
  arena: string
  date: string
  gameIsFinished: boolean
  requiredOvertime: boolean
  url: string
  stars: [PlayerInfo]
  scorers: [Goal]
}
