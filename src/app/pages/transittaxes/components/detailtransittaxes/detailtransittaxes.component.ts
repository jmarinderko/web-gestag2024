import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { Observation, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { ObservationTransitTaxesComponent } from '../observation/observation.component';
import { DetailpayComponent } from 'src/app/pages/pay/components/detailpay/detailpay.component';

@Component({
    selector: 'app-detail-transittaxes',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        TabViewModule,
        ObservationTransitTaxesComponent,
        DetailpayComponent,
    ],
    templateUrl: './detailtransittaxes.component.html',
    styleUrl: './detailtransittaxes.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailtransittaxesComponent {
    @Input() info: TransitTaxe = null;
    @Output() editObs = new EventEmitter<Observation>();

    constructor() {}

    ngOnInit() {}

    editObservation(obs: Observation) {
        this.editObs.emit(obs);
    }
}
