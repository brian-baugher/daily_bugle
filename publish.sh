#! /bin/bash

cd /home/brian/daily_bugle/
docker build -t brianbaugher/daily-bugle:apache .
docker push brianbaugher/daily-bugle:apache
