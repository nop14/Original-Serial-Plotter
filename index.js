// WebSocket用サーバーの立ち上げ(簡易)
const server = require("ws").Server;
const s = new server({ port: 3001 });
// Serial通信のPort解放
const SerialPort = require('serialport').SerialPort;
const SerialPortMock = require('serialport').SerialPortMock;
const { ReadlineParser } = require('@serialport/parser-readline');
SerialPortMock.binding.createPort('/dev/ROBOT');
// Mockの作り方は以下さんしょう
// https://zenn.dev/tatsuyasusukida/articles/nodejs-serialport-mock
class MySerialPortMock extends SerialPortMock { // <2>
    constructor (options, openCallback) {
        super(options, openCallback)
    }

    async write (buffer) {
        super.write(buffer)

      if (buffer.toString() === 'PING') { // <3>
        this.port.emitData(Buffer.from('PONG'))
        }
    }
}
var port = new MySerialPortMock({path: '/dev/ROBOT', baudRate: 9600});

s.on("connection", ws => {
    // TODO: SerialPortが通信できなかった場合の例外処理
    port = new SerialPort({
        path:"COM4",
        baudRate: 9600
    });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


    parser.on('open', function () {
        console.log('Serial open.');
    });

    parser.on('data', function (data) {
        console.log('Data: ' + data);
        // ここでwsを行う
        ws.send(data);
    });
    ws.on("message", message => {
        console.log("Received: " + message);
    });
    // TODO: 接続がキレた時にportをクローズする
    // これであってんのか?
    ws.on('close', () => {
        console.log("closed");
        port.close();
    })
});
