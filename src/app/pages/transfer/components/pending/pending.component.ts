import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
    selector: 'app-pending-transfer-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        ButtonModule,
        TableModule,
        DividerModule,
        TooltipModule,
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
    constructor() {}

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
}
