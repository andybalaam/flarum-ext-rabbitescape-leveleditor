var flarum = require('flarum-gulp');

flarum({
  modules: {
    'rabbitescape/flarum-ext-rabbitescape-leveleditor': [
      'src/**/*.js'
    ]
  }
});
