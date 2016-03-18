'use strict';

var parser = require('./cask-parser');

module.exports = {
  dmg(name) {
    return parser.parse(`https://raw.githubusercontent.com/caskroom/homebrew-cask/master/Casks/${name}.rb`)
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

        result.binary && Object.keys(result.binary).forEach((key) => {
          script.push(`sudo ln -s /Applications/${escape(key)} /usr/local/bin/${result.binary[key]}`);
        });

        script.push(`hdiutil detach /Volumes/${escape(result.name)}`);
        script.push(`rm /tmp/maclev/${escape(result.name)}.dmg`);

        return script.join('\n');
      });
  },

  zip(name) {
    return parser.parse(`https://raw.githubusercontent.com/caskroom/homebrew-cask/master/Casks/${name}.rb`)
      .then((result) => {
        return `# ${result.name}
curl -L ${result.url} -o /tmp/maclev/${escape(result.name)}.zip
unzip -o /tmp/maclev/${escape(result.name)}.zip -d /tmp/maclev
sudo mv /tmp/maclev/${escape(result.app)} /Applications
rm /tmp/maclev/${escape(result.name)}.zip`;
      });
  }
};

function escape(str) {
  return str.replace(/ /g, '\\ ');;
}
