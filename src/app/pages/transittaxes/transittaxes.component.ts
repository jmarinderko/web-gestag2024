import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ListTransitTaxesComponent } from './components/list/ListTransitTaxes.component';
import { DataTransittaxes } from 'src/app/interfaces/Response.interface';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { StatustransittaxesPipe } from 'src/app/shared/pipe/statustransittaxes.pipe';
import { DetailpayComponent } from '../pay/components/detailpay/detailpay.component';
import { CreateobservationComponent } from './components/createobservation/createobservation.component';
import { DetailtransittaxesComponent } from './components/detailtransittaxes/detailtransittaxes.component';
import { ObservationTransitTaxesComponent } from './components/observation/observation.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransittaxesService } from 'src/app/services/transittaxes.service';
import { Message } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';


@Component({
    selector: 'app-transittaxes',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        TabViewModule,
        CommonModule,
        TableModule,
        ButtonModule,
        StatustransittaxesPipe,
        TooltipModule,
        DialogModule,
        ObservationTransitTaxesComponent,
        DetailtransittaxesComponent,
        CreateobservationComponent,
        DetailpayComponent,
        ListTransitTaxesComponent,
        InputSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
    ],
    templateUrl: './transittaxes.component.html',
    styleUrl: './transittaxes.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransittaxesComponent {
    data: DataTransittaxes = null;
    showList: boolean = false;
    statusFilter: string[] = [];
    pending: boolean = true;
    paid: boolean = false;
    allstatus: boolean = false;
    acquitted: boolean = false;
    failedRMNP: boolean = false;
    formpatentrole: FormGroup = this.fb.group({
        patent: [''],
        role: [''],
        rut: [''],
        nombres: [''],
        apellido_paterno: [''],
        apellido_materno: [''],
        pending: [''],
        paid: [''],
        acquitted: [''],
        failedRMNP: [''],
    });
    messages: Message[] | undefined;
    transittaxesService = inject(TransittaxesService);
    constructor(private fb: FormBuilder) {}

    listTransitTaxes(data: DataTransittaxes) {
        this.data = data;
        this.showList = true;
    }

    changeValueStatus(item: string) {
        if (item == 'allstatus') {
            if (this.allstatus) {
                this.pending = true;
                this.acquitted = true;
                this.failedRMNP = true;
                this.paid = true;
            } else {
                this.statusbase();
            }
        } else {
            if (item == 'pending') {
                if (this.pending) {
                    this.paid = false;
                    this.allstatus = false;
                    this.acquitted = false;
                    this.failedRMNP = false;
                } else {
                    this.statusbase();
                    this.paid = true;
                }
            }
            if (item == 'paid') {
                if (this.paid) {
                    this.pending = false;
                    this.acquitted = false;
                    this.failedRMNP = false;
                    this.allstatus = false;
                } else {
                    this.statusbase();
                }
            }
            if (item == 'acquitted') {
                if (this.acquitted) {
                    this.pending = false;
                    this.paid = false;
                    this.failedRMNP = false;
                    this.allstatus = false;
                } else {
                    this.statusbase();
                }
            }
            if (item == 'failedRMNP') {
                if (this.failedRMNP) {
                    this.pending = false;
                    this.acquitted = false;
                    this.paid = false;
                    this.allstatus = false;
                } else {
                    this.statusbase();
                }
            }
        }
    }

    statusbase() {
        this.pending = true;
        this.acquitted = false;
        this.paid = false;
        this.failedRMNP = false;
        this.allstatus = false;
    }

    onSave() {
        this.data = null;
        this.showList = false;
        if (this.isFormEmpty(this.formpatentrole)) {
            this.formpatentrole.patchValue({
                pending: this.pending,
                paid: this.paid,
                acquitted: this.acquitted,
                failedRMNP: this.failedRMNP,
            });
            if (this.formpatentrole.get('patent')?.value) {
                if (!this.validatePatent()) {
                    this.messages = [
                        {
                            severity: 'error',
                            summary: 'Error',
                            detail: 'La patente ingresada no es válida.',
                        },
                    ];
                    return;
                }
            }
            this.transittaxesService
                .consultTransittaxes(this.formpatentrole.value)
                .subscribe((res) => {
                    this.listTransitTaxes(res.data);
                });
        } else {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Debe ingresar al menos un campo para realizar la consulta.',
                },
            ];
        }
    }

    isFormEmpty(form: FormGroup): boolean {
        for (const control of Object.values(form.controls)) {
            if (control.value !== '') {
                return true;
            }
        }
        return false;
    }

    validatePatent(): boolean {
        const regexCar = /^([A-Z]{2})([A-Z]{2})-\d{2}$/;
        const regexCarOld = /^([A-Z]{2})(\d{2})-\d{2}$/;
        const regexMotorcycle = /^([A-Z]{3})-\d{2}$/;
        const regexAA9999 = /^[A-Z]{2}\d{4}$/;
        const regexAAAA99 = /^[A-Z]{4}\d{2}$/;

        if (this.formpatentrole.get('patent')?.value) {
            if (regexCar.test(this.formpatentrole.get('patent')?.value) ||
                regexCarOld.test(this.formpatentrole.get('patent')?.value) ||
                regexMotorcycle.test(this.formpatentrole.get('patent')?.value) ||
                regexAA9999.test(this.formpatentrole.get('patent')?.value) ||
                regexAAAA99.test(this.formpatentrole.get('patent')?.value)) {
                return true;
            }
        }
        return false;
    }
}
