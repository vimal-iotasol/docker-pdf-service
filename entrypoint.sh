#!/bin/bash

# Start SSH server
/usr/sbin/sshd

# Start your application
exec node index.js