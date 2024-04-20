import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Observation, Reason, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { TransittaxesService } from 'src/app/services/transittaxes.service';
import { TableModule } from 'primeng/table';
import { ReasonService } from 'src/app/services/reason.service';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-observation-transittaxes',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        DropdownModule,
        ButtonModule,
        FormsModule,
    ],
    templateUrl: './observation.component.html',
    styleUrl: './observation.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationTransitTaxesComponent implements OnInit {
    @Input() transittaxes: TransitTaxe = null;
    @Output() editObs = new EventEmitter<Observation>();
    listObservations: Observation[] = [];
    listReasons: Reason[] = [];
    // clonedObs: Observation[];
    clonedObs: { [s: string]: Observation } = {};
    transittaxesService = inject(TransittaxesService);
    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.loadObservations();
    }

    loadObservations(): void {
        this.transittaxesService
            .loadObservationsById(this.transittaxes.id)
            .subscribe((res) => {
                this.listObservations = res.data;
                this.cdRef.detectChanges();
            });
    }

    editObservation(item: Observation) {
        this.editObs.emit(item);
    }

    deleteObservation(item: Observation) {}
}
