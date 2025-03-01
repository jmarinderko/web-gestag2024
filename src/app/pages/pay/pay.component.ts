import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { PaymentBox } from 'src/app/interfaces/Pay.interface';
import { Reason, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { PayService } from 'src/app/services/pay.service';
import { ReasonService } from 'src/app/services/reason.service';
import { ServiceService } from 'src/app/services/service.service';
import { MonthPipe } from 'src/app/shared/pipe/month.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-transitaxes-pay',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    ThousandSeparatorPipe
],
    providers: [
        MessageService,
        ThousandSeparatorPipe,
        MonthPipe
    ],
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
    @Input() transitaxe: TransitTaxe;
    payForm: FormGroup;
    reasonPay: Reason[] = [];
    paymentBox: PaymentBox[] = [];
    listValueUtm: any[] = [];
    reasonService = inject(ReasonService);
    payService = inject(PayService);
    service = inject(ServiceService);
    thousandSeparatorPipe = inject(ThousandSeparatorPipe);
    monthPipe = inject(MonthPipe);
    @Output() closeEmiter  = new EventEmitter<boolean>();
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.initForm();
    }

    private initForm() {
        this.payForm = this.fb.group({
            patente: ['', Validators.required],
            correlativoMop: ['', Validators.required],
            valorUtm: [null, Validators.required],
            nombreCompleto: ['', Validators.required],
            rut: ['', Validators.required],
            razonPago: [null, Validators.required],
            folio: ['', Validators.required],
            ingreso: ['', Validators.required],
            caja: [null, Validators.required],
            fechaPago: [new Date(), Validators.required],
            observaciones: [''],
            valor: [0, Validators.required],
        });

    }

    ngOnInit() {
        this.loadReasonsPay();
        this.loadPaymentBox();
        this.loadValueUtm();
        this.payForm.patchValue({
            patente: this.transitaxe.patente,
            correlativoMop: this.transitaxe.correlativo_mop,
            nombreCompleto: this.transitaxe.nombres + ' ' + this.transitaxe.apellido_paterno + ' ' + this.transitaxe.apellido_materno,
            rut: this.transitaxe.rut + '-' + this.transitaxe.dv_rut,
        });
    }

    private loadReasonsPay() {
        // TODO: Cargar desde el servicio
        this.reasonService.getReasonsPay().subscribe((res) => {
            this.reasonPay = res.data;
        },
        (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las razones de pago' });
        });
    }

    private loadPaymentBox() {
        // TODO: Cargar desde el servicio
        this.payService.getPaymentBox().subscribe((res) => {
            this.paymentBox = res.data;
        },
        (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las cajas' });
        });
    }

    private loadValueUtm() {
        this.service.getValueUtm().subscribe((res) => {
            this.listValueUtm = res.data;
        },
        (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el valor UTM' });
        });
    }

    onChangeValue() {
        // TODO: Implementar diálogo o lógica para cambiar el valor UTM
        this.messageService.add({
            severity: 'info',
            summary: 'Cambio de Valor',
            detail: 'Funcionalidad en desarrollo'
        });
    }

    onBack() {
        this.closeEmiter.emit();
    }

    onGeneratePayment() {
        if (this.payForm.valid) {
            // TODO: Implementar lógica de guardado
            console.log('Datos del pago:', this.payForm.value);

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago generado correctamente'
            });
            // Esperar 2 segundos antes de redirigir
            setTimeout(() => {
                this.closeEmiter.emit();
            }, 2000);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos requeridos'
            });

            // Marcar todos los campos como touched para mostrar errores
            Object.keys(this.payForm.controls).forEach(key => {
                const control = this.payForm.get(key);
                control?.markAsTouched();
            });
        }
    }

    getReasonLabel = (reason: any): string => {
        return `${reason.nombre} - ${reason.descripcion}`;
    }

    getPaymentBoxLabel = (box: any): string => {
        return `Caja ${box.numero_caja}`;
    }

    getUtmLabel = (utm: any): string => {
        return `${this.monthPipe.transform(utm.mes)} / ${utm.anio} - $${this.thousandSeparatorPipe.transform(utm.valor)}`;
    }

    setValuesByUtm(){
        const utm = this.payForm.get('valorUtm')?.value;
        if(utm && utm.valor){
            this.payForm.patchValue({
                valor: Number(utm.valor)
            });
        }
    }

    setValuesByReason(){
        const reason = this.payForm.get('razonPago')?.value;
        const valorUtm = this.payForm.get('valorUtm')?.value;

        if(reason && reason.id === 10 && valorUtm){
            this.payForm.patchValue({
                valor: Math.round(valorUtm.valor * 0.7)
            });
        }
        if(reason && reason.id === 9){
            this.payForm.patchValue({
                valor: valorUtm.valor
            });
        }
    }
}
