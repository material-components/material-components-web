# Docker, Google Cloud, and CrossBrowserTesting

## Docker Setup

* Mac: [Official installer](https://docs.docker.com/engine/installation/)
* gLinux: go/installdocker

## Google Cloud Setup

Install Kubernetes CLI:

```bash
gcloud components install kubectl
```

## Authentication

In order to run the container images on GCloud or do CBT screenshot testing, you need to add two files to
`scripts/docker/boss-server/runtime/auth/`.

TODO(acdvorak): Store these files in a private, shared place that only team members have access to.

### 1. `cbt-account.bash.inc`

```bash
export CBT_USERNAME=...
export CBT_AUTHKEY=...
```

TODO(acdvorak): Ask CBT if it's possible to create a service account

### 2. `gcloud-service-account.json`

When you create a new Service Account in the GCP console, there's a button to download its credentials as a JSON file.
