import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ModulationService } from 'src/app/services/modulation.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-list-load-modulation',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ThousandSeparatorPipe,
        TooltipModule,
        ButtonModule,
        DividerModule,
    ],
    templateUrl: './listLoadModulation.component.html',
    styleUrl: './listLoadModulation.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLoadModulationComponent {
    listLoad: any[] = [];
    selectedLoad: any[] = [];
    modulationService = inject(ModulationService);
    loading: boolean = false;
    constructor() {}

    async ngOnInit() {
        await this.loadListLoad();
    }

    loadListLoad() {
        this.loading = true;
        this.modulationService.getListLoad().subscribe((res) => {
            this.listLoad = res.data;
            this.loading = false;
        });
    }

    generateModulation() {
        console.log('generate modulation');
        const ids = this.selectedLoad.map((item) => item.id);
        this.modulationService
            .generateModulation({ ids: ids })
            .subscribe((res) => {
                // this.loadListLoad();
                window.location.reload();
            });
    }
}
