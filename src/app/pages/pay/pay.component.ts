import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-pay',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './pay.component.html',
    styleUrl: './pay.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayComponent {
    form: FormGroup = this.fb.group({
        patent: [''],
        role: [''],
        pending: [''],
        paid: [''],
        acquitted: [''],
        failedRMNP: [''],
    });

    constructor(private fb: FormBuilder) {}

    onSave(){}
}
