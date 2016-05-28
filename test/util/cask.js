'use strict';

var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
var expect = require('chai').use(chaiAsPromised).expect;
var mockery = require('mockery');

describe('Cask', function() {
  var cask;
  var parser;
  var result;
  var url;

  before(function() {
    parser = {
      parse: sinon.stub()
    };

    url = 'https://raw.githubusercontent.com/caskroom/homebrew-cask/master/Casks/foo-bar.rb';

    mockery.enable({useCleanCache: true});
    mockery.registerMock('./cask-parser', parser);
    mockery.registerAllowable('../../lib/util/cask');
  });

  beforeEach(function() {
    parser.parse.reset();
    cask = require('../../lib/util/cask');
  });

  after(function() {
    mockery.disable();
  });

  it('should return the correct script for a DMG', function() {
    result = {
      version: '1.2.3',
      name: 'Foo Bar',
      app: 'Foo Bar.app',
      url: 'http://foo-bar.com/Foo-Bar.dmg'
    };

    parser.parse.withArgs(url).returns(Promise.resolve(result));

    return expect(cask.dmg('foo-bar')).to.eventually.equal(`# Foo Bar
curl -L http://foo-bar.com/Foo-Bar.dmg -o /tmp/maclev/Foo\\ Bar.dmg
hdiutil attach -mountpoint /Volumes/Foo\\ Bar -nobrowse /tmp/maclev/Foo\\ Bar.dmg
sudo cp -R /Volumes/Foo\\ Bar/Foo\\ Bar.app /Applications
hdiutil detach /Volumes/Foo\\ Bar
rm /tmp/maclev/Foo\\ Bar.dmg`);
  });

  it('should return the correct script for a DMG containing a PKG', function() {
    result = {
      version: '1.2.3',
      name: 'Foo Bar',
      pkg: 'Foo Bar.pkg',
      url: 'http://foo-bar.com/Foo-Bar.dmg'
    };

    parser.parse.withArgs(url).returns(Promise.resolve(result));

    return expect(cask.dmg('foo-bar')).to.eventually.equal(`# Foo Bar
curl -L http://foo-bar.com/Foo-Bar.dmg -o /tmp/maclev/Foo\\ Bar.dmg
hdiutil attach -mountpoint /Volumes/Foo\\ Bar -nobrowse /tmp/maclev/Foo\\ Bar.dmg
sudo installer -pkg /Volumes/Foo\\ Bar/Foo\\ Bar.pkg -target /
hdiutil detach /Volumes/Foo\\ Bar
rm /tmp/maclev/Foo\\ Bar.dmg`);
  });

  it('should return the correct script for a DMG with binaries', function() {
    result = {
      version: '1.2.3',
      name: 'Foo Bar',
      app: 'Foo Bar.app',
      url: 'http://foo-bar.com/Foo-Bar.dmg',
      binary: {
        'Foo Bar.app/Contents/Resources/app/foo.sh': 'foo',
        'Foo Bar.app/Contents/Resources/app/bar.sh': 'bar'
      }
    };

    parser.parse.withArgs(url).returns(Promise.resolve(result));

    return expect(cask.dmg('foo-bar')).to.eventually.equal(`# Foo Bar
curl -L http://foo-bar.com/Foo-Bar.dmg -o /tmp/maclev/Foo\\ Bar.dmg
hdiutil attach -mountpoint /Volumes/Foo\\ Bar -nobrowse /tmp/maclev/Foo\\ Bar.dmg
sudo cp -R /Volumes/Foo\\ Bar/Foo\\ Bar.app /Applications
sudo ln -s /Applications/Foo\\ Bar.app/Contents/Resources/app/foo.sh /usr/local/bin/foo
sudo ln -s /Applications/Foo\\ Bar.app/Contents/Resources/app/bar.sh /usr/local/bin/bar
hdiutil detach /Volumes/Foo\\ Bar
rm /tmp/maclev/Foo\\ Bar.dmg`);
  });

  it('should return the correct script for a ZIP', function() {
    result = {
      version: '1.2.3',
      name: 'Foo Bar',
      app: 'Foo Bar.app',
      url: 'http://foo-bar.com/Foo-Bar.zip'
    };

    parser.parse.withArgs(url).returns(Promise.resolve(result));

    return expect(cask.zip('foo-bar')).to.eventually.equal(`# Foo Bar
curl -L http://foo-bar.com/Foo-Bar.zip -o /tmp/maclev/Foo\\ Bar.zip
unzip -o /tmp/maclev/Foo\\ Bar.zip -d /tmp/maclev
sudo mv /tmp/maclev/Foo\\ Bar.app /Applications
rm /tmp/maclev/Foo\\ Bar.zip`);
  });

  it('should return the correct script for a ZIP with binaries', function() {
    result = {
      version: '1.2.3',
      name: 'Foo Bar',
      app: 'Foo Bar.app',
      url: 'http://foo-bar.com/Foo-Bar.zip',
      binary: {
        'Foo Bar.app/Contents/Resources/app/foo.sh': 'foo',
        'Foo Bar.app/Contents/Resources/app/bar.sh': 'bar'
      }
    };

    parser.parse.withArgs(url).returns(Promise.resolve(result));

    return expect(cask.zip('foo-bar')).to.eventually.equal(`# Foo Bar
curl -L http://foo-bar.com/Foo-Bar.zip -o /tmp/maclev/Foo\\ Bar.zip
unzip -o /tmp/maclev/Foo\\ Bar.zip -d /tmp/maclev
sudo mv /tmp/maclev/Foo\\ Bar.app /Applications
sudo ln -s /Applications/Foo\\ Bar.app/Contents/Resources/app/foo.sh /usr/local/bin/foo
sudo ln -s /Applications/Foo\\ Bar.app/Contents/Resources/app/bar.sh /usr/local/bin/bar
rm /tmp/maclev/Foo\\ Bar.zip`);
  });
});

