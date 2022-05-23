const { randomUUID } = require('crypto');
const { networkInterfaces } = require('os')

let mqtt = require('mqtt');
var player = require('play-sound')(opts = {})

let name = process.env.CLIENT_NAME || getMac() || randomUUID()
let server = process.env.MQTT_SERVER || 'localhost'

let client  = mqtt.connect(`mqtt://${server}`);
let topics = ['ping', 'play']

/*
 * Check for interfaces that looks like physical ones and return the first found mac address.
 */
function getMac() {
  const validInterfaces = ['eth0', 'en0', 'wlan0']
  let interfaces = networkInterfaces()

  for (const interface of validInterfaces) {
    if (interface in interfaces) {
      return interfaces[interface][0].mac
    }
  }
}

client.on('connect', function () {
  console.log('Connected! Listening for topics:\n', topics.join(', '))
  for (let topic of topics) {
    client.subscribe(topic)
  }
})

function playGong() {
  player.play('sound/static_sound_gong_gong-x2.mp3', function(err) {
    if (err) throw err

    let now = new Date().getTime()
    payload = {
      "name": name,
      "timestamp-millis": now,
      "timestamp": new Date(now).toISOString(),
    }
    client.publish(`played`, JSON.stringify(payload));
  })
}


client.on('message', function (topic, message) {
  let data = undefined
  try {
    data = JSON.parse(message)
  } catch {}
  
  console.log(topic, data)

  if (topic === 'ping') {
    // Respond that I am alive
    let now = new Date().getTime()
    let payload = {
      "name": name,
      "timestamp-millis": now,
      "timestamp": new Date(now).toISOString()
    }
    client.publish(`pong`, JSON.stringify(payload));
  } else if (topic == 'play') {
    // Play gong on set time
    let now = new Date().getTime()
    let future = parseInt(now / 1000) * 1000 + 1000
    let delay = future - now
    setTimeout(playGong, delay)

    let payload = {
      "name": name,
      "timestamp-millis": now,
      "timestamp": new Date(now).toISOString(),
      "scheduled-millis": future,
      "scheduled": new Date(future).toISOString()
    }
    client.publish(`scheduled`, JSON.stringify(payload));
  }
})

console.log(`Gong client starting. ID: ${name}\nConnecting to MQTT server..`)