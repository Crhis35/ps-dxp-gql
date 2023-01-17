import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { AbstractPromClientService } from './models/prom-client.abstract';

@Module({
  providers: [
    { provide: AbstractPromClientService, useClass: PrometheusService },
  ],
  exports: [AbstractPromClientService],
})
export class PrometheusModule {}
