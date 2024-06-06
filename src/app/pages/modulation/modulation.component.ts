import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ListLoadModulationComponent } from './components/listLoadModulation/listLoadModulation.component';
import { ModulationService } from 'src/app/services/modulation.service';
import { ListModulationComponent } from './components/list/list.component';
import { ListProcessComponent } from './components/listProcess/listProcess.component';

@Component({
    selector: 'app-modulation',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        ButtonModule,
        TabViewModule,
        ListLoadModulationComponent,
        ListModulationComponent,
        ListProcessComponent,
    ],
    templateUrl: './modulation.component.html',
    styleUrl: './modulation.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModulationComponent{
    activeIndex: number = 0;

}
