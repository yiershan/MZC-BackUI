import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { NoteDto, NoteServiceService, PageOfNoteDto, CreateNoteDto } from '@app/blog/note-service.service'
import {EditNoteComponent} from '@app/blog/note/edit-note/edit-note.component';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
    animations: [appModuleAnimation()]
})
export class NoteComponent extends PagedListingComponentBase<NoteDto> {
    @ViewChild('editNoteModal') editNoteModal: EditNoteComponent;
    notes: NoteDto[] = []; // 文章列表
   constructor(private noteService: NoteServiceService,
              injector: Injector) {
      super(injector);
  }
   createNote() {
       const input = new CreateNoteDto();
       input.textType = 0;
       this.noteService.Create(input).subscribe(m => {
           this.editNote(m);
       });
   }
   editNote(note: NoteDto) {
       this.editNoteModal.show(note.id);
   }
   // 测试父子页面传值
   test(e) {
       // alert(e);
       this.refresh();
   }
    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.noteService.GetAll(request.maxResultCount, request.skipCount)
            .finally(() => {
                finishedCallback();
            })
            .subscribe((result: PageOfNoteDto) => {
                this.notes = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    protected delete(note: NoteDto): void {
        this.noteService.Delete(note.id).finally(()=> this.notify.success('删除成功')).subscribe(m => this.refresh())
    }

}
