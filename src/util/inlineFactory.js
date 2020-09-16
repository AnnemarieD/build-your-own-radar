document.title = 'Etos Tech Radar'

// store data inline directly as a table...
const rawDataTable = [
    [ 'name',                          'ring',   'quadrant',               'isNew', 'description' ],
    ['WebdriverIO',                 'Adopt',    'tools',                        'FALSE',    'description'],
    ['UFT',                         'Adopt',    'tools',                        'FALSE',    'description'],
    ['Leapwork',                    'Assess',   'tools',                        'TRUE',     '<p>Leapwork is used within Gall and AH for testing Oracle applications. A license is available. We have to decide if we want to use this tool at Etos</p>'],
    ['Selenium',                    'Adopt',    'tools',                        'FALSE',    '<p>A tool to use browser functionality in automated tests</p>'],
    ['Jenkins',                     'Adopt',    'tools',                        'FALSE',    'Tool where the CICD job pipelines are configured and deployment can be triggered from it'],
    ['OpenShift',                   'Adopt',    'platforms',                    'FALSE',    'Its a platform where jenkins is been configured'],
    ['Kubernetes',                  'Adopt',    'techniques',                   'FALSE',    'Tool used to build and implement Jenkins'],
    ['SonarQube',                   'Adopt',    'tools',                        'FALSE',    'Code quality checker'],
    ['Java',                        'Adopt',    'languages-and-frameworks',     'FALSE',    '<p>Used as programming language for automated tests for Oracle systems in combination with Selenium.<p>'],
    ['JavaScript',                  'Adopt',    'languages-and-frameworks',     'FALSE',    '<p>Used as programming language for automated tests for web shop.<p>'],
    ['Nexus Artifact Repository',   'Adopt',    'tools',                        'FALSE',    'Artifact repository which has backup code and existing packages'],
    ['Github',                      'Adopt',    'tools',                        'TRUE',     'Code Repository migrated from bitbucket'],
    ['Bitbucket',                   'Adopt',    'tools',                        'FALSE',    'Code Repository']
]

// which will need to be converted to an array of objects...
const rawData = rawDataTable.slice(1).map(function(x) {
    // likely a better way to do this ?
    var response = {}
    for (var i = 0; i < x.length; i++)  {
        response[rawDataTable[0][i]] = x[i];
    }
    return response
})

const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
};

const InputSanitizer = require('./inputSanitizer');
const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const ContentValidator = require('./contentValidator');
const ExceptionMessages = require('./exceptionMessages');

const InlineSheet = function () {
    var self = {};

    self.build = function () {
        var columnNames = Object.keys(rawData[0])

        var contentValidator = new ContentValidator(columnNames);
        contentValidator.verifyContent();
        contentValidator.verifyHeaders();

        var all = rawData;
        var blips = _.map(all, new InputSanitizer().sanitize);
        var rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
        var ringMap = {};
        var maxRings = 4;

        _.each(rings, function (ringName, i) {
            if (i == maxRings) {
                throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
            }
            ringMap[ringName] = new Ring(ringName, i);
        });

        var quadrants = {};
        _.each(blips, function (blip) {
            if (!quadrants[blip.quadrant]) {
                quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
            }
            quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
        });

        var radar = new Radar();
        _.each(quadrants, function (quadrant) {
            radar.addQuadrant(quadrant)
        });

        var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
        new GraphingRadar(size, radar).init().plot();
    };

    return self;
};

module.exports = InlineSheet;