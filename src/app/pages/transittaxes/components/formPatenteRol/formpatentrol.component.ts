import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { TransittaxesService } from 'src/app/services/transittaxes.service';
import { InputMaskModule } from 'primeng/inputmask';
import { DataTransittaxes } from 'src/app/interfaces/Response.interface';

@Component({
    selector: 'app-formpatentrol-transittaxes',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        InputMaskModule,
    ],
    template: `<div class="grid formgrid">
            <div class="col-12 md:col-4">
                <div class="field-checkbox">
                    <p-inputSwitch
                        [(ngModel)]="pending"
                        (onChange)="changeValueStatus('pending')"
                    ></p-inputSwitch>
                    <label for="ny">Pendientes</label>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field-checkbox">
                    <p-inputSwitch
                        [(ngModel)]="paid"
                        (onChange)="changeValueStatus('paid')"
                    ></p-inputSwitch>
                    <label for="sf">Pagados</label>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field-checkbox">
                    <p-inputSwitch
                        [(ngModel)]="acquitted"
                        (onChange)="changeValueStatus('acquitted')"
                    ></p-inputSwitch>
                    <label for="la">Absueltas</label>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field-checkbox">
                    <p-inputSwitch
                        [(ngModel)]="failedRMNP"
                        (onChange)="changeValueStatus('failedRMNP')"
                    ></p-inputSwitch>
                    <label for="la">R.M.N.P</label>
                </div>
            </div>
            <div class="col-12 md:col-3">
                <div class="field-checkbox">
                    <p-inputSwitch
                        [(ngModel)]="allstatus"
                        (onChange)="changeValueStatus('allstatus')"
                    ></p-inputSwitch>
                    <label for="la">Todos</label>
                </div>
            </div>
        </div>
        <form
            [formGroup]="formpatentrole"
            (ngSubmit)="onSave()"
            autocomplete="off"
        >
            <div class="card p-fluid">
                <div class="p-formgrid grid">
                    <div class="field col">
                        <label class="mr-2">Ingrese Patente</label>
                        <small id="username-help" class="p-error"
                            >*(respetar formato de consulta)</small
                        >
                        <input
                            pInputText
                            formControlName="patent"
                            type="text"
                            maxlength="7"
                            placeholder="****-99"
                        />
                    </div>
                    <div class="field col">
                        <label class="mr-2">Ingrese Rol-MOP</label>
                        <small id="username-help" class="p-error"
                            >*(respetar formato de consulta)</small
                        >
                        <input
                            pInputText
                            formControlName="role"
                            type="text"
                            maxlength="12"
                            placeholder="********-AAA"
                        />
                    </div>
                </div>
            </div>
            <br />
            <button
                type="submit"
                pButton
                pRipple
                label="Consultar"
                class="p-button-rounded mr-2 mb-2"
            ></button>
        </form>
        <br />
        <p-messages
            [(value)]="messages"
            [enableService]="false"
            [closable]="true"
        ></p-messages> `,

    styleUrl: './formpatentrol.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormpatentrolComponent {
    @Output() data = new EventEmitter<DataTransittaxes>();
    statusFilter: string[] = [];
    pending: boolean = true;
    paid: boolean = false;
    allstatus: boolean = false;
    acquitted: boolean = false;
    failedRMNP: boolean = false;
    formpatentrole: FormGroup = this.fb.group({
        patent: [''],
        role: [''],
        pending: [''],
        paid: [''],
        acquitted: [''],
        failedRMNP: [''],
    });
    messages: Message[] | undefined;
    transittaxesService = inject(TransittaxesService);
    constructor(private fb: FormBuilder) {}

    onSave() {
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
                    this.data.emit(res.data);
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

    isFormEmpty(form: FormGroup): boolean {
        for (const control of Object.values(form.controls)) {
            if (control.value !== '') {
                return true;
            }
        }
        return false;
    }

    validatePatent() {
        const regexCar = /^([A-Z]{2})([A-Z]{2})-\d{2}$/;
        const regexCarOld = /^([A-Z]{2})(\d{2})-\d{2}$/;
        const regexMotorcycle = /^([A-Z]{3})-\d{2}$/;
        if (this.formpatentrole.get('patent')?.value) {
            if (regexCar.test(this.formpatentrole.get('patent')?.value)) {
                return true;
            } else if (
                regexMotorcycle.test(this.formpatentrole.get('patent')?.value)
            ) {
                return true;
            } else if (
                regexCarOld.test(this.formpatentrole.get('patent')?.value)
            ) {
                return true;
            }
        }
        return false;
    }

    statusbase() {
        this.pending = true;
        this.acquitted = false;
        this.paid = false;
        this.failedRMNP = false;
        this.allstatus = false;
    }

    ngOnInit() {
        this.load();
    }

    load() {
        this.acquitted = false;
        this.failedRMNP = false;
        this.pending = false;
        this.paid = true;
        this.formpatentrole.patchValue({
            patent: 'HFWK-37',
        });
        this.onSave();
    }
}
