var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var PlayCharacteristic = require('./lib/playCharacteristic');

var name = 'i-board';
var serviceUuids = ['8000']


bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(name, serviceUuids);
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'))
    if (error) { return }

    var service = new BlenoPrimaryService({
        uuid: '8000',
        characteristics: [
            new PlayCharacteristic()
        ]
    });
    bleno.setServices([service]);
});

bleno.on('advertisingStop', function() {
    console.log('advertiseingstop');
});

bleno.on('advertisingStartError', function(error) {
    console.log('advertisingstartError');
});

bleno.on('accept', function(clientAddress) {
    console.log('accept');
});

bleno.on('disconnect', function(clientAddress) {
    console.log('disconnect');
});

bleno.on('servicesSet', function(error) {
    console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'))
});

bleno.on('servicesSetError', function(error) {
    console.log('serviceseterror');
});
