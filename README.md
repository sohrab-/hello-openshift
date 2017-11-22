Hello OpenShift
===

This is an example to demonstrate build and deployment of container applications in [OpenShift Container Platform](https://www.openshift.com).

The application is made up of two pods:

* `heart`: A Java application that responds to HTTP requests on port 8080
* `monitor`: A NodeJS application that consumes `heart`'s REST API and notifies the heart-monitor application in the browser using websockets.

This has been tested on Red Hat CDK 3.2.0-1 (minishift v1.7.0+204ce19).

Setup
---

This repo is used to show how different applications are set up on OpenShift. As such, multiple methods are used.

Before beginning, create a new project:

```shell
oc new-project hello-openshift
```

### Setup `heart` using OpenShift Console

* Choose _Add to Project_ menu item and go to the Catalogue.
* Search and use Red Hat OpenJDK image for the app.
* Use this repo's HTTPS URL and `heart` as context path.

### Setup `monitor` using OpenShift Console

* Choose _Add to Project_ menu item and go to the Catalogue.
* Search and use NodeJS 6 image for the app.
* Use this repo's HTTPS URL and `monitor` as context path.
* Set `PORT` environment variable to `8080`.

### Setup `monitor` using command line

```shell
oc new-app openshift/nodejs:6~https://github.com/sohrab-/hello-openshift.git \
  --name=monitor-omega \
  --context-dir=monitor \
  --env PORT=8080
```

### Setup `monitor` using YAML

```shell
oc apply -f another-monitor.yaml
```

### Setup `monitor` using OpenShift Template

Add the template to OpenShift:

```shell
oc apply -f monitor-template.yaml
```

Then search for the template in the Catalog and create the app.