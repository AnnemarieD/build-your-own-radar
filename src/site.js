require('./common')
require('./images/749px-AD_Etos_Logo_Positive.jpg')
require('./images/radar_legend.png')
require('./gtm.js')
require('./assets/TechRadar.csv')

// const GoogleSheetInput = require('./util/csvFactory')
// const GoogleSheetInput = require('./util/factory')
// const GoogleSheetInput = require('./util/inlineFactory')
const GoogleSheetInput = require('./util/fileFactory')

GoogleSheetInput().build()
