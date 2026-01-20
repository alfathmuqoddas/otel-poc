// instrumentation.js
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "node-poc-service",
    [ATTR_SERVICE_VERSION]: "1.0",
  }),
  // Traces -> Collector
  //   traceExporter: new OTLPTraceExporter({
  //     url: "http://otel-collector:4318/v1/traces",
  //   }),
  // Metrics -> Collector
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: "http://otel-collector:4318/v1/metrics",
    }),
    exportIntervalMillis: 5000,
  }),
  // Logs -> Collector
  logRecordProcessor: new SimpleLogRecordProcessor(
    new OTLPLogExporter({ url: "http://otel-collector:4318/v1/logs" }),
  ),
  // The Multipack!
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Graceful shutdown to flush remaining spans/logs
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("OTel SDK shut down"))
    .finally(() => process.exit(0));
});
