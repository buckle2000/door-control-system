const MQTT_SERVER = "io.adafruit.com"
const MQTT_USERNAME = "buckle2000"
const MQTT_PASSWORD = "8ba17416dc744946b2cbcf276381f5e3"
const MQTT_TOPIC = "buckle2000/feeds/747501"

const mqtt = require('mqtt')
const inspect = require('util').inspect
const express = require('express')
const app = express()

const users = []

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
// show users
app.get('/users', (req, res) => {
  res.send(`Existing users: ${inspect(users)}`)
})
// create user
app.post('/users', (req, res) => {
  const id = new_id()
  res.send(`Your new user id is ${id}`)
  users.push(id)
})
// query
app.get('/users/:id', (req, res) => {
  if (users.indexOf(req.params.id) !== -1) {
    res.send('Valid user')
  } else {
    res.send('Invalid user')
  }
})
// trigger
app.post('/users/:id', (req, res) => {
  if (users.indexOf(req.params.id) !== -1) {
    trigger()
    res.send('Triggered!')
  } else {
    res.send('Invalid user')
  }
})
// delete user
app.delete('/users/:id', (req, res) => {
  let index = users.indexOf(req.params.id)
  if (index !== -1) {
    res.send('Deleted')
    users.pop(index)
  } else {
    res.send('Invalid user')
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function new_id() {
  return Math.random().toString(16).substr(2, 8)
}

function trigger() {
  const client = mqtt.connect(`mqtts://${MQTT_SERVER}`, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
  })
  client.on('connect', function () {
    client.publish(MQTT_TOPIC, '1')
    client.end()
  })
}