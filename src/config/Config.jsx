const env = {
    API_URL: process.env.REACT_APP_GIENPHIM_BE_API_URL || 'http://localhost:3000/api',
    BE_URL: process.env.REACT_APP_GIENPHIM_BE_URL || 'http://localhost:3000/',
    SIGNALR_URL: process.env.REACT_APP_GIENPHIM_BE_URL+"watchPartyHub"
}

export default env;