# Gong - Client

A node service for playing gong when told by [Gong Backend][gong-backend].

# Dependencies

- [Gong Backend][gong-backend]
- mpg123: For playing sound

# Developement

  npm install
  npm run start

# Configuration
Set environment varibles

CLIENT_NAME: Name of instance (male_house, dhamma_hall, kitchen, ...). Default: First found mac address

MQTT_SERVER: IP or hostname of MQTT server. Default: localhost

# Communication

Service connects to MQTT message broker and subscribes to topics.

## ping
Respond by publish a *pong*.

## pong
Containing this data:

- name
- timestamp-millis
- timestamp

## play
Wait until the next even second, then play gong sound.
Pubvlishes *scheduled*.

## scheduled
Containting this data:

- name
- timestamp-millis
- timestamp
- scheduled-millis
- scheduled

## played
Publish after gong has been played with this data:

- name
- timestamp-millis
- timestamp

# Time keeping
To improve synchronization of sound being played, sync time to local NTP server regularly. Instead of playing sound directly when message is received, which can take different amount of time to different devices, play based on time in short future. 

# Optional hardware

To prevent static noise from speakers a relay can be used to keep the circuit open when not playing.

If using a device with GPIO a simple relay can be connected to this.

# See also

[Gong Backend][gong-backend]

[Gong Client][gong-client]

[gong-backend]: https://github.com/Dhamma-Sobhana/gong-backend

[gong-frontend]: https://github.com/Dhamma-Sobhana/gong-frontend
