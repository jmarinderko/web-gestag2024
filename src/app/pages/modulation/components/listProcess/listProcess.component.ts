import { CommonModule } from '@angular/common';
import { Component, inject, Input, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ProcessModulation } from 'src/app/interfaces/Modulation.interface';
import { ModulationService } from 'src/app/services/modulation.service';
import { StatusprocessPipe } from 'src/app/shared/pipe/statusprocess.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { map, mergeMap } from 'rxjs/operators';
import { GeneratedocumentsService } from 'src/app/services/generatedocuments.service';
import { TooltipModule } from 'primeng/tooltip';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-list-process-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        ButtonModule,
        StatusprocessPipe,
        TableModule,
        ButtonModule,
        DialogModule,
        TooltipModule,
    ],
    templateUrl: './listProcess.component.html',
    styleUrl: './listProcess.component.scss',
})
export class ListProcessComponent implements OnInit {
    @Input() tipeLoad: number = 0;
    listProcess: ProcessModulation[] = [];
    modulationService = inject(ModulationService);
    generatedocumentsService = inject(GeneratedocumentsService);
    listLetterDialog: boolean = false;
    listLetter: any[] = [];
    htmlLetter: string = '';
    loading: boolean = false;
    ngOnInit(): void {
        this.loadListProcess();
    }

    loadListProcess() {
        this.loading = true;
        this.modulationService.getListProcess(this.tipeLoad).subscribe((res) => {
            this.listProcess = res.data;
            this.loading = false;
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
                    console.error('Error loading letter', error);
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
                    const blob = new Blob([excelRes], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const fileName = 'custom_filename.xlsx'; // Nombre del archivo
                    saveAs(blob, fileName);
                },
                (error) => {
                    console.error('Error downloading excel:', error);
                }
            );
    }
    async generateWord(idModulation: number) {
        this.modulationService
            .downloadTrackingProcess(idModulation)
            .pipe(
                mergeMap((res) => {
                    return this.generatedocumentsService
                        .wordGenerator(res.data)
                        .pipe(
                            map((response) => {
                                const contentDisposition = response.headers.get(
                                    'Content-Disposition'
                                );
                                let fileName = 'documento_descargado.docx'; // Valor por defecto

                                if (contentDisposition) {
                                    const matches =
                                        contentDisposition.match(
                                            /filename="(.+)"/
                                        );
                                    if (matches && matches[1]) {
                                        fileName = matches[1];
                                    }
                                }

                                return { file: response.body, fileName };
                            })
                        );
                })
            )
            .subscribe(
                ({ file, fileName }) => {
                    const fileURL = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(fileURL); // Limpia el objeto URL
                },
                (error) => {
                    console.error('Error downloading word:', error);
                }
            );
    }
}
