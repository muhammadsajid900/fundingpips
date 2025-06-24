export interface Stock {
  symbol: string
  name?: string
  price: number
  change: number
  changePercent: number
  volume?: number
  exchange?: string
  marketCap?: number
  high52Week?: number
  low52Week?: number
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  marketOpen: string
  marketClose: string
  timezone: string
  currency: string
  matchScore: string
}
