'use strict';

var requireDir = require('require-dir');

var addons = requireDir('../addons');
var applications = requireDir('../addons/applications');
var environments = requireDir('../addons/environments');

module.exports = function(req, res) {
  var options = {
    applications: req.query.applications ? req.query.applications.split(',') : [],
    environments: req.query.environments ? req.query.environments.split(',') : [],
    shell: req.query['shell'] || '',
    brewFormulas: req.query['brew-formulas'] ? req.query['brew-formulas'].split(',') : [],
    brewCasks: req.query['brew-casks'] ? req.query['brew-casks'].split(',') : [],
    javaVersions: req.query['java-versions'] ? req.query['java-versions'].split(',') : [],
    javaDefault: req.query['java-default'],
    nodeVersions: req.query['node-versions'] ? req.query['node-versions'].split(',') : [],
    nodeDefault: req.query['node-default'],
    nodeModules: req.query['node-modules'] ? req.query['node-modules'].split(',') : [],
    rubyVersions: req.query['ruby-versions'] ? req.query['ruby-versions'].split(',') : [],
    rubyDefault: req.query['ruby-default'],
    rubyGems: req.query['ruby-gems'] ? req.query['ruby-gems'].split(',') : [],
    pythonVersions: req.query['python-versions'] ? req.query['python-versions'].split(',') : [],
    pythonDefault: req.query['python-default'],
    pythonPackages: req.query['python-packages'] ? req.query['python-packages'].split(',') : []
  };

  loadAddons()
    .then(function(parts) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="maclev.sh"');

      res.end(parts.filter(function(part) {return !!part;}).join('\n\n'));
    })
    .catch((e) => {throw e});

  function loadAddons() {
    return Promise.all([
      addons.base(options),
      addons.shell(options)
    ].concat(
      options.environments.filter((name) => !!environments[name]).map((name) => environments[name](options)),
      options.applications.filter((name) => !!applications[name]).map((name) => applications[name](options))
    ).concat([
      addons.brew(options),
      addons.finalize(options)
    ]));
  }
};
