#!/bin/bash

docker start kind-control-plane &
wait
kubectl port-forward all-pod 3010:80