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
}
