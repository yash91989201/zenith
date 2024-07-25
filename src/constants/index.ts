export const PRICING_CARDS = [
  {
    title: 'Starter',
    description: 'Perfect for trying out plura',
    duration: '',
    price: 0,
    highlight: 'Key features',
    features: ['3 Sub accounts', '2 Team members', 'Unlimited pipelines'],
    priceId: '',
  },
  {
    title: 'Basic',
    description: 'The ultimate agency kit',
    price: 999,
    duration: 'month',
    highlight: 'Key features',
    features: ['Rebilling', '24/7 Support team'],
    priceId: 'price_1Pg0kvSIZuVcLiYwyWoGT9df',
  },
  {
    title: 'Unlimited Saas',
    description: 'For serious agency owners',
    price: 1_999,
    duration: 'month',
    highlight: 'Everything in Starter, plus',
    features: ['Unlimited Sub accounts', 'Unlimited Team members'],
    priceId: 'price_1Pg0kvSIZuVcLiYwKEjbFDhe',
  },
]

export const ADD_ON_PRODUCTS = [
  { title: 'Priority Support', id: 'prod_QXVzzd6Q90t3vZ' },
]

export const OAUTH_ACCOUNT_OPTIONS = ["github", "google"] as const

export const ACCEPTED_FILE_MIME_TYPES = {
  AGENCY_LOGO: ["image/webp", "image/jpg", "image/png", "image/svg"],
};

export const MAX_FILE_SIZE = {
  API_ROUTE: 4 * 1024 * 1024
}