require('./common')
require('./images/749px-AD_Etos_Logo_Positive.jpg')
require('./images/radar_legend.png')
require('./gtm.js')

const GoogleSheetInput = require('./util/csvFactory')
//const GoogleSheetInput = require('./util/factory')
//const GoogleSheetInput = require('./util/inlineFactory')

GoogleSheetInput().build()
