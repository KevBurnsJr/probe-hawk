#! /bin/sh

#url='http://requestb.in/qyavdxqy'
url='http://probe.hky.me/load-direct?agent=1'
tail /root/dump.log -f -n0 | while read line
do
		if [ -n "$line" ]; then
				curl -s -i -H "Content-Type: text/plain" -X POST -d "$line" "$url" > /dev/null
		fi
done
