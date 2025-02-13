import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ReasonService } from 'src/app/services/reason.service';
import { TypeReasonPipe } from 'src/app/shared/pipe/typeReason.pipe';
import { CreateComponent } from './components/create/create.component';
import { Reason } from 'src/app/interfaces/TransitTaxe.interface';
import { HomeService } from 'src/app/services/home.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { TypeLocationPipe } from 'src/app/shared/pipe/typeLocation.pipe';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';

interface FilterState {
    mun: boolean;
    jpl: boolean;
    rmntp: boolean;
    all: boolean;
}

@Component({
    selector: 'app-reasons',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        InputSwitchModule,
        DialogModule,
        MessagesModule,
        TypeReasonPipe,
        TypeLocationPipe,
        FormsModule,
        CreateComponent,
        PermissionsDirective
    ],
    templateUrl: './reasons.component.html',
    styleUrls: ['./reasons.component.scss'],
    providers: [MessageService]
})
export class ReasonsComponent implements OnInit {
    // Estado del componente
    reasons: Reason[] = [];
    entities: any[] = [];
    filteredReasons: Reason[] = [];
    selectedReason?: Reason;
    loading = false;
    showLoadDialog = false;

    // Estado de filtros
    filters: FilterState = {
        mun: false,
        jpl: false,
        rmntp: false,
        all: true
    };

    // Servicios inyectados
    private readonly reasonsService = inject(ReasonService);
    private readonly homeService = inject(HomeService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadInitialData();
    }

    /**
     * Carga los datos iniciales usando forkJoin para peticiones paralelas
     */
    private loadInitialData(): void {
        this.loading = true;

        forkJoin({
            reasons: this.reasonsService.getReasons(),
            entities: this.homeService.getEntities()
        }).pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(error => {
                this.showError('Error al cargar los datos');
                return of({ reasons: { data: [] }, entities: { data: [] } });
            }),
            finalize(() => this.loading = false)
        ).subscribe(response => {
            this.reasons = response.reasons.data;
            this.filteredReasons = [...this.reasons];
            this.entities = response.entities.data;
        });
    }

    /**
     * Cambia el estado de los filtros y aplica el filtrado
     */
    changeFilterStatus(type: keyof FilterState): void {
        this.resetFilters();
        this.filters[type] = true;
        this.applyFilters();
    }

    /**
     * Reinicia todos los filtros a false
     */
    private resetFilters(): void {
        Object.keys(this.filters).forEach(key => {
            this.filters[key as keyof FilterState] = false;
        });
    }

    /**
     * Aplica los filtros activos a la lista de razones
     */
    private applyFilters(): void {
        if (this.filters.all) {
            this.filteredReasons = [...this.reasons];
            return;
        }

        this.filteredReasons = this.reasons.filter(reason => {
            if (this.filters.mun && reason.type === 1) return true;
            if (this.filters.jpl && reason.type === 2) return true;
            if (this.filters.rmntp && reason.type === 3) return true;
            return false;
        });
    }

    /**
     * Actualiza el estado de una razón
     */
    updateReasonStatus(reason: Reason): void {
        this.reasonsService.updateStatus(reason).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (response) => {
                if (response.success) {
                    this.showSuccess('Estado actualizado correctamente');
                    this.loadInitialData();
                } else {
                    this.showError('Error al actualizar el estado');
                }
            },
            error: () => this.showError('Error al actualizar el estado')
        });
    }

    /**
     * Muestra un mensaje de error
     */
    private showError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            detail,
            life: 3000
        });
    }

    /**
     * Muestra un mensaje de éxito
     */
    private showSuccess(detail: string): void {
        this.messageService.add({
            severity: 'success',
            detail,
            life: 3000
        });
    }
}
