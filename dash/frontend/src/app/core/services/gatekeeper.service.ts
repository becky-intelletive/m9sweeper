import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IServerResponse} from '../entities/IServerResponse';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GatekeeperService {
  constructor(private httpClient: HttpClient) {}

  private buildBaseUrl(clusterId: number): string {
    return `/api/clusters/${clusterId}/gatekeeper`;
  }

  getGatekeeperInstallationInfo(clusterId: number): Observable<any> {
    return this.httpClient.get<IServerResponse<any>>(`${this.buildBaseUrl(clusterId)}`)
      .pipe(
        map(response => response?.data),
        shareReplay(),
      );
  }

  getGatekeeperConstraintTemplateTemplates(clusterId: number): Observable<{
    category: string,
    templates: {
      name: string,
      template: any,  // Constraint Template Blueprint
    }[],
  }[]> {
    return this.httpClient.get<IServerResponse<any>>(`${this.buildBaseUrl(clusterId)}/constraint-template-blueprints`)
      .pipe(
        map(response => response?.data),
        shareReplay(),
      );
  }

  getGatekeeperConstraintTemplates(clusterId: number): Observable<any> {
    return this.httpClient.get<IServerResponse<any>>(`${this.buildBaseUrl(clusterId)}/constraint-templates`)
      .pipe(
        map(response => response?.data),
        shareReplay(),
      );
  }

  deployGatekeeperConstraintTemplates(clusterId: number, templates: { name: string, template: string }[]): Observable<{ successfullyDeployed: string[], unsuccessfullyDeployed: string[] }> {
    return this.httpClient.post<IServerResponse<{ successfullyDeployed: string[], unsuccessfullyDeployed: string[] }>>(`${this.buildBaseUrl(clusterId)}/constraint-templates`, templates)
      .pipe(
        map(response => response?.data),
        shareReplay(),
      );
  }
}
