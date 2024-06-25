import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Modulation } from 'src/app/interfaces/Modulation.interface';
import { ModulationService } from 'src/app/services/modulation.service';
import { statusModulation } from 'src/app/shared/pipe/statusModulation.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
    selector: 'app-list-modulation',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ThousandSeparatorPipe,
        ButtonModule,
        statusModulation,
        TooltipModule,
        FileUploadModule,
        DialogModule,
        MessagesModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListModulationComponent implements OnInit {
    listModulation: Modulation[] = [];
    modulationService = inject(ModulationService);
    upExcelDialog = false;
    selectedModulation: Modulation | null = null;
    messages: Message[] | undefined;
    loading: boolean = false;

    ngOnInit(): void {
        this.loadModulation();
    }

    loadModulation() {
        this.loading = true;
        this.modulationService.getList().subscribe((res) => {
            this.listModulation = res.data;
            this.loading = false;
        });
    }

    downloadExcel(modulation: Modulation) {
        this.modulationService.downloadExcel(modulation.ruta_excel_salida);
    }

    uploadExcel(event: any, modulation: Modulation): void {
        const file: File = event.files[0];
        if (file) {
            this.modulationService.uploadFile(file, modulation.id).subscribe(
                (response) => {
                    if (response.success) {
                        this.messages = [
                            { severity: 'success', detail: response.message ||
                                'Datos Actualizados con éxito' },
                        ];

                        setTimeout(() => {
                            this.upExcelDialog = false;
                            // this.loadModulation();
                            window.location.reload();
                        }, 3000);
                    } else {
                        this.messages = [
                            {
                                severity: 'error',
                                detail: 'Error en la actualización de datos',
                            },
                        ];
                    }
                },
                (error) => {
                    console.error('File upload failed!', error);
                    this.messages = [
                        {
                            severity: 'error',
                            detail: 'Error en la actualización de datos',
                        },
                    ];
                }
            );
        }
        console.log('upload excel');
    }

    upExcel(modulation: Modulation) {
        console.log('upExcel');
        this.selectedModulation = modulation;
        this.upExcelDialog = true;
    }
}
