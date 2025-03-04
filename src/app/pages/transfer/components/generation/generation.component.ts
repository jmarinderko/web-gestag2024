import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { ConfirmationService, Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { Entity } from 'src/app/interfaces/Entity.interface';
import { TransferAvailable } from 'src/app/interfaces/Transfer.interface';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-generation-transfer-component',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        TableModule,
        MessagesModule,
        MessageModule,
        DropdownModule,
        CheckboxModule,
        InputTextModule,
        DialogModule,
        DividerModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ],
    templateUrl: './generation.component.html',
    styleUrls: ['./generation.component.scss'],
})
export class GenerationComponent implements OnInit {
    transferService = inject(TransferService);
    listTransfer: TransferAvailable[] = [];
    loading: boolean = false;
    dialogQuantityPeriod: boolean = false;
    courts: Entity[] = [];
    selectedCourt: Entity = null;
    transferAvailableSelected: TransferAvailable = null;
    messages: Message[] | undefined;
    listDayByMonth: any[] = [];
    dialogQuantityDay: boolean = false;
    selectedDay: any[] = [];
    dialogForm: boolean = false;
    responseConsult: boolean = false;
    listResponseConsult: TransitTaxe[] = [];
    selectedItem: TransitTaxe[] = [];
    atLeastOneFieldHasValue = true;
    messagesform: Message[] | undefined;
    messagesResponse: Message[] | undefined;
    loadingResponse: boolean = false;
    form: FormGroup = this.fb.group({
        rut: [''],
        patente: [''],
        correlativo_mop: [''],
    });

    constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) {
        this.messages = [
            {
                severity: 'info',
                detail: 'Al generar el denuncio a jpl las infracciones seran enviadas al juzgado de policia local que selecciono',
            },
        ];
    }

    ngOnInit(): void {
        this.load();
    }

    load() {
        this.loading = true;
        this.transferService.loadCourt().subscribe((res) => {
            this.courts = res.data;
        });
        this.transferService.listTransferAvailable().subscribe((res) => {
            this.listTransfer = res.data;
            this.loading = false;
        });
    }

    getTotalInfracciones() {
        return this.selectedDay.reduce(
            (total, item) => total + item.cantidad,
            0
        );
    }

    generateByForms() {
        this.listResponseConsult = [];
        this.selectedItem = [];
        this.form.reset();
        this.dialogForm = true;
    }
    generateByPeriod(transfer: TransferAvailable) {
        this.transferAvailableSelected = transfer;
        this.dialogQuantityPeriod = true;
    }
    generateByDay(transfers: TransferAvailable) {
        this.transferService
            .loadbymonthandyeargroupday(transfers.mes, transfers.anio)
            .subscribe((res) => {
                this.listDayByMonth = res.data;
                this.transferAvailableSelected = transfers;
                this.dialogQuantityDay = true;
            });
    }

    submitPeriod() {
        if (
            !this.transferAvailableSelected.cantidad ||
            this.transferAvailableSelected.cantidad === 0
        ) {
            this.messages = [
                {
                    severity: 'error',
                    detail: 'La cantidad debe ser mayor a 0',
                },
            ];
            return;
        }

        this.transferService
            .generateByPeriod({
                minDate: this.transferAvailableSelected.fecha_minima,
                maxDate: this.transferAvailableSelected.fecha_maxima,
                count: this.transferAvailableSelected.cantidad,
                idCourt: this.selectedCourt.id,
            })
            .subscribe((res) => {
                this.load();
                this.cancelPeriod();
                this.messagesResponse = [
                    {
                        severity: 'success',
                        detail: 'Se genero correctamente el traspaso a JPL',
                    },
                ];
            });
    }
    cancelPeriod() {
        this.selectedCourt = null;
        this.transferAvailableSelected = null;
        this.dialogQuantityPeriod = false;
    }

    submitDay() {
        if (this.selectedDay.length === 0) {
            this.messages = [
                {
                    severity: 'error',
                    detail: 'Debe seleccionar al menos un dia',
                },
            ];
            return;
        }

        this.transferService
            .generatebyday({
                idCourt: this.selectedCourt.id,
                data: this.selectedDay,
                month: this.transferAvailableSelected.mes,
                year: this.transferAvailableSelected.anio,
            })
            .subscribe((res) => {
                this.load();
                this.cancelDay();
                this.messagesResponse = [
                    {
                        severity: 'success',
                        detail: 'Se genero correctamente el traspaso a JPL',
                    },
                ];
            });
    }
    cancelDay() {
        this.selectedDay = [];
        this.selectedCourt = null;
        this.transferAvailableSelected = null;
        this.dialogQuantityDay = false;
    }

    consult() {
        this.loadingResponse = true;
        this.atLeastOneFieldHasValue = Object.values(this.form.value).some(
            (value) => value !== '' && value !== null && value !== undefined
        );
        if (!this.atLeastOneFieldHasValue) {
            this.messagesform = [
                {
                    severity: 'error',
                    detail: 'Al menos un campo debe tener datos',
                },
            ];
            return;
        }

        this.transferService.consultByForm(this.form.value).subscribe((res) => {
            if (res.success) {
                this.listResponseConsult = res.data;
                this.responseConsult = true;
                this.loadingResponse = false;
            } else {
                this.messagesform = [
                    {
                        severity: 'error',
                        detail: 'No se encontraron datos.',
                    },
                ];
                this.responseConsult = false;
                this.loadingResponse = false;
            }
        });
    }

    cancelForm() {
        this.selectedCourt = null;
        this.listResponseConsult = [];
        this.selectedItem = [];
        this.form.reset();
        this.responseConsult = false;
        this.dialogForm = false;
    }

    submitForm() {
        if (!this.selectedCourt) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar un juzgado'
            });
            return;
        }

        if (this.selectedItem.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar al menos una constancia'
            });
            return;
        }

        this.confirmationService.confirm({
            message: '¿Está seguro de generar la transferencia?',
            header: 'Confirmación de Transferencia',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.transferService
                    .generateByForm({
                        idCourt: this.selectedCourt.id,
                        transitTaxes: this.selectedItem.map((item) => item.id),
                    })
                    .subscribe({
                        next: (response) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Transferencia generada correctamente'
                            });
                            this.router.navigate(['transfer/completed']);
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al generar la transferencia'
                            });
                        },
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
