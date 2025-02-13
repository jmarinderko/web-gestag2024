import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RmntpService } from 'src/app/services/rmntps.service';
import { MonthPipe } from 'src/app/shared/pipe/month.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-create-send-rmntp',
    standalone: true,
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ThousandSeparatorPipe,
        ButtonModule,
        TableModule,
        DividerModule,
        TooltipModule,
        DialogModule,
        FormsModule,
        DropdownModule,
        MessagesModule,
        CheckboxModule,
        ReactiveFormsModule,
        InputTextModule,
        MonthPipe,
        InputNumberModule,

        // otros módulos...
    ],
    providers: [ConfirmationService],

    templateUrl: './createSendRmntp.component.html',
    styleUrl: './createSendRmntp.component.scss',
})
export class CreateSendRmntpComponent {
    list: any[] = [];
    selectedItem: any = {};
    loading: boolean = false;
    sendParcialDialog: boolean = false;
    btnSendValidate: boolean = false;
    qty: number = 0;
    messages: Message[] | undefined;
    rmntpService = inject(RmntpService);
    constructor(private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.loading = true;
        this.rmntpService.listbymonthandyear().subscribe((res) => {
            this.list = res.data;
            this.loading = false;
        });
    }

    roundUp(value: number): number {
        return Math.ceil(value);
    }

    openDialogCreate(Item: any) {
        this.qty = 0;
        this.selectedItem = Item;
        this.sendParcialDialog = true;
    }

    get updatedText(): number {
        // Devuelve un texto dinámico basado en `qty`
        if (this.qty > 0) {
            return Math.ceil(this.qty / 1000);
        } else {
            return 0;
        }
    }

    get qtyAvailable(): number {
        return this.selectedItem.cantidad - this.qty;
    }

    validateValue() {
        if (this.qty <= 0) {
            this.messages = [
                {
                    severity: 'error',
                    detail: 'El valor no puede ser menor o igual a 0',
                },
            ];
            this.btnSendValidate = false;
            return false;
        }
        if (this.qty > this.selectedItem.cantidad) {
            this.messages = [
                {
                    severity: 'error',
                    detail: 'El valor no puede ser mayor a la cantidad disponible',
                },
            ];
            this.btnSendValidate = false;
            return false;
        } else {
            this.btnSendValidate = true;
            this.messages = [];
            return true;
        }
    }

    sendParcial() {
        // Mostrar el diálogo de confirmación
        this.confirmationService.confirm({
            message: '¿Está seguro de realizar esta acción?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Si el usuario acepta, ejecuta la acción
                if (this.validateValue()) {
                    this.rmntpService
                        .create(this.selectedItem, this.qty)
                        .subscribe(
                            (res) => {
                                if (res.success) {
                                    this.sendParcialDialog = false;
                                    this.qty = 0;
                                    this.ngOnInit();
                                } else {
                                    this.messages = [
                                        {
                                            severity: 'error',
                                            detail: 'Error al realizar la operación',
                                        },
                                    ];
                                }
                                this.btnSendValidate = false;
                            },
                            (err) => {
                                this.messages = [
                                    {
                                        severity: 'error',
                                        detail: 'Error al realizar la operación',
                                    },
                                ];
                                this.btnSendValidate = false;
                            }
                        );
                }
            },
            reject: () => {
                // Si el usuario rechaza, puedes mostrar un mensaje opcional
                this.messages = [
                    {
                        severity: 'info',
                        detail: 'Acción cancelada',
                    },
                ];
            },
        });
    }

    createByForm(){

    }
}
