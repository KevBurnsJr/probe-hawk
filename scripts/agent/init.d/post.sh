#! /bin/sh /etc/rc.common
# Probe-Hawk daemon
# chkconfig: 345 20 80
# description: Probe-Hawk daemon
# processname: Probe-Hawk

START=75
STOP=15
EXTRA_COMMANDS="status"
EXTRA_HELP="        status  Get service status"

DAEMON_PATH="/root"
DAEMON="/root/post.sh"
DAEMONOPTS=""

NAME="post"
DESC="post daemon"
PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

start() {
        printf "%-50s" "Starting $NAME..."
        cd $DAEMON_PATH
        PID=`$DAEMON $DAEMONOPTS >> /root/logs/post.log 2>&1 & echo $!`
        #echo "Saving PID" $PID " to " $PIDFILE
        if [ -z $PID ]; then
            printf "%s\n" "Fail"
        else
            echo $PID > $PIDFILE
            printf "%s\n" "Ok"
        fi
}

status() {
        printf "%-50s" "Checking $NAME..."
        if [ -f $PIDFILE ]; then
            PID=`cat $PIDFILE`
            if [ -z "`ps axf | grep ${PID} | grep -v grep`" ]; then
                printf "%s\n" "Process dead but pidfile exists"
            else
                echo "Running"
            fi
        else
            printf "%s\n" "Service not running"
        fi
}

stop() {
        printf "%-50s" "Stopping $NAME"
            PID=`cat $PIDFILE`
            cd $DAEMON_PATH
        if [ -f $PIDFILE ]; then
	    CPIDS=`pgrep -P $PID|xargs`
            kill $PID
	    for CPID in $CPIDS; do kill $CPID; done
            printf "%s\n" "Ok"
            rm -f $PIDFILE
        else
            printf "%s\n" "pidfile not found"
        fi
}

