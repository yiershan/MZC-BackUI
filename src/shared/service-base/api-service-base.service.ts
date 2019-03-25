
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { SwaggerException } from '@shared/service-proxies/service-proxies';

export abstract class ApiServiceBaseService {
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(protected http: Http) { }
    protected get<T>(url_: string): Observable<T>  {
      const options_ = {
          method: 'get',
          headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          })
      };
        return this.p(url_, options_)
    }
    protected post<T, F>(url_: string, input: F): Observable<T> {
        const content_ = JSON.stringify(input);
        const options_ = {
            body: content_,
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        };
        return this.p<T>(url_, options_)
    }
    protected  put<T, F>(url_: string, input: F): Observable<T> {
        const content_ = JSON.stringify(input);
        const options_ = {
            body: content_,
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        };
        return this.p<T>(url_, options_)
    }
    protected delete(url_: string): Observable<void> {
        const options_ = {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        };
        return this.p<void>(url_, options_)
    }
    private  p<T>(url_: string, options_): Observable<T> {
        return this.http.request(url_, options_).flatMap((response_) => {
            return this.process<T>(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.process<T>(response_);
                } catch (e) {
                    return <Observable<T>><any>Observable.throw(e);
                }
            } else {
                return <Observable<T>><any>Observable.throw(response_);
            }
        });
    }
    private process<T>(response: Response): Observable<T> {
        const status = response.status;

        const _headers: any = response.headers ? response.headers.toJSON() : {};
        if (status === 200) {
            const _responseText = response.text();
            let result200: any = null;
            const resultData200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? resultData200 as T : null;
            return Observable.of(result200);
        } else if (status === 401) {
            const _responseText = response.text();
            return this.throwException('服务器错误', status, _responseText, _headers);
        } else if (status === 403) {
            const _responseText = response.text();
            return this.throwException('服务器错误', status, _responseText, _headers);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return this.throwException('意料之外的出现', status, _responseText, _headers);
        }
        return Observable.of<T>(<any>null);
    }
    protected throwException(message: string, status: number, response: string,
        headers: { [key: string]: any; }, result?: any): Observable<any> {
        if (result !== null && result !== undefined) {
            return Observable.throw(result);
        } else {
            return Observable.throw(new SwaggerException(message, status, response, headers, null));
        }
    }

}
