import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { Qtyavailable } from 'src/app/interfaces/Citation.interface';
import { CitationService } from 'src/app/services/citation.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-listjpl-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        MessagesModule,
        ButtonModule,
        ConfirmDialogModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './listjpl.component.html',
    styleUrl: './listjpl.component.scss',
})
export class ListjplComponent implements OnInit {
    qtyAvailable: Qtyavailable = null;
    citacionService = inject(CitationService);
    messages: Message[] | undefined;
    loading: boolean = true;

    constructor(private confirmationService: ConfirmationService) {}
    async ngOnInit() {
        this.loading = true;
        await this.loadQtyAvailable();
        this.loading = false;
    }

    loadQtyAvailable() {

        this.citacionService
            .loadQtyAvailableModulation()
            .subscribe((response) => {
                this.qtyAvailable = response.data;
            });

    }

    generateModulation($event: any) {
        console.log('generateModulation');
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Esta usted seguro de generar la modulación?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.citacionService
                    .generateModulationByCitation()
                    .subscribe((response) => {
                        if (response.success) {
                            this.messages = [
                                {
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Se generó la modulación correctamente',
                                },
                            ];
                            this.loadQtyAvailable();
                        } else {
                            this.messages = [
                                {
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'No se pudo generar la modulación',
                                },
                            ];
                        }
                    });
            },
            reject: () => {

            }
        });


    }
}
