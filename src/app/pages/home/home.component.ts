import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    ChangeDetectorRef,
} from '@angular/core';

import { Response } from 'src/app/interfaces/Response.interface';
import { PanelModule } from 'primeng/panel';
import { CardinfoComponent } from 'src/app/shared/components/cardinfo/cardinfo.component';
import { Cardinfo } from 'src/app/interfaces/Cardinfo.interface';
import { HomeService } from 'src/app/services/home.service';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        CardinfoComponent,
        PermissionsDirective,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    homeServices = inject(HomeService);
    QtyTransittaxes: Response = null;
    dataCard: Cardinfo = null;
    dataCardjpl: Cardinfo = null;
    options: any;
    constructor(private cdRef: ChangeDetectorRef) {
        console.log('constructor');
        this.loadInfoJpl();
        this.LoadInfoMun();
    }

    LoadInfoMun() {
        console.log(this.dataCard);
        this.homeServices.getInfoCardmun().subscribe((res) => {
            this.dataCard = res.data;
            this.cdRef.detectChanges();
        });
    }

    loadInfoJpl() {
        console.log(this.dataCardjpl);
        this.homeServices.getInfoCardjpl().subscribe((res) => {
            this.dataCardjpl = res.data;
            this.cdRef.detectChanges();
        });
    }
}
