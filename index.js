/**
 * @index
 * @author  stylehuan
 * @create  2015-04-23 22:31
 */
var through = require("through2");
var gutil = require("gulp-util");
var path = require("path");
var fs = require("fs");
var crypto = require("crypto");

var regBegin = /<!--\s*entry:(\w+)\s*-->/;
var regEnd = /<!--\s*endentry\s*-->/;
var getBlocks = function (content) {
    var lines = content.replace(/\r\n/g, '\n').split(/\n/),
        block = false,
        last = [];

    lines.forEach(function (l) {
        var begin = l.match(regBegin),
            end = regEnd.test(l);

        if (begin) {
            block = true;
        }

        if (block && end) {
            last.push(l);
            block = false;
        }

        if (block && last) {
            last.push(l);
        }
    });
    return last;
}
var maps = {},
    createMd5 = function (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },
    getUrlFileName = function (url) {
        var temp = url.split("/");
        return temp[temp.length - 1].split(".")[0];
    };

module.exports = function () {

    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
            return;
        }
        var blocks = getBlocks(file.contents.toString());
        var reg = /src=['"](.+)['"](?=\stype="text\/javascript")/;

        if (!blocks || !blocks.length) {
            cb();
            return;
        }
        var jsPath = blocks[1].match(reg)[1]
        //同步读取数据
        var data = fs.readFileSync(path.join("src", jsPath));

        if (data) {
            //生成hash
            var hash = createMd5(data).slice(0, 8);
            //获取文件名
            var filename = getUrlFileName(jsPath);
//                                maps[filename + "_" + hash] = assetList[k][kk]["assets"][0];

            maps[filename + "_" + hash] = jsPath;
        }

        this.push(new gutil.File({
            base: path.join(__dirname),
            cwd: __dirname,
            path: path.join(__dirname),
            contents: new Buffer(JSON.stringify(maps, null, '  '))
        }));
        // 执行回调，和下一个操作对接
        cb();
    });

}