import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { GenerationComponent } from './components/generation/generation.component';
import { PendingComponent } from './components/pending/pending.component';
import { CompletedComponent } from './components/completed/completed.component';

@Component({
    selector: 'app-transfer',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        TabViewModule,
        GenerationComponent,
        PendingComponent,
        CompletedComponent,
    ],
    templateUrl: './transfer.component.html',
    styleUrl: './transfer.component.scss',
})
export class TransferComponent {
    activeIndex: number = 0;
}
