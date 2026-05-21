import type { CurrenciesConfig, Currency } from '@payloadcms/plugin-ecommerce/types'

export const INR: Currency = {
  code: 'INR',
  decimals: 2,
  label: 'Indian Rupee',
  symbol: '₹',
}

export const currenciesConfig: CurrenciesConfig = {
  defaultCurrency: 'INR',
  supportedCurrencies: [INR],
}
