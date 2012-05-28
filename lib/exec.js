const EXEC = require("child_process").exec;

var path = require('path');

function findFullPathForCommand(command) {
  var usePathExt = false;

  // assume the command executable name is seperated from possible options by
  // a space here
  var commandSplitted = command.split(' ');
  //console.log(commandSplitted);

  var executableName = commandSplitted[0];
  commandSplitted.shift();

  // check if someone specified the exact path to the executable, then we
  // do not need to do anything here
  if (path.existsSync(executableName)) {
    return command;
  }

  // check if we got an extension provided, else we need to check the PATHEXT
  if (path.extname(executableName) == '') {
    usePathExt = true;
  }

  var allPathDirs = process.env.Path.split(';');
  //console.log(allPathDirs);

  var allPathExt = process.env.PATHEXT.split(';');
  //console.log(allPathExt);

  for (var item in allPathDirs) {
    item = allPathDirs[item];

    if (usePathExt) {
      for (var extension in allPathExt) {
        extension = allPathExt[extension];
        var fullPathToCheck = path.join(item, executableName + extension);
        //console.log(fullPathToCheck);
        if (path.existsSync(fullPathToCheck)) {
          commandSplitted.unshift('"' + fullPathToCheck + '"');
          var newCommandToExecute = commandSplitted.join(' ');
          console.log('node-exec: ' + newCommandToExecute);
          return newCommandToExecute;
        }
      }
    } else {
      var fullPathToCheck = path.join(item, executableName);
      //console.log(fullPathToCheck);
      if (path.existsSync(fullPathToCheck)) {
        commandSplitted.unshift('"' + fullPathToCheck + '"');
        var newCommandToExecute = commandSplitted.join(' ');
        console.log('node-exec: ' + newCommandToExecute);
        return newCommandToExecute;
      }
    }
  }
}

function exec(command /*, options, callback */) {
  var args, options, callback;

  if (typeof arguments[1] === 'function') {
    options = undefined;
    callback = arguments[1];
  } else {
    options = arguments[1];
    callback = arguments[2];
  }

  command = findFullPathForCommand(command);

  EXEC(command, options, callback);
}

// only do special exec handling on windows, 
// defaults to normal exec for other platforms
if (process.platform == 'win32') {
  exports.exec = exec;
} else {
  exports.exec = EXEC;
}