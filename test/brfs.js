var staticModule = require('../');
var test = require('tape');
var concat = require('concat-stream');
var quote = require('quote-stream');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

test('readFileSync', function (t) {
    t.plan(1);
    var sm = staticModule({
        fs: {
            readFileSync: function (file) {
                return fs.createReadStream(file).pipe(quote());
            }
        }
    }, { vars: { __dirname: path.join(__dirname, 'brfs') } });
    readStream('source.js').pipe(sm).pipe(concat(function (body) {
        vm.runInNewContext(body.toString('utf8'), {
            console: { log: log }
        });
        function log (msg) { t.equal(msg, 'beep boop\n') }
    }));
});

function readStream (file) {
    return fs.createReadStream(path.join(__dirname, 'brfs', file));
}