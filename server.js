//TODO 1. 获取当前命令执行所在目录
//TOOD 2. 获取当前所有目录文件
//TODO 3. 返回目录列表为网页形式
//TODO 4. 访问文件返回文件(可能需要mime module)
//TODO 5. 访问目录返回新的文件列表
//TODO 6. 支持文件过滤
//


var fileDir = process.cwd();
var mime = require('mime');

var http = require('http'),
	util = require('util'),
	url = require('url'),
	querystring = require('querystring'),
	fs = require('fs');

var pathMapping = {
    
};
var configPath = process.env.HOME + '/.localserver/config.js';

var initPathMapping = function() {
    var config = fs.readFileSync(configPath).toString();
    pathMapping = JSON.parse(config);   
};
(function() {
    initPathMapping();
    fs.watch(configPath, function() {
        initPathMapping();
    });
}());

http.createServer( function(req, res) {
	var urlObj = url.parse(req.url),
   		queryObj,
		isDelay = false;
	//res.writeHeader(200, {'Content-Type': 'text/plain'});
	//res.end('Hello World\n');
	initPath(urlObj);
	if (urlObj.query) {
		queryObj = querystring.parse(urlObj.query);
		if (queryObj.timeout) {
			var timeout = parseInt(queryObj.timeout) || 1;
			isDelay = true;
			setTimeout( function() {
			    renderPath(urlObj, res);
			}, timeout);	
		}	
	}
	if (urlObj.pathname.indexOf('favicon.ico') > -1) {
	    res.write('<html><title>title</title><head></head><body></html>');	
	    return;
	}
	if (!isDelay) {
		renderPath(urlObj, res);
	}
}).listen(2000, '127.0.0.1');

var initPath = function(urlObj) {
    var paths = urlObj.pathname.split('/');
    var context = paths.splice(1,1)[0];
    urlObj.pathname = paths.join('/') || '/';
    urlObj.context = context;
    fileDir = pathMapping[context] || process.cwd(); 
};

var renderPath = function(urlObj, res) {
    Type.getTypeObj(urlObj).output(res);
};

var filter = process.argv && process.argv[2];
if ( filter ) filter = new RegExp(filter);


var Type = function(urlObj) {
	this.contentType = 'text/html';
	this.data = [];
	this.path = urlObj.path;
	this.pathname = urlObj.pathname
	this.context = urlObj.context; 
};
Type.prototype = {
	outputHeader: function(res) {
		res.writeHeader(200, {'Content-Type': this.contentType +  ';charset=UTF-8'});
	},
	outputHtmlHead: function(res) {
		res.write('<html><title>title</title><head></head><body>');	
	},
	outputHtmlBody: function(res) {
		res.write('' + this.getData());
	},
	outputHtmlEnd: function(res) {
		res.end('</body></html>');
	},
	output: function(res) {
		this.outputHeader(res);
		this.outputHeader(res);
		this.outputHtmlHead(res);
		this.outputHtmlBody(res);
		this.outputHtmlEnd(res);
	},
	getData: function() {
		throw new Error('This Is A Abstract Class');	
	},
    getContentType: function() {
        return mime.lookup(this.pathname);                
    }
};
var getType = function(path) {
	var index = path.lastIndexOf('.');
	if (index < 0) {
		return "dir";
	}	
	return path.substring(index + 1, path.length);
};
Type.getTypeObj = function(urlObj) {
	if (getType(urlObj.pathname) === 'dir') {
		return new DirType(urlObj);
	} 	
	return new FileType(urlObj);
};
var DirType = function() {
	Type.apply(this, arguments);
};
util.inherits(DirType, Type);

DirType.prototype.getData = function() {
	var that = this;
	var data = [];
	var realPath = fileDir + this.pathname;
	try {
        this.fileList = fs.readdirSync(realPath).filter(function(name) {
            if (filter) {
                return filter.test(name); 
            }
            return name.indexOf('.') != 0;
        }).forEach(function(name) {
            data.push(that.getLink(name));
        });
	    return data.join('<br/>');
	} catch (e) {
	    return "not found!";
	}
};

DirType.prototype.getLink = function(title) {
	return '<a href="' + this.path + '/' + title + '">' + title + '</a>';
};

var FileType = function() {
	Type.apply(this, arguments);
	this.contentType = this.getContentType(this.pathname);
};
util.inherits(FileType, Type);
FileType.prototype.output = function(res) {
	this.outputHeader(res);
	var n = 1024 * 1024;
	var buffer = new Buffer(n);
	/**
	var data = fs.read(fileDir + this.path, buffer, function(err, data) {
        res.write(data);    	
        res.end();        
	});
	**/
    var rs = fs.createReadStream(fileDir + this.pathname);
    rs.on('open', function(fd) {
        readLargeFile(n, fd, buffer, 0, res); 
    });
};

var readLargeFile = function(n, fd, buffer, i, res) {
    fs.read(fd, buffer, 0, n, n*i, function(err, bytesRead, b) {
        i++;
        if (bytesRead == n) {
            res.write(buffer);
            readLargeFile(n, fd, buffer, i, res);
        } else {
            res.end(buffer.slice(0, bytesRead)); 
        }
   }); 
};




