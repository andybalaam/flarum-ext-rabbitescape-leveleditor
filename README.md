# Flarum extension to include the Rabbit Escape Level Editor

This is an extension to the [Flarum](https://flarum.org/) forum to include the
[level editor](https://github.com/andybalaam/rabbit-escape-level-editor) for
the Android+PC game
[Rabbit Escape](http://artificialworlds.net/rabbit-escape/).

## Development setup

* [Install a local
  Flarum](https://www.artificialworlds.net/blog/2018/08/22/installing-flarum-on-ubuntu-18-04/),
  but put it in /var/www/html/rabbit-escape/levels instead of
  /var/www/html/flarum
* [Set up an extension dev
  environment](https://www.artificialworlds.net/blog/2018/09/06/writing-a-new-flarum-extension-on-ubuntu/),
  but clone this repo into workbench, instead of creating an extension
  directory inside
* Follow [Extension quick start](https://flarum.org/docs/extend/start/) to get
  a working extension setup.
* Run `composer update` inside /var/www/html/rabbit-escape/levels
* Run `php flarum cache:clear; rm assets/rev-manifest.json` inside /var/www/html/rabbit-escape/levels
* Run `sudo chown -R www-data:www-data assets storage/*` inside /var/www/html/rabbit-escape/levels
* Run `npm install` inside
  /var/www/html/rabbit-escape/levels/workbench/flarum-ext-rabbitescape-leveleditor/js/forum
* Launch `gulp watch` inside
  /var/www/html/rabbit-escape/levels/workbench/flarum-ext-rabbitescape-leveleditor/js/forum

Go to http://localhost/rabbit-escape/levels - if you make changes to PHP and
JavaScript files inside the extension directory you should see them reflected
when you refresh the page.

## How to create levels

Go to https://www.artificialworlds.net/rabbit-escape/levels/ and get involved!

## Where to log issues

When you find a problem in the level editor forum it's difficult to tell whether it's a bug in the Flarum integration (this repo) or in the level editor code (which is at https://github.com/andybalaam/rabbit-escape-level-editor).  To keep it simple:

**Log all issues in the Level Editor repo at https://github.com/andybalaam/rabbit-escape-level-editor/issues**
