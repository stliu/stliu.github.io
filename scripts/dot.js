// 'use strict';
var execSync = require('child_process').execSync;
var util = require('util');
var pathFn = require('path');
var fs = require('hexo-fs');

hexo.extend.tag.register('digraph', function(args, content){
	var digraphName = args[0];
	var digraph = 'digraph ' + digraphName + ' {\n' + content + '}';
	var filename = digraphName+'.png';
	 if(!fs.existsSync(this.asset_dir)){
	 fs.mkdirSync(this.asset_dir);	
	 }
	 
	 
	var fullpath = pathFn.join(this.asset_dir, filename);
	var command = 'dot -Tpng -o'+fullpath;
	execSync(command,{input: digraph});
  return '<img src="/'+this.path+filename+'"/>';
}, {ends: true, async: false});