export type OptionData = {
  callLTP: number;
  strikePrice: number;
  putLTP: number;
}

export type MarketResponse = {
  spot: number;
  option_chain: OptionData[];
}

export type MarketIndex = 'NIFTY' | 'BANKNIFTY' | 'CRUDEOIL';