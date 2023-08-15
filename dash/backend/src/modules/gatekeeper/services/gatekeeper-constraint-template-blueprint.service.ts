import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClusterService } from '../../cluster/services/cluster.service';
import { ConfigService } from '@nestjs/config';
import { MineLoggerService } from '../../shared/services/mine-logger.service';
import { GatekeeperResponseStructure } from '../dto/gatekeeper-generic.dto';
import { CustomObjectsApi, V1APIService } from '@kubernetes/client-node';
import { KubeConfig } from '@kubernetes/client-node/dist/config';
import { ApiregistrationV1Api } from '@kubernetes/client-node/dist/gen/api/apiregistrationV1Api';
import { GatekeeperConstraintTemplateDto } from '../dto/gatekeeper-constraint-template.dto';
import { plainToInstance } from 'class-transformer';
import { GatekeeperConstraintTemplateService } from './gatekeeper-constraint-template.service';
import { GatekeeperConstraintService } from './gatekeeper-constraint.service';

@Injectable()
export class GatekeeperConstraintTemplateBlueprintService {
  defaultTemplateDir: string;
  constructor(
    @Inject(forwardRef(() => ClusterService))
    private readonly clusterService: ClusterService,
    private readonly configService: ConfigService,
    private readonly gatekeeperConstraintTemplateService: GatekeeperConstraintTemplateService,
    private readonly gatekeeperConstraintService: GatekeeperConstraintService,
    private logger: MineLoggerService,
  ) {
    this.defaultTemplateDir = this.configService.get('gatekeeper.gatekeeperTemplateDir');
  }
}
