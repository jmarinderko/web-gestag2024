import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ProcessModulation } from 'src/app/interfaces/Modulation.interface';
import { ModulationService } from 'src/app/services/modulation.service';
import { StatusprocessPipe } from 'src/app/shared/pipe/statusprocess.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { mergeMap } from 'rxjs/operators';
import { GeneratedocumentsService } from 'src/app/services/generatedocuments.service';

@Component({
    selector: 'app-list-process-component',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ThousandSeparatorPipe,
        ButtonModule,
        StatusprocessPipe,
        TableModule,
        ButtonModule,
        DialogModule,
    ],
    templateUrl: './listProcess.component.html',
    styleUrl: './listProcess.component.scss',
})
export class ListProcessComponent implements OnInit {
    listProcess: ProcessModulation[] = [];
    modulationService = inject(ModulationService);
    generatedocumentsService = inject(GeneratedocumentsService);
    listLetterDialog: boolean = false;
    listLetter: any[] = [];
    htmlLetter: string = '';
    ngOnInit(): void {
        this.loadListProcess();
    }

    loadListProcess() {
        this.modulationService.getListProcess().subscribe((res) => {
            this.listProcess = res.data;
        });
    }

    triggerProcess(idProcess: number) {
        this.modulationService.triggerProcess(idProcess).subscribe((res) => {
            // this.loadListProcess();
        });
    }

    listLetterProcess(idModulation: number) {
        this.modulationService
            .getListLetterProcess(idModulation)
            .subscribe((res) => {
                this.listLetter = res.data;
                this.listLetterDialog = true;
            });
    }

    async loadLetter(idLetter: number, idModulation: number) {
        this.modulationService
            .loadLetter(idLetter, idModulation)
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
                    console.error(
                        'Error loading letter',
                        error
                    );
                }
            );
    }

    async generateExcel(idModulation: number) {
        this.modulationService
            .downloadTrackingProcess(idModulation)
            .pipe(
                mergeMap((res) => {
                    return this.generatedocumentsService.excelGenerator(
                        res.data
                    );
                })
            )
            .subscribe(
                (excelRes) => {
                    const fileURL = URL.createObjectURL(excelRes);
                    window.open(fileURL, '_blank');
                },
                (error) => {
                    console.error(
                        'Error downloading excel:',
                        error
                    );
                }
            );

    }
    async generateWord(idModulation: number) {
        this.modulationService
            .downloadTrackingProcess(idModulation)
            .pipe(
                mergeMap((res) => {
                    return this.generatedocumentsService.wordGenerator(
                        res.data
                    );
                })
            )
            .subscribe(
                (excelRes) => {
                    const fileURL = URL.createObjectURL(excelRes);
                    window.open(fileURL, '_blank');
                },
                (error) => {
                    console.error('Error downloading word:', error);
                }
            );

    }
}
