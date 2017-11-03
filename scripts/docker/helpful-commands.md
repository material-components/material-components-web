# Helpful Docker/GCloud/Kubernetes commands

## Run containers locally

```bash
scripts/docker/boss-server/build-local-image.sh && scripts/docker/boss-server/run-local-image.sh
scripts/docker/demo-server/build-local-image.sh && scripts/docker/demo-server/run-local-image.sh
```

## Run containers on GCloud

```bash
scripts/docker/boss-server/publish.sh && scripts/docker/demo-server/publish.sh && scripts/docker/boss-server/run-gcloud-image-remotely.sh
```

## Display available containers/images locally and in GCloud

```bash
gcloud container images list --repository us.gcr.io/material-components-web
docker ps -l
docker images
```

## Clear cache, then build and run local docker container:

```bash
docker kill $(docker ps -q)
docker system prune
docker rmi $(docker images -a -q)
docker build --no-cache -t dev-server .
docker run --interactive --tty -p 8080:8080 dev-test-server
```

## Force the container to run until killed:

```bash
tail -f /dev/null
```

## Start up an interactive shell for a running container:

```bash
docker exec --interactive --tty `docker ps -lq` /bin/bash
kubectl exec -i -t dev-pr-demo-deployment-0-2037253816-076dc -- /bin/bash
```

## Kill a running container:

```bash
docker stop `docker ps -lq`
kubectl delete pod,service,deployment --all
```
