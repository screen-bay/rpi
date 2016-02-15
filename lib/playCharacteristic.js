var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;


var PlayCharacteristic = function() {
    PlayCharacteristic.super_.call(this, {
        uuid: '8001',
        properties: ['write', 'notify'],
        value: null
    });

    this._fileName = '';
    this._data = new Buffer(0);
    this._updateValueCallback = null;
};

util.inherits(PlayCharacteristic, BlenoCharacteristic);


PlayCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

    // handle actions
        // parse json
    if (this._isJSON(data)) {
        console.log('PlayCharacteristic - onWriteRequest: value = ' + data);

        var json = JSON.parse(data);
        if (json && json.action) {
            if (json.action === 'i-board play start') { this._startPlaying(json) }
            if (json.action === 'i-board play done') { this._donePlaying() }
        }
    }
        // receive data
    else {
        this._mergeData(data);
    }

    // callback
    if (this._updateValueCallback) {
        console.log('EchoCharacteristic - onWriteRequest: notifying');
        this._updateValueCallback(null);
    }
    callback(this.RESULT_SUCCESS);
};

PlayCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('PlayCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
};

PlayCharacteristic.prototype.onUnsubscribe = function() {
    console.log('PlayCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
};

PlayCharacteristic.prototype.onNotify = function() {
    console.log('PlayCharacteristic - onNotify');
};

PlayCharacteristic.prototype.onIndicate = function() {
    console.log('PlayCharacteristic - onIndicate');
};



PlayCharacteristic.prototype._isJSON = function(data) {
    try { JSON.parse(data); }
    catch (error) { return false; }
    return true;
}

PlayCharacteristic.prototype._executeShell = function(shell) {
    var exec = require('child_process').exec;
    exec(shell, function(error, stdout, stderr){
        console.log("execute: " + shell);
        if (error) { console.log("result: " + error); }
        else { console.log("result: " + stdout); }
    });
};

PlayCharacteristic.prototype._fileDoesExist = function(fileName) {
    var fs = require('fs');
    return fs.existsSync(fileName);
}

PlayCharacteristic.prototype._save = function(data) {
    var fs = require('fs');
    fs.writeFile(this._fileName, data, function(error) {
        if(error) { console.log(error); return; }
    });
};


PlayCharacteristic.prototype._startPlaying = function(json) {
    var path = '../rpi-rgb-led-matrix/images/'+json['file']

    this._data = new Buffer(0);
    this._fileName = path;
};

PlayCharacteristic.prototype._mergeData = function(data) {
    this._data = Buffer.concat([this._data, new Buffer(data)]);
}

PlayCharacteristic.prototype._donePlaying = function() {
    if (this._data.length > 0) {
        console.log('saving: ' + this._fileName);
        this._save(this._data);
    }

    var fileDoesExist = this._fileDoesExist(this._fileName);
    console.log(this._fileName + ' exists: ' + fileDoesExist);

    if (fileDoesExist) {
        //var shell = 'echo "test"'
        var shell = 'python ../rpi-rgb-led-matrix/play.py -i ' + this._fileName;
        this._executeShell(shell);
    }

    this._data = new Buffer(0);
    this._fileName = '';
};


module.exports = PlayCharacteristic;
