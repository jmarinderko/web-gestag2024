import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import {
    Citation,
    CountInfraccionesGroupByEntity,
    CountInfraccionesGroupByEntityAndMonthandYear
} from 'src/app/interfaces/Citation.interface';
import { CitationService } from 'src/app/services/citation.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-citation',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        TabViewModule,
        TableModule,
        ThousandSeparatorPipe,
        TooltipModule,
        DialogModule,
        FormsModule,
        MessagesModule,
        CalendarModule,
        DropdownModule,
        ReactiveFormsModule,
        InputTextModule,
    ],
    templateUrl: './citation.component.html',
    styleUrl: './citation.component.scss',
    providers: [MessageService]
})
export class CitationComponent implements OnInit {
    // Estado del componente
    citations: Citation[] = [];
    loading = false;
    showCitationDialog = false;
    availableCitations: CountInfraccionesGroupByEntityAndMonthandYear[] = [];
    selectedAvailableCitation: CountInfraccionesGroupByEntityAndMonthandYear | null = null;
    totalCitations: CountInfraccionesGroupByEntity | null = null;

    // Formulario
    citationForm: FormGroup;
    messagesform: Message[] = [];
    messages: Message[] = [];
    // Servicios inyectados
    private readonly citationService = inject(CitationService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);

    constructor() {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    /**
     * Inicializa el formulario de citación
     */
    private initForm(): void {
        this.citationForm = this.fb.group({
            qty: ['', [Validators.required, Validators.min(1)]],
            dateCitation: ['', Validators.required],
        });
    }

    /**
     * Carga los datos de citaciones
     */
    private async loadData(): Promise<void> {
        this.loading = true;

        this.citationService.list()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (response) => {
                    this.citations = response.data.citations;
                    this.totalCitations = response.data.countInfraccionesGroupByEntity;
                    this.availableCitations = response.data.countInfraccionesGroupByEntityAndMonthandYear;
                },
                error: () => this.showMessage('error', 'Error al cargar las citaciones')
            });
    }

    /**
     * Elimina una citación
     */
    deleteCitation(citation: Citation): void {
        this.citationService.deleteCitation(citation)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.loadData();
                        this.showMessage('success', 'Citación eliminada correctamente');
                    } else {
                        this.showMessage('error', 'Error al eliminar la citación');
                    }
                },
                error: () => this.showMessage('error', 'Error al eliminar la citación')
            });
    }

    /**
     * Abre el diálogo de nueva citación
     */
    openCitationDialog(): void {
        this.showCitationDialog = true;
        this.citationForm.reset();
    }

    /**
     * Envía el formulario de citación
     */
    submitCitation(): void {
        if (this.citationForm.invalid) {
            this.showMessage('error', 'Debe ingresar la cantidad de citaciones y seleccionar el día de citación');
            return;
        }

        this.citationService.generateCitation(this.citationForm.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.loadData();
                        this.citationForm.reset();
                        this.showCitationDialog = false;
                        this.showMessage('success', 'Citación generada correctamente');
                    } else {
                        this.showMessage('error', 'Error al generar la citación');
                    }
                },
                error: () => this.showMessage('error', 'Error al generar la citación')
            });
    }

    /**
     * Muestra un mensaje usando el MessageService
     */
    private showMessage(severity: 'success' | 'error', detail: string): void {
        this.messageService.add({
            severity,
            detail,
            life: 3000
        });
    }
}
