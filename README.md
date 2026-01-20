# OpenTelemetry Node.js Proof of Concept

This project demonstrates a full observability stack for a Node.js application using OpenTelemetry.

Telemetry data (metrics, logs, and traces) is collected from a sample Node.js application and sent to a suite of tools for storage and visualization.

## Architecture

The `docker-compose.yaml` file orchestrates the following services:

1.  **`nodejs-app`**: A sample Node.js application. It is automatically instrumented using OpenTelemetry's Node.js SDK, which is loaded via the `NODE_OPTIONS` environment variable.
2.  **`otel-collector`**: The OpenTelemetry Collector receives telemetry data from the `nodejs-app` over OTLP (OpenTelemetry Protocol). Based on the configuration in `otel-config.yaml`, it processes and exports the data to the appropriate backends.
3.  **`prometheus`**: A time-series database that scrapes and stores metrics from the `otel-collector`.
4.  **`loki`**: A log aggregation system that receives and stores logs from the `otel-collector`.
5.  **`tempo`**: A distributed tracing backend that receives and stores traces from the `otel-collector`.
6.  **`grafana`**: A visualization platform. It is pre-configured with Prometheus, Loki, and Tempo as data sources, allowing you to query and view all your telemetry data in one place.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Create the Docker Network

The services in this stack communicate over a pre-defined external Docker network. You must create it before starting the services.

```sh
docker network create otel-poc-network
```

### 2. Start the Services

Run the following command from the root of the project to build the Node.js app image and start all the services in the background.

```sh
docker-compose up -d --build
```

## Accessing Services

Once the stack is running, you can access the various user interfaces:

| Service         | URL                   | Credentials                  |
| :-------------- | :-------------------- | :--------------------------- |
| **Grafana**     | http://localhost:3000 | Anonymous access is enabled. |
| **Prometheus**  | http://localhost:9090 | N/A                          |
| **Node.js App** | http://localhost:8080 | N/A                          |

In Grafana, you can navigate to the "Explore" tab to query metrics from Prometheus, logs from Loki, and traces from Tempo.

## Stopping the Stack

To stop and remove all the running containers, networks, and volumes, run:

```sh
docker-compose down
```
