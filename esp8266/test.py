from machine import Pin
import utime

led = Pin(2, Pin.OUT, value=1)
led.off() # actually on
utime.sleep_ms(500)
led.on() # actually off