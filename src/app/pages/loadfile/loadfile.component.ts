import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { LoadFileService } from 'src/app/services/loadfile.service';
import { StatusLoadFilePipe } from 'src/app/shared/pipe/statusLoadFile.pipe';
import { NewloadfileComponent } from './components/new/newloadfile.component';
import { Table } from 'primeng/table';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';

@Component({
    selector: 'app-loadfile',
    standalone: true,
    imports: [
        CommonModule,
        ThousandSeparatorPipe,
        PanelModule,
        ButtonModule,
        DialogModule,
        TableModule,
        DividerModule,
        StatusLoadFilePipe,
        NewloadfileComponent,
        PermissionsDirective
    ],
    templateUrl: './loadfile.component.html',
    styleUrl: './loadfile.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadfileComponent implements OnInit {
    files: any[] = [];
    fileSelected: any = null;
    showLoad: boolean = false;
    loadFileService = inject(LoadFileService);
    searchValue: string | undefined;

    constructor() {}

    ngOnInit() {
        this.loadFileService.getloadFile().subscribe((res) => {
            this.files = res.data;
        });
    }

    newFile() {
        this.fileSelected = null;
        this.showLoad = true;
    }

    editFile(file: any) {
        this.fileSelected = file;
        this.showLoad = true;
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }
}
