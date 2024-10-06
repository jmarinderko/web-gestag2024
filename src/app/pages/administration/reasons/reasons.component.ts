import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ReasonService } from 'src/app/services/reason.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { TypeLocationPipe } from 'src/app/shared/pipe/typeLocation.pipe';
import { TypeReasonPipe } from 'src/app/shared/pipe/typeReason.pipe';
import { CreateComponent } from './components/create/create.component';
import { Reason } from 'src/app/interfaces/TransitTaxe.interface';
import { HomeService } from 'src/app/services/home.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-reasons',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush, // Estrategia de detección de cambios optimizada
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        ButtonModule,
        TableModule,
        ThousandSeparatorPipe,
        TooltipModule,
        InputSwitchModule,
        DialogModule,
        MessagesModule,
        TypeReasonPipe,
        TypeLocationPipe,
        FormsModule,
        CreateComponent,
    ],
    templateUrl: './reasons.component.html',
    styleUrls: ['./reasons.component.scss'],
})
export class ReasonsComponent implements OnInit {
    listReasons: Reason[] = [];
    entities: any[] = [];
    listfilteredReasons: Reason[] = [];
    reasonSelected: Reason | undefined;
    messages: Message[] = [];
    loading = false;
    showLoad = false;

    // Se agrupan los filtros en un solo objeto
    filters = {
        mun: false,
        jpl: false,
        rmntp: false,
        all: false,
    };

    private reasonsService = inject(ReasonService);
    private homeService = inject(HomeService);

    constructor() {}

    ngOnInit(): void {
        this.loadInitialData();
    }

    // Uso de forkJoin para cargar datos en paralelo
    loadInitialData(): void {
        this.loading = true;

        forkJoin({
            reasons: this.reasonsService.getReasons(),
            entities: this.homeService.getEntities(),
        }).subscribe({
            next: (res) => {
                this.listReasons = res.reasons.data;
                this.listfilteredReasons = [...this.listReasons]; // Clon para mantener los datos originales
                this.entities = res.entities.data;
                this.filters.all = true;
            },
            error: () => this.showError('Error al cargar los datos'),
            complete: () => (this.loading = false),
        });
    }

    // Método para cambiar el estado de los filtros
    changeValueStatus(type: 'mun' | 'jpl' | 'rmntp' | 'all'): void {
        this.resetFilters();
        this.filters[type] = true;

        switch (type) {
            case 'mun':
                this.listfilteredReasons = this.filterByLocation(3);
                break;
            case 'jpl':
                this.listfilteredReasons = this.filterByLocation(4);
                break;
            case 'rmntp':
                this.listfilteredReasons = this.filterByLocation(6);
                break;
            case 'all':
            default:
                this.listfilteredReasons = [...this.listReasons];
                break;
        }
    }

    // Filtra la lista por ubicación
    filterByLocation(locationId: number): Reason[] {
        return this.listReasons.filter((reason) => reason.lugar === locationId);
    }

    // Reinicia todos los filtros a `false`
    resetFilters(): void {
        Object.keys(this.filters).forEach(
            (key) => (this.filters[key as keyof typeof this.filters] = false)
        );
    }

    // Manejo de la actualización del motivo
    update(item: Reason): void {
        this.reasonSelected = item;
        this.showLoad = true;
    }

    // Nuevo archivo (motivo)
    newFile(): void {
        this.reasonSelected = undefined;
        this.showLoad = true;
    }

    // Cierra el diálogo y recarga la lista de motivos
    closeEmiter(event: boolean): void {
        this.showLoad = false;
        this.showSuccess('Acción realizada con éxito');
        this.loadInitialData();
    }

    // Mensaje de éxito
    private showSuccess(detail: string): void {
        this.messages = [{ severity: 'success', detail }];
    }

    // Mensaje de error
    private showError(detail: string): void {
        this.messages = [{ severity: 'error', detail }];
    }
}
