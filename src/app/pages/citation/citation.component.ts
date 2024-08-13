import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
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
import { Citation, Citations, CountInfraccionesGroupByEntity, CountInfraccionesGroupByEntityAndMonthandYear } from 'src/app/interfaces/Citation.interface';
import { CitationService } from 'src/app/services/citation.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

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
})
//TODO:_ en caso de tener mas de un jpl se debe ingresar una variable en la cual seleccione el jpl que se desea utilizar y esta variable integrarla en el token
//TODO:_ como no es el caso no se ingresara la variable
export class CitationComponent implements OnInit {
    listCitations: Citation[] = [];
    citationService = inject(CitationService);
    loading: boolean = false;
    dialogCitation: boolean = false;
    listQtyAvailableCitation: CountInfraccionesGroupByEntityAndMonthandYear[] =
        [];
    selectQtyAvailableCitation: any;
    qtyTotalCitation: CountInfraccionesGroupByEntity = null;
    form: FormGroup = this.fb.group({
        qty: ['', Validators.required],
        dateCitation: ['', Validators.required],
    });
    messagesform: Message[] | undefined;
    messages: Message[] | undefined;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.load();
    }

    async load() {
        this.loading = true;
        await this.citationService.list().subscribe((response) => {
            this.listCitations = response.data.citations;
            this.qtyTotalCitation =
                response.data.countInfraccionesGroupByEntity;
            this.listQtyAvailableCitation =
                response.data.countInfraccionesGroupByEntityAndMonthandYear;
        });
        this.loading = false;
    }

    deleteCitation(citation: Citation) {
        this.citationService.deleteCitation(citation).subscribe((res) => {
            if (res.success) {
                this.load();
                this.messages = [
                    {
                        severity: 'success',
                        detail: 'Citación eliminada',
                    },
                ];
            }else{
                this.messages = [
                    {
                        severity: 'error',
                        detail: 'Error al eliminar la citación',
                    },
                ];
            }
        });
    }

    openDialogCitation() {
        this.dialogCitation = true;
        console.log('Generating citation');
    }

    submitCitation() {
        if (this.form.invalid) {
            this.messagesform = [
                {
                    severity: 'error',
                    detail: 'Debe ingresar la cantidad de citaciones, y seleccionar el dia de citación',
                },
            ];
            return;
        }

        this.citationService
            .generateCitation(this.form.value)
            .subscribe((res) => {
                if (res.success) {
                    this.load();
                    this.form.reset();
                    this.dialogCitation = false;
                    this.messages = [
                        {
                            severity: 'success',
                            detail: 'Citación generada correctamente',
                        },
                    ];
                }else{
                    this.messagesform = [
                        {
                            severity: 'error',
                            detail: 'Error al generar la citación',
                        },
                    ];
                }
            });
    }
}
