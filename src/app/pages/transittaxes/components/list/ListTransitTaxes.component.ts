import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observation, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StatustransittaxesPipe } from 'src/app/shared/pipe/statustransittaxes.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ObservationTransitTaxesComponent } from '../observation/observation.component';
import { DetailtransittaxesComponent } from '../detailtransittaxes/detailtransittaxes.component';
import { DialogModule } from 'primeng/dialog';
import { CreateobservationComponent } from '../createobservation/createobservation.component';
import { DetailpayComponent } from 'src/app/pages/pay/components/detailpay/detailpay.component';
import { DataTransittaxes } from 'src/app/interfaces/Response.interface';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';
import { PayComponent } from 'src/app/pages/pay/pay.component';

@Component({
    selector: 'app-list-transit-taxes',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        StatustransittaxesPipe,
        TooltipModule,
        DialogModule,
        ObservationTransitTaxesComponent,
        DetailtransittaxesComponent,
        CreateobservationComponent,
        DividerModule,
        ChipModule,
        PermissionsDirective,
        PayComponent
    ],
    templateUrl: './ListTransitTaxes.component.html',
    styleUrl: './ListTransitTaxes.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTransitTaxesComponent implements OnInit {
    @Input() data: DataTransittaxes = null;
    list: TransitTaxe[] = [];
    info: TransitTaxe = {} as TransitTaxe;
    transittaxesSelected: TransitTaxe = null;
    observationSelected: Observation = null;
    showDetail: boolean = false;
    showObservation: boolean = false;
    showPay: boolean = false;
    showObservationList: boolean = false;
    pendingMun: number = 0;
    pendingJpl: number = 0;
    paidMun: number = 0;
    paidJpl: number = 0;
    acquitted: number = 0;
    failedRMNP: number = 0;
    otherRuts: any = null;
    constructor() {}

    ngOnInit() {
        this.list = [];
        this.list = this.data.transittaxes;
        this.info = this.list[0];
        this.pendingMun = this.list.filter((item) => item.estado === 1).length;
        this.paidMun = this.list.filter((item) => item.estado === 2).length;
        this.pendingJpl = this.list.filter((item) => item.estado === 3).length;
        this.paidJpl = this.list.filter((item) => item.estado === 4).length;
        this.acquitted = this.list.filter((item) => item.estado === 5).length;
        this.failedRMNP = this.list.filter((item) => item.estado === 6).length;
    }

    detail(item: TransitTaxe) {
        this.transittaxesSelected = item;
        this.showDetail = true;
    }

    editObservation(obs: Observation) {
        this.observationSelected = obs;
        this.showObservationList = false;
        this.showDetail = false;
        this.showObservation = true;
    }

    observation(item: TransitTaxe) {
        this.transittaxesSelected = item;
        this.showObservationList = true;
    }

    pay(item: TransitTaxe) {
        this.transittaxesSelected = item;
        this.showPay = true;
    }

    closeDetail() {
        this.observationSelected = null;
        this.transittaxesSelected = null;
        this.showDetail = false;
    }

    closeObservation() {
        this.observationSelected = null;
        this.transittaxesSelected = null;
        this.showObservation = false;
    }

    closeObservationList() {
        this.observationSelected = null;
        this.transittaxesSelected = null;
        this.showObservationList = false;
    }

    closePay() {
        this.transittaxesSelected = null;
        this.showPay = false;
    }
}
