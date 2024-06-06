import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProcessModulation } from 'src/app/interfaces/Modulation.interface';
import { ModulationService } from 'src/app/services/modulation.service';
import { StatusprocessPipe } from 'src/app/shared/pipe/statusprocess.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-list-process-component',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ThousandSeparatorPipe,
        ButtonModule,
        StatusprocessPipe,
    ],
    templateUrl: './listProcess.component.html',
    styleUrl: './listProcess.component.scss',
})
export class ListProcessComponent implements OnInit {
    listProcess: ProcessModulation[] = [];
    modulationService = inject(ModulationService);

    ngOnInit(): void {
        this.loadListProcess();
    }

    loadListProcess() {
        this.modulationService.getListProcess().subscribe((res) => {
            this.listProcess = res.data;
        });
    }
}
