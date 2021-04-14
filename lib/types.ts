export type PlayerInfo = {
  id: number
  fullName: string
  position: string
  image: string
  imageHttp: string
  personInfo: PersonInfo
}

export type Highlights = {
  day: string
  date: string
  games: Game[]
}

export type Playbacks = {
  name: string
  width?: string
  height?: string
  url: string
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
  lastPeriod: string
  url: string
  recapUrl: string
  stars: [PlayerInfo]
  scorers: [Goal]
  periodInfoLive: {
    currentPeriod: String
    currentPeriodTimeRemaining: String
  }
}

export interface Item {
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
  playbacks: Playbacks[]
}

export interface Epg {
  title: String
  platform: String
  items: Item[]
}
