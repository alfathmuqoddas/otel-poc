import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";

console.log("initiating otel");

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "node-poc-service",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  // traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: "http://otel-collector:4318/v1/metrics",
    }),
    exportIntervalMillis: 1000,
  }),
  logRecordProcessors: [
    new SimpleLogRecordProcessor(
      new OTLPLogExporter({
        url: "http://otel-collector:4318/v1/logs",
      }),
    ),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
});

console.log("starting otel");

sdk.start();

console.log("OTel SDK (Metrics & Logs) started");
