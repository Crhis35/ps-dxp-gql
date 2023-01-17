import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [HealthModule, PrometheusModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
