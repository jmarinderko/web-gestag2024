import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { mergeMap } from 'rxjs';
import { Transfer } from 'src/app/interfaces/Transfer.interface';
import { GeneratedocumentsService } from 'src/app/services/generatedocuments.service';
import { TransferService } from 'src/app/services/transfer.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-completed-transfer-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        ButtonModule,
        TableModule,
        DividerModule,
        TooltipModule,
    ],
    templateUrl: './completed.component.html',
    styleUrl: './completed.component.scss',
})
export class CompletedComponent implements OnInit {
    listTransfer: Transfer[] = [];
    loading: boolean = false;
    transferService = inject(TransferService);
    generatedocumentsService = inject(GeneratedocumentsService);
    htmlLetter: string = '';
    constructor() {}

    ngOnInit(): void {
        this.load();
    }

    load() {
        this.loading = true;
        this.transferService.listCompleted().subscribe((res) => {
            this.listTransfer = res.data;
            this.loading = false;
        });
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

    // async loadLetter(idLetter: number, idModulation: number) {
    //     this.modulationService
    //         .loadLetter(idLetter, idModulation)
    //         .pipe(
    //             mergeMap((res) => {
    //                 this.htmlLetter = res.data.html;
    //                 return this.generatedocumentsService.downloadLetter(
    //                     this.htmlLetter
    //                 );
    //             })
    //         )
    //         .subscribe(
    //             (excelRes) => {
    //                 const fileURL = URL.createObjectURL(excelRes);
    //                 window.open(fileURL, '_blank');
    //             },
    //             (error) => {
    //                 console.error('Error loading letter', error);
    //             }
    //         );
    // }
}
