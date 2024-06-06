import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ServiceService } from 'src/app/services/service.service';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { LoadFileService } from 'src/app/services/loadfile.service';

@Component({
    selector: 'app-newloadfile',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        FileUploadModule,
        DropdownModule,
    ],
    templateUrl: './newloadfile.component.html',
    styleUrl: './newloadfile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewloadfileComponent {
    @Input() data: any[] = [];
    highways: any[] = [];
    serviceService = inject(ServiceService);
    loadFileService = inject(LoadFileService);
    form: FormGroup = this.fb.group({
        highway: [''],
        name: [''],
        number: [''],
        file: [File],
    });
    file: any = null;
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.loadHigway();
    }

    loadHigway() {
        this.serviceService.getHighway().subscribe((res) => {
            this.highways = res.data;
        });
    }

    onUpload(event: any) {
        console.log("carga de archivo");
        console.log(event);
        this.file = event.target.files[0];
    }

    onSave() {
        if (this.form.valid) {
            const formData = new FormData();
            formData.append('highway', this.form.get('highway')?.value?.id);
            formData.append('name', this.form.get('name')?.value);
            formData.append('number', this.form.get('number')?.value);
            formData.append('filetxt', this.file);
            console.log(formData);
            this.loadFileService.postloadFile(formData).subscribe((res) => {
                console.log(res);
                // this.messageService.add({
                //     severity: 'success',
                //     summary: 'Success',
                //     detail: 'File uploaded',
                // });
            });
        } else {
            // this.messageService.add({
            //     severity: 'error',
            //     summary: 'Error',
            //     detail: 'Form is invalid',
            // });
        }
    }
}
