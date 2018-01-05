import network
import utime
from machine import Pin
import gc
from umqtt.robust import MQTTClient
from config import *

def main():
    led = Pin(2, Pin.OUT, value=1)

    def sub_cb(topic, msg):
        led.off() # actually on
        utime.sleep_ms(500)
        led.on() # actually off

    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    sta_if.connect(WLAN_ESSID, WLAN_PASSWORD)
    while not sta_if.isconnected():
        utime.sleep_ms(1)
    print("WLAN Connected")

    c = MQTTClient(MQTT_ID, MQTT_SERVER, user=MQTT_USERNAME, password=MQTT_PASSWORD)
    c.DEBUG = True
    c.set_callback(sub_cb)
    c.connect(clean_session=False)
    c.subscribe(MQTT_TOPIC)
    print("MQTT Connected")

    gc.collect()

    while True:
        c.check_msg()
        utime.sleep_ms(10)

    c.disconnect()

if __name__ == "__main__":
    main()