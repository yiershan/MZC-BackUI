import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {NoteServiceService, NoteDto, UpdateNoteDto, PublicNoteDto} from '@app/blog/note-service.service';
import { AppComponentBase } from '@shared/app-component-base';
import marked from 'marked';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';  // 触发间隔
import 'rxjs/add/operator/distinctUntilChanged'; // 防止触发两次

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.css']
})
export class EditNoteComponent extends AppComponentBase {
    model = 1; // 写作模式
    isFull = false; // 是否全屏
    active = false; // 弹出层内容是否有效
    note: PublicNoteDto; // 编辑的文章
    preViewContent = ''; // 文章预览内容，转换层html后的
    @ViewChild('editNoteModal') modal: ModalDirective;  // 弹出层
    @ViewChild('modalContent') modalContent: ElementRef; // 弹出层内的内容
    term = new FormControl();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>(); // 页面间传值，这相当于一个自定义事件
    constructor(injector: Injector, private noteServer: NoteServiceService) {
        super(injector);
    }
    changeModel(m) {
        this.model = m;
    }
    full() {
        this.isFull = !this.isFull;
    }
    // 显示
    show(id: number): void {
        this.noteServer.GetNote(id).subscribe(m => {
            this.note = m;
            this.active = true;
            this.modal.show();
            this.term.valueChanges  // 监测输入文本框的变化同步更新预览 400ms
                .debounceTime(400)
                .distinctUntilChanged()
                .subscribe(term => {
                    this.preViewContent = marked(this.note.content);
                });
            this.term.valueChanges  // 30s自动保存到服务器
                .debounceTime(1000 * 30)
                .subscribe(t => this.updateNote());
        });
    }

    // 关闭
    close(): void {
        this.updateNote();
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(this.note.title); // 我们这里还可以传一个值过去
    }

    // 更新
    updateNote(): void {
        this.noteServer.Update(this.note).subscribe(m => {

        });
    }

    // 发布
    publicNote(): void {
        this.note.img = 'http://img0.imgtn.bdimg.com/it/u=313511342,2661546070&fm=27&gp=0.jpg';
        this.note.des = '我实在太懒了，添加描述的功能还没有来得及开发,而且这两个字的我后台设置的是必填字段';
        this.noteServer.PublicNote(this.note).subscribe(m => {
            this.active = false;
            this.modal.hide();
            this.modalSave.emit(null);
        });
    }

}
