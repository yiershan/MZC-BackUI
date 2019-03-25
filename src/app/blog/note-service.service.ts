import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http} from '@angular/http';
import {ApiServiceBaseService} from '@shared/service-base/api-service-base.service';
// api域名
const ApiHost = 'http://localhost:1314';
// api地址
const NoteApiUrls = {
    Create: ApiHost + '/api/services/app/NoteAppServer/Create',
    PublicNote: ApiHost + '/api/services/app/NoteAppServer/PublicNote',
    Update: ApiHost + '/api/services/app/NoteAppServer/Update',
    GetAll: ApiHost + '/api/services/app/NoteAppServer/GetAll',
    GetNote: ApiHost +  '/api/services/app/NoteAppServer/GetNote',
    Delete:  ApiHost + '/api/services/app/NoteAppServer/Delete'
};
@Injectable()
export class NoteServiceService extends ApiServiceBaseService {
    constructor(http: Http) {
        super(http);
    }
    Create(input: CreateNoteDto): Observable<NoteDto> {
        const url_ = NoteApiUrls.Create;
        return this.post<NoteDto, CreateNoteDto>(url_, input)
    };
    // 对于get请求我们要把参数拼接到url上面，这是api的特殊地方
    GetAll(MaxResultCount = 20, SkipCount = 0, key = ''): Observable<PageOfNoteDto> {
        let url_ = NoteApiUrls.GetAll + '?';
        url_ += 'SkipCount=' + encodeURIComponent('' + SkipCount) + '&';
        url_ += 'MaxResultCount=' + encodeURIComponent('' + MaxResultCount) + '&';
        url_ += 'key=' + encodeURIComponent('' + key);
        url_ = url_.replace(/[?&]$/, '');
        return this.get<PageOfNoteDto>(url_);
    }
    Update(input: UpdateNoteDto): Observable<NoteDto> {
        const url_ = NoteApiUrls.Update;
        return this.put<NoteDto, UpdateNoteDto>(url_, input)
    }
    Delete(id: number): Observable<void> {
        let url_ = NoteApiUrls.Delete + '?';
        url_ += 'Id=' + encodeURIComponent('' + id);
        return this.delete(url_);
    }
    PublicNote(input: PublicNoteDto): Observable<void>  {
        const url_ = NoteApiUrls.PublicNote;
        return this.post<void, PublicNoteDto>(url_, input);
    }
    GetNote(id: number): Observable<PublicNoteDto> {
        let url_ = NoteApiUrls.GetNote + '?';
        url_ += 'Id=' + encodeURIComponent('' + id);
        return this.get<PublicNoteDto>(url_);
    }
}
export class PublicNoteDto  {
    id: number;
    title: string;
    content: string;
    des: string;
    img: string;
    tags: string;
}
export class UpdateNoteDto {
    id: number;
    title: string;
    content: string;
}
export class PageOfNoteDto {
    totalCount: number;
    items: NoteDto[];
}

export class CreateNoteDto {
    textType: number
}
// 首字母必须小写
export class NoteDto {
    title: string;
    creationTime: string;
    id: number;
    like: number;
    collect: number;
    scan: number;
    isPublic: boolean;
}
