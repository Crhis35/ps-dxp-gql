import { Module } from '@nestjs/common';
import { ReadinessModule } from './lib/readiness/readiness.module';
import { PrometheusModule } from './lib/prometheus/prometheus.module';
import { HealthModule } from './lib/health/health.module';
import { MetricsModule } from './lib/metrics/metrics.module';

@Module({
  providers: [],
  imports: [ReadinessModule, PrometheusModule, HealthModule, MetricsModule],
  exports: [ReadinessModule, PrometheusModule, HealthModule, MetricsModule],
})
export class CommonModule {}
