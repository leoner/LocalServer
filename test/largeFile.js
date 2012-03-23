
var p = '/Users/kanghui/Movies/Limitless.2011.R5.LiNE.XviD-iLG.avi';
var fs = require('fs');
var n = 1024 * 1024;
var b1 = new Buffer(n)
var b2 = new Buffer(n)
var b3 = new Buffer(n)

var rs = fs.createReadStream(p);
//var ws = fs.createWrite;
var i = 1;
var readLargeFile = function(fd, buffer, i) {
   fs.read(fd, buffer, 0, n, n*i, function(err, bytesRead, b) {
        console.log('i--->' + buffer.length + '-----' + b.length + '---' + bytesRead);
        i++;
        if (bytesRead == n) {
            readLargeFile(fd, buffer, i);
        }
   }); 
};
rs.on('open', function(fd, aa) {
    readLargeFile(fd, b1, 0);
});

/**
rs.on('open', function(fd, aa) {
    fs.read(fd, b1, 0, n, 1, function(err, bytesRead, buffer) {
        console.log(err)
        console.log(bytesRead)
        console.log(buffer);
        if (bytesRead < n) {
            fs.read(fd, b1, 0, n, n*i + 1, function(err, bytesRead, buffer) {
                console.log(err)
                console.log(bytesRead)
                console.log(buffer);
            });
            i++;
            console.log("r---->" + i);
        }
    });
    fs.read(fd, b2, 0, n, 2, function(err, bytesRead, buffer) {
        console.log(22222);
        console.log(err)
        console.log(bytesRead)
        console.log(buffer);
    });
    fs.read(fd, b3, 0, n, 3, function(err, bytesRead, buffer) {
        console.log(33333);
        console.log(err)
        console.log(bytesRead)
        console.log(buffer);
    });
});
**/
rs.on('close', function() {
    console.log('file closed');
});
/**
**/
