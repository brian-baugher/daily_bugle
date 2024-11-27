#! /bin/bash

kubectl delete pod all-pod
kubectl apply -f /home/brian/daily_bugle/kube/node.yaml
