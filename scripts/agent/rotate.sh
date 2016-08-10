#! /bin/sh
date=$(date -D '%s' +%Y-%m-%d -d "$(( `date +%s`-24*60*60 ))")
dest="/root/backup/dump.$date.log"
if [ -f $dest ]; then
	echo "$dest already exists"
else
	echo "Rotating to $dest"
	mv /root/dump.log $dest
	/etc/init.d/probe restart
	/etc/init.d/post restart
fi
