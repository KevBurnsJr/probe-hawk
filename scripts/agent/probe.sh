#! /bin/sh

# This is in a while loop beacuse wlan0 isn't always initialized on system startup.
# Adding the while loop ensures that the probe becomes active after reboot.
while true
do
	tcpdump -l -i wlan0 -tttt -e -s 256 type mgt subtype probe-req >> /root/dump.log
	sleep 1
done
