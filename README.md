Welcome to my little side project.

http://probe.hky.me

This application is a proof of concept for probe request capture, logging and display.
Data displayed on the site was captured from a portable device in a tree in my front yard.
I live on a busy street, so I'm seeing about 2500 unique devices per day.

### Agent

* TP-Link TL-MR3040 portable router in sta mode connected to local wifi
* OpenWRT Chaos Calmer 15.05.1
* 4 port USB hub since the router only has 1 USB port
* Ralink RT5370 USB wifi adapter in monitor mode
* 16Gb USB Dongle filesystem overlay
* 16500 mAh Battery i have two of these and I swap them every 12 hours or so
* tcpdump -l -i wlan0 -tttt -e -s 256 type mgt subtype probe-req
* curl -X POST -d "$line" "$url"

### Server

* Centos 6 VPS on Digital Ocean
* NodeJS 400 lines of really simple Express
* MySQL 5 tables

### Client

* Javascript Vanilla JS w/ some AJAX, this is a prototype. Don't judge me.
* HTML 5
* CSS

This data is "live" in the sense that it is being continually fed from the agent to the server.
If you refresh the page, you will get new results.
