exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
      joinTo:
       'app.js': /^app|^bower_components/
      order:
        before: [
          'bower_components/three.js/three.js',
          'app/js/vendors/loaders/OBJLoader.js',
          'app/js/vendors/OrbitControls.js'
        ]
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'

  plugins:
    postcss:
      processors: [
        require('autoprefixer')(['last 8 versions'])
      ]
