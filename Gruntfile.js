module.exports = function(grunt) {

  var _ = require("underscore");
  var path = require("path"),
  	  fs = require("fs");
  	  
  var mySetting = grunt.file.readJSON('./devconfig/dev_task_config.json');
  var getFileListToDelete = function(filePath, excludes, blnWithSub) {
    excludes = excludes || [];
  	var files = fs.readdirSync(filePath);
  	var result = [];
  	_.each(files, function(afile) {
  		var fileTmp = "";
  		if (_.indexOf(excludes, afile) > -1) {
  			fileTmp = "!";
  		}
  		if (blnWithSub && fs.statSync(path.join(filePath, afile)).isDirectory()) {
  				fileTmp += afile + "/**";
  			} else {
  				fileTmp += afile;
  			}
  		result.push(fileTmp);
  	});
  	return result;
  };
  (function prepareDirectoriesNeeded(){
    if (!fs.existsSync(mySetting.destDir)) {
    	fs.mkdirSync(mySetting.destDir);
    }
  })();
  
  
  var copy_exclude_files = [
  	'node_modules', 
  	'helper_doc',
  	'devconfig',
  	'Gruntfile.js',
  	'npm-debug.log',
  	'README.md',
  	'.git',
  	'.gitignore',
  	'.project'
  ];
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
//    uglify: {
//      options: {
//        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
//      },
//      build: {
//        src: 'test/<%= pkg.name %>.js',
//        dest: 'build/<%= pkg.name %>.min.js'
//      }
//    },
    copy: {
    	main: {
    		files: [
    			{ 
    				expand: true, 
    				cwd: '.',
    				src: getFileListToDelete('.', copy_exclude_files, true), 
    				dest: mySetting.destDir,
    				filter: function(filePath) {
    					var _ext = path.extname(filePath);
    					return _ext !== '.styl';
    				}
    			}
    		]
    	}
    },
    clean: {
    	options: {
    		force: true
    	},
    	build: {
    		files: [
    			{
    				expand: true,
    				cwd: mySetting.destDir,
    				src: getFileListToDelete(mySetting.destDir, ["node_modules"])
    			}
    		]
    	},
    	buildAll: {
    		files: [
    			{
    				expand: true,
    				cwd: mySetting.destDir,
    				src: ['**']
    			}
    		]
    	}
    },
    stylus: {
    	compile: {
    		options: {
    			compress: false
    		},
    		files: [
	    		{
	    			expand: true,
	    			cwd: '.',
	    			src: ['./public/stylesheets/**/*.styl'],
	    			dest: mySetting.destDir,
	    			ext: '.css'
	    		}
    		]
    	}
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.registerTask('update_config', 'just a test function', function() {
  	grunt.task.requires('copy:main');
  	var config_file = path.join(mySetting.destDir, 'routes', 'common', 'config', 'config.js');
  	var configStr = fs.readFileSync(config_file).toString();
  	configStr = configStr.replace("<user>", mySetting.dbConfig.user)
  							.replace("<password>", mySetting.dbConfig.password)
  							.replace("<database>", mySetting.dbConfig.database)
  							.replace("<host>", mySetting.dbConfig.host)
  							.replace("<port>", mySetting.dbConfig.port)
  							.replace("<charset>", mySetting.dbConfig.charset)
  							.replace("<debug>", mySetting.dbConfig.debug);
  	fs.writeFileSync(config_file, configStr);
  });

  // Default task(s).
  grunt.registerTask('default', ['copy:main', 'stylus:compile', 'update_config']);
  //grunt.registerTask('default', ['update_config']);

};