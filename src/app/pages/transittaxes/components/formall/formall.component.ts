import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { TransittaxesService } from 'src/app/services/transittaxes.service';
import { DataTransittaxes } from 'src/app/interfaces/Response.interface';

@Component({
    selector: 'app-formall-transittaxes',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
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
        <form [formGroup]="form2" (ngSubmit)="onSaveall()" autocomplete="off">
            <div class="card p-fluid">
                <div class="p-formgrid grid">
                    <div class="field col">
                        <label class="mr-2">Ingrese RUT</label>
                        <input
                            pInputText
                            formControlName="rut"
                            type="text"
                            placeholder="99999999-*"
                        />
                    </div>
                    <div class="field col">
                        <label class="mr-2">Ingrese Nombre</label>
                        <input
                            pInputText
                            formControlName="nombres"
                            type="text"
                            placeholder="Jose Luis"
                        />
                    </div>
                </div>
                <div class="p-formgrid grid">
                    <div class="field col">
                        <label class="mr-2">Ingrese Apellido Paterno</label>
                        <input
                            pInputText
                            formControlName="apellido_paterno"
                            type="text"
                            placeholder="Lopez"
                        />
                    </div>
                    <div class="field col">
                        <label class="mr-2">Ingrese Apellido Materno</label>
                        <input
                            pInputText
                            formControlName="apellido_materno"
                            type="text"
                            placeholder="Rivaz"
                        />
                    </div>
                </div>
            </div>
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
    styleUrl: './formall.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormallComponent {
    @Output() data = new EventEmitter<DataTransittaxes>();
    statusFilter: string[] = [];
    pending: boolean = true;
    paid: boolean = false;
    allstatus: boolean = false;
    acquitted: boolean = false;
    failedRMNP: boolean = false;

    form2: FormGroup = this.fb.group({
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
    constructor(private fb: FormBuilder) {
        console.log('formall component');
    }

    onSaveall() {
        if (this.isFormEmpty(this.form2)) {
            this.form2.patchValue({
                pending: this.pending,
                paid: this.paid,
                acquitted: this.acquitted,
                failedRMNP: this.failedRMNP,
            });
            this.transittaxesService
                .consultTransittaxes(this.form2.value)
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

    statusbase() {
        this.pending = true;
        this.acquitted = false;
        this.paid = false;
        this.failedRMNP = false;
        this.allstatus = false;
    }
}
