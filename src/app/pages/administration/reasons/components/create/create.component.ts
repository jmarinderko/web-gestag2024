import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { catchError, map, of } from 'rxjs';
import { Reason } from 'src/app/interfaces/TransitTaxe.interface';
import { ReasonService } from 'src/app/services/reason.service';

@Component({
    selector: 'app-create-reason',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        DropdownModule,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
    @Input() reasonSelected: Reason | undefined;
    @Input() listReasons: Reason[] = [];
    @Input() entities: any[] = [];
    @Output() closeEmiter: EventEmitter<boolean> = new EventEmitter<boolean>();

    private reasonService = inject(ReasonService);
    messagesform: Message[] = [];

    tipeReasons: TypeDenunciation[] = [
        { label: 'Infracción pendiente', value: 1 },
        { label: 'Infracción Pagada', value: 2 },
        { label: 'Infracción Absuelta', value: 3 },
    ];

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        type_reason: ['', Validators.required],
        location: ['', Validators.required],
    });

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        if (this.reasonSelected) {
            this.populateForm(this.reasonSelected);
        }
    }

    private populateForm(reason: Reason): void {
        this.form.patchValue({
            name: reason.nombre,
            description: reason.descripcion,
            type_reason: this.tipeReasons.find(
                (type) => type.value === reason.tipo_razon
            ),
            location: this.entities.find(
                (entity) => entity.id === reason.lugar
            ),
        });
    }

    onSave(): void {
        if (this.form.invalid) {
            this.showError(
                'Error en el ingreso de los datos, todos los campos son obligatorios'
            );
            return;
        }

        const formValues = this.form.value;
        const name = formValues.name.toLocaleLowerCase();
        const type_reason = formValues.type_reason?.value;
        const location = formValues.location?.id;

        if (this.reasonSelected) {
            this.updateReason(
                name,
                formValues.description,
                type_reason,
                location
            );
        } else {
            if (this.isDuplicateReason(name, type_reason, location)) {
                this.showError(
                    'Error en el ingreso de los datos, el motivo ya existe'
                );
                return;
            }
            this.createReason(
                name,
                formValues.description,
                type_reason,
                location
            );
        }
    }

    private updateReason(
        name: string,
        description: string,
        typeReason: number,
        location: number
    ): void {
        Object.assign(this.reasonSelected, {
            nombre: name,
            descripcion: description,
            tipo_razon: typeReason,
            lugar: location,
        });

        this.reasonService
            .updateReason(this.reasonSelected)
            .pipe(
                map(() => {
                    this.closeEmiter.emit(true);
                }),
                catchError((error) => {
                    this.showError(
                        'Ocurrió un error al actualizar el motivo, por favor intenta nuevamente'
                    );
                    return of(null);
                })
            )
            .subscribe();
    }

    private createReason(
        name: string,
        description: string,
        typeReason: number,
        location: number
    ): void {
        const newReason: Reason = {
            nombre: name,
            descripcion: description,
            tipo_razon: typeReason,
            lugar: location,
            // otros campos requeridos
        };

        this.reasonService
            .createReason(newReason)
            .pipe(
                map(() => {
                    this.closeEmiter.emit(true);
                }),
                catchError((error) => {
                    this.showError(
                        'Ocurrió un error al crear el motivo, por favor intenta nuevamente'
                    );
                    return of(null);
                })
            )
            .subscribe();
    }

    private isDuplicateReason(
        name: string,
        typeReason: number,
        location: number
    ): boolean {
        return this.listReasons.some(
            (reason) =>
                reason.nombre.toLocaleLowerCase() === name &&
                reason.lugar === location &&
                reason.tipo_razon === typeReason
        );
    }

    private showError(detail: string): void {
        this.messagesform = [{ severity: 'error', detail }];
    }
}

interface TypeDenunciation {
    label: string;
    value: number;
}
