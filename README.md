## How to start
Run k8s dashboard: `kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443`
Forward apache: `kubectl port-forward all-pod 3010:80`
Forward mongo: `kubectl port-forward all-pod mongo 27017:27017`

Scripts to update docker images in each service `npm run publish`
Script to update apache image `bash publish.sh`
Script to apply changes from published images `bash apply.sh`

## Status checks
`kubectl get pod all-pod`
`kubectl describe pod all-pod`
`kubectl logs all-pod -c <container> -f`
