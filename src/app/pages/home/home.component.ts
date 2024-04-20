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

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        CardinfoComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    homeServices = inject(HomeService);
    QtyTransittaxes: Response = null;
    dataCard: Cardinfo = null;
    options: any;
    constructor(
        private cdRef: ChangeDetectorRef
    ) {
        console.log('constructor');
        this.loadChart();
    }

    loadChart() {
        console.log(this.dataCard);
        this.homeServices.getInfoCard().subscribe((res) => {
            this.dataCard = res.data;
            this.cdRef.detectChanges();
        });

    }
}
