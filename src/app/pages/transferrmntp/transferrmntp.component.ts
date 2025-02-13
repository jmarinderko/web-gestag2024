import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';
import { CreateSendRmntpComponent } from './components/createSendRmntp/createSendRmntp.component';
import { ListComponent } from './components/list/list.component';

@Component({
    selector: 'app-transferrmntp',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        TabViewModule,
        PermissionsDirective,
        CreateSendRmntpComponent,
        ListComponent,
    ],
    templateUrl: './transferrmntp.component.html',
    styleUrl: './transferrmntp.component.scss',
})
export class TransferrmntpComponent {
    activeIndex: number = 0;
}
