#! /bin/bash

cd /home/brian/daily_bugle/kube
docker build brianbaugher/daily-bugle:$1
docker push brianbaugher/daily-bugle:$1 &
wait
kubectl delete pod all-pod
kubectl apply -f node.yaml
