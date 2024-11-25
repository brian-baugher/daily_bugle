#!/bin/bash

cd /home/brian/daily_bugle/kube
kind delete cluster
kind create cluster --config cluster.yaml &
wait
kubectl apply -f volume.yaml 
kubectl apply -f claim.yaml
kubectl apply -f node.yaml &
wait
kubectl port-forward all-pod 3010:80