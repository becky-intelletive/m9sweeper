---
title: "Monitoring & Alerting"
linkTitle: "Monitoring & Alerting"
weight: 4
description: >
  Monitoring your cluster's security 
---

M9sweeper assumes that you utilize [kube-prom-stack](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack)
to monitor your cluster. You will need to set up [Prometheus](https://prometheus.io/) independently, but the built-in charts
will magically hook into it from there.


