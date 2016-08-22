// Upload just build task to VSTS...
// tfx build tasks upload --task-path ./
// tfx build tasks delete --task-id 7346cf50-6858-11e6-b59a-6fe0ce03f800

// Upload extension VSTS...
// tfx extension create --manifest-globs .\vss-extension.json
// Upload to https://marketplace.visualstudio.com/manage/


// toolrunner help
// https://github.com/Microsoft/vsts-task-lib/blob/be60205671545ebef47d3a40569519da9b4d34b0/node/docs/vsts-task-lib.md

import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import path = require('path');
import fs = require('fs');
import mdit = require('markdown-it');
import lazyHeaders = require('markdown-it-lazy-headers');

async function run() {
    try {
		let markdownPath = tl.getPathInput('markdownPath', true, true);
		let htmlPath = tl.getPathInput('htmlPath', true);
		
		tl.debug("Reading markdown file " + markdownPath +" (UTF-8)...");
		fs.readFile(markdownPath, 'utf8', function (err, data) {
			if (err) {
				throw err;
			}
			
			tl.debug("Reading file " + markdownPath + " succeeded!");
	  
			var md = mdit().use(lazyHeaders);
			
			tl.debug("Rendering markdown to html...");
			var result = md.render(data);
			tl.debug("Rendering markdown to html succeeded!");

			tl.debug("Writing HTML file " + htmlPath +"...");
			tl.writeFile(htmlPath, result);
			tl.debug("Writing HTML file " + htmlPath +" succeeded!");
			
			tl.setResult(tl.TaskResult.Succeeded, "Successfully transformed markdown file " + markdownPath + " to HTML file " + htmlPath);
		});
    }
    catch (err) {
        // handle failures in one place
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
// var path = require('path');
// var tl = require('vso-task-lib');

// // var echo = new tl.ToolRunner(tl.which('echo', true));

// var markdownPath = tl.getInput('markdownPath', true);

// var fs = require('fs');
// fs.readFile(markdownPath, 'utf8', function (err, data) {
	// if (err) {
		// return console.log(err);
	// }
  
	// var md = require('markdown-it')();
	// var result = md.render(data);

	// console.log(result);
// });

// // var msg = tl.getInput('msg', true);
// // echo.arg(msg);

// // var cwd = tl.getPathInput('cwd', false);

// // will error and fail task if it doesn't exist
// // tl.checkPath(cwd, 'cwd');
// // tl.cd(cwd);

// // echo.exec({ failOnStdErr: false})
// // .then(function(code) {
    // // tl.exit(code);
// // })
// // .fail(function(err) {
    // // console.error(err.message);
    // // tl.debug('taskRunner fail');
    // // tl.exit(1);
// // })
