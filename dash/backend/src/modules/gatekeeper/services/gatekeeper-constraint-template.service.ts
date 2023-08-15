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
import { GatekeeperConstraintService } from './gatekeeper-constraint.service';

@Injectable()
export class GatekeeperConstraintTemplateService {
  defaultTemplateDir: string;
  constructor(
    @Inject(forwardRef(() => ClusterService))
    private readonly clusterService: ClusterService,
    private readonly configService: ConfigService,
    private readonly gatekeeperConstraintService: GatekeeperConstraintService,
    private logger: MineLoggerService,
  ) {
    this.defaultTemplateDir = this.configService.get('gatekeeper.gatekeeperTemplateDir');
  }

  async getConstraintTemplates(clusterId: number, kubeConfig?: KubeConfig): Promise<GatekeeperConstraintTemplateDto[]> {
    try {
      if (!kubeConfig) {
        kubeConfig = await this.clusterService.getKubeConfig(clusterId);
      }
      const customObjectApi = kubeConfig.makeApiClient(CustomObjectsApi);
      const templateListResponse = await customObjectApi.getClusterCustomObject('templates.gatekeeper.sh', 'v1beta1', 'constrainttemplates', '');
      const templates: any[] = templateListResponse.body['items'];
      const templateDTOs: GatekeeperConstraintTemplateDto[] = plainToInstance(GatekeeperConstraintTemplateDto, templates);
      for(const template of templateDTOs) {
        const constraintCount = await this.gatekeeperConstraintService.getNumConstraintsForTemplate(clusterId, template.metadata.name, kubeConfig);
        template.constraintsCount = constraintCount;
        template.enforced = !!constraintCount;
      }
      return templateDTOs;
    } catch (e) {
      this.logger.error({label: 'Error getting Gatekeeper constraint templates', data: { clusterId }}, e, 'GatekeeperService.getConstraintTemplates');
      throw({message: 'Error getting Gatekeeper constraint templates'});
    }
  }
}
