'use strict';

var request = require('../request');

module.exports = {
  get(name) {
    return request
      .get(`https://raw.githubusercontent.com/caskroom/homebrew-cask/master/Casks/${name}.rb`)
      .end()
      .then((response) => {
        return response.text;
      });
  },

  parse(name) {
    return this.get(name).then(parse);
  },

  dmg(name) {
    return this.parse(name)
      .then((result) => {
        var script = [];

        script.push(`# ${result.name}`);
        script.push(`curl -L ${result.url} -o /tmp/maclev/${escape(result.name)}.dmg`);
        script.push(`hdiutil attach -mountpoint /Volumes/${escape(result.name)} -nobrowse /tmp/maclev/${escape(result.name)}.dmg`);

        if (result.pkg) {
          script.push(`sudo installer -pkg /Volumes/${escape(result.name)}/${escape(result.pkg)} -target /`);
        } else {
          script.push(`sudo cp -r /Volumes/${escape(result.name)}/${escape(result.app)} /Applications`);
        }

        script.push(`hdiutil detach /Volumes/${escape(result.name)}`);
        script.push(`rm /tmp/maclev/${escape(result.name)}.dmg`);

        return script.join('\n');
      });
  },

  zip(url) {
    return this.parse(url)
      .then((result) => {
        return `# ${result.name}
curl -L ${result.url} -o /tmp/maclev/${escape(result.name)}.zip
unzip -o /tmp/maclev/${escape(result.name)}.zip -d /tmp/maclev
sudo mv /tmp/maclev/${escape(result.app)} /Applications
rm /tmp/maclev/${escape(result.name)}.zip`;
      });
  }
};

function parse(data) {
  var match;
  var resultMatcher = /^\s+([A-Z0-9_]+) ["']?([^"']+)["']?$/gmi;
  var paramMatcher = /#{([^}]+)}/g;
  var result = {};

  while((match = resultMatcher.exec(data)) !== null) {
    let key = match[1];
    let value = match[2];

    result[key] = value;
  }

  while((match = paramMatcher.exec(result.url)) !== null) {
    let key = match[1];
    let param = matchParam(data, key);

    result.url = result.url.replace(new RegExp(`#{${key}}`, 'g'), param);
  }

  return result;
}

function matchString(data, key) {
  return data.match(new RegExp(`${key} ["']([^"']+)["']`));
}

function matchParam(data, key) {
  var parts = key.split('.');

  return parts.slice(1).reduce((previous, current) => {
    switch(current) {
      case 'after_comma':
        return previous.split(',')[1];
    }
  }, matchString(data, parts[0])[1]);
}

function escape(str) {
  return str.replace(/ /g, '\\ ');;
}
