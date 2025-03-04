import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ModulationService } from 'src/app/services/modulation.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-list-load-modulation',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ThousandSeparatorPipe,
        TooltipModule,
        ButtonModule,
        DividerModule,
        ConfirmDialogModule
    ],
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './listLoadModulation.component.html',
    styleUrl: './listLoadModulation.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLoadModulationComponent implements OnInit {
    listLoad: any[] = [];
    selectedLoad: any[] = [];
    modulationService = inject(ModulationService);
    loading: boolean = false;
    messageService = inject(MessageService);
    confirmationService = inject(ConfirmationService);

    constructor() {}

    ngOnInit() {
        this.loadListLoad();
    }

    loadListLoad() {
        this.loading = true;
        this.modulationService.getListLoad().subscribe((res) => {
            this.listLoad = res.data;
            this.loading = false;
        });
    }

    generateModulation() {
        if (this.selectedLoad.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar al menos un registro'
            });
            return;
        }

        this.confirmationService.confirm({
            message: '¿Está seguro de generar la modulación?',
            header: 'Confirmación de Modulación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedLoad.map((item) => item.id);
                this.modulationService
                    .generateModulation({ ids: ids })
                    .subscribe({
                        next: (response) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Modulación generada correctamente'
                            });
                            this.loadListLoad();
                            this.selectedLoad = [];
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al generar la modulación'
                            });
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Operación cancelada'
                });
            }
        });
    }
}
