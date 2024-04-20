import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { Observation, Reason, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { ReasonService } from 'src/app/services/reason.service';
import { TransittaxesService } from 'src/app/services/transittaxes.service';
import { DropdownModule } from 'primeng/dropdown';
@Component({
    selector: 'app-create-observation',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        InputTextareaModule,
        CalendarModule,
        DropdownModule,
    ],
    templateUrl: './createobservation.component.html',
    styleUrl: './createobservation.component.scss',
})
export class CreateobservationComponent {
    @Input() transittaxes: TransitTaxe = null;
    @Input() observation: Observation = null;
    newObservation: Observation = {} as Observation;
    listReasons: Reason[] = [];
    reasonService = inject(ReasonService);
    transittaxesService = inject(TransittaxesService);
    form: FormGroup = this.fb.group({
        fecha: ['', Validators.required],
        reason: new FormControl<Reason | null>(null, Validators.required),
        observacion: [''],
        id_infraccion: [''],
    });
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.loadReasons();
        if (this.observation) {
            this.form.patchValue({
                fecha: new Date(this.observation.fecha),
                reason: this.observation.reason,
                observacion: this.observation.observacion,
                id_infraccion: this.transittaxes.id,
            });
        }
        console.log(this.form.value);
    }

    loadReasons(): void {
        this.reasonService.getReasons().subscribe((res) => {
            this.listReasons = res.data;
        });
    }

    onSave() {}
}
