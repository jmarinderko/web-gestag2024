import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ListLoadModulationComponent } from './components/listLoadModulation/listLoadModulation.component';
import { ListModulationComponent } from './components/list/list.component';
import { ListProcessComponent } from './components/listProcess/listProcess.component';
import { ListjplComponent } from './components/listjpl/listjpl.component';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';

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
        ListjplComponent,
        PermissionsDirective,
    ],
    templateUrl: './modulation.component.html',
    styleUrl: './modulation.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModulationComponent {
    activeIndex: number = 0;
}
