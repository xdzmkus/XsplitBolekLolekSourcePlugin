/***
    * Browser
    * This document explains how to use MQTT over WebSocket with the ws and wss protocols.
    * EMQX's default port for ws connection is 8083 and for wss connection is 8084.
    * Note that you need to add a path after the connection address, such as /mqtt.
    */
const url = 'wss://broker.emqx.io:8084/mqtt'
const topic = 'diamond/lolek/history'

// Create an MQTT client instance
const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: 'lolek',
  username: '',
  password: '',
}

function getCommonMatchInfo(splitedValues){
  return{
    player1Name: splitedValues[0],
    player2Name: splitedValues[1],

    player1MatchPoint: splitedValues[7],
    player2MatchPoint: splitedValues[8],

    player1Break: splitedValues[12] == 0 ? true : false,

    player1FramePoint: splitedValues[15],
    player2FramePoint: splitedValues[16]
  }
}

var xjs = require('xjs');

xjs.ready().then(function() {

    const client  = mqtt.connect(url, options)

    client.on('connect', function () {
      console.log('Connected')
      // Subscribe to a topic
      client.subscribe(topic, function (err) {
        if (err) {
            console.log(err)
        }
      })
    })

    // Receive messages
    client.on('message', function (topic, message)
    {
      console.log(message.toString());

      var splitedValues = message.toString().split('~');
      var commonMatchInfo = getCommonMatchInfo(splitedValues);

      document.getElementById('ply1-name').innerHTML = commonMatchInfo.player1Name;
      document.getElementById('ply2-name').innerHTML = commonMatchInfo.player2Name;

      document.getElementById('ply1-match-score').innerHTML = commonMatchInfo.player1MatchPoint;
      document.getElementById('ply2-match-score').innerHTML = commonMatchInfo.player2MatchPoint;

      document.getElementById('ply1-frame-score').innerHTML = commonMatchInfo.player1FramePoint ? commonMatchInfo.player1FramePoint : "";
      document.getElementById('ply2-frame-score').innerHTML = commonMatchInfo.player2FramePoint ? commonMatchInfo.player2FramePoint : "";

      if (commonMatchInfo.player1Break)
      {
        document.getElementById('ply1-break').style.visibility = "visible";
        document.getElementById('ply2-break').style.visibility = "hidden";
      }
      else
      {
        document.getElementById('ply1-break').style.visibility = "hidden";
        document.getElementById('ply2-break').style.visibility = "visible";
      }

      /**  Дмитрий~Константин~Игрок 3~0~0~0~1~6~0~0~0~0~1800~0~SNKR~9~0~1~18~1~2~
        * tocken 1 - игрок 1
        * tocken 2 - игрок 2
        * tocken 3 - игнор
        * tocken 4 - фора игрока 1 в снукере
        * tocken 5 - фора игрока 2 в снукере
        * tocken 6 - игнор
        * tocken 7 - игнор
        * tocken 8 - очки игрока 1 в матче
        * tocken 9 - очки игрока 2 в матче
        * tocken 10 - игнор
        * tocken 11 - игнор
        * tocken 12 - игнор
        * tocken 13 - '0' - разбой игрока 1; '1800' - разбой игрока 2
        * tocken 14 - игнор
        * tocken 15 - [optional] - 'SNKR' - играют в снукер
        * tocken 16 - [optional] - очки игрока 1 в снукере
        * tocken 17 - [optional] - очки игрока 2 в снукере
        * tocken 18 + [optional] - игнор

      */
    })
})
