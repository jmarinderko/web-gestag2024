import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { mergeMap } from 'rxjs';
import { Transfer } from 'src/app/interfaces/Transfer.interface';
import { GeneratedocumentsService } from 'src/app/services/generatedocuments.service';
import { TransferService } from 'src/app/services/transfer.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-pending-transfer-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        ButtonModule,
        TableModule,
        DividerModule,
        TooltipModule,
        ReactiveFormsModule,
        DialogModule,
        FormsModule,
        MessagesModule,
        CalendarModule,
        TagModule,
    ],
    templateUrl: './pending.component.html',
    styleUrl: './pending.component.scss',
})
export class PendingComponent implements OnInit {
    listPending: Transfer[] = [];
    transferService = inject(TransferService);
    generatedocumentsService = inject(GeneratedocumentsService);
    loading: boolean = false;
    htmlLetter: string = '';
    receptionDialog: boolean = false;
    messagesform: Message[] | undefined;
    messages: Message[] | undefined;
    transferSelected: Transfer = null;

    form: FormGroup = this.fb.group({
        dateReception: ['', [Validators.required]],
    });

    constructor(private fb: FormBuilder) {}

    async ngOnInit() {
        await this.load();
    }

    load() {
        this.loading = true;
        this.transferService.listPending().subscribe((res) => {
            this.listPending = res.data;
            this.loading = false;
        });
    }

    generateModulation() {
        console.log('generate modulation');
        // const ids = this.selectedLoad.map((item) => item.id);
        // this.modulationService
        //     .generateModulation({ ids: ids })
        //     .subscribe((res) => {
        //         // this.loadListLoad();
        //         window.location.reload();
        //     });
    }

    async downloadDocument(id: number) {
        this.transferService
            .consultmemo(id)
            .pipe(
                mergeMap((res) => {
                    this.htmlLetter = res.data.html;
                    return this.generatedocumentsService.downloadLetter(
                        this.htmlLetter
                    );
                })
            )
            .subscribe(
                (excelRes) => {
                    const fileURL = URL.createObjectURL(excelRes);
                    window.open(fileURL, '_blank');
                },
                (error) => {
                    console.error('Error loading letter', error);
                }
            );
    }

    reception(item: Transfer) {
        this.transferSelected = item;
        this.messages = [
            {
                severity: 'info',
                detail: `Usted Recepcionará un total de : ${this.transferSelected.cantidad_infracciones} Infracciones`,
            },
        ];
        this.receptionDialog = true;
    }

    consult() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messagesform = [
                {
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Debe ingresar la fecha de recepción',
                },
            ];
            return;
        }

        this.transferService
            .reception(this.transferSelected.id, this.form.value)
            .subscribe({
                next: (res) => {
                    this.load();
                    this.receptionDialog = false;
                },
                error: (error) => {
                    this.messagesform = [
                        {
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al recepcionar',
                        },
                    ];
                },
            });
    }


}
