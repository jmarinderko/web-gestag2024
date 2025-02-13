import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RmntpService } from 'src/app/services/rmntps.service';
import { ThousandSeparatorPipe } from 'src/app/shared/pipe/thousand-separator.pipe';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        CommonModule,
        ConfirmDialogModule,
        ThousandSeparatorPipe,
        ButtonModule,
        TableModule,
        DividerModule,
        TooltipModule,
        DialogModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    rmntpList: any[] = [];
    loading: boolean = false;
    rmntpSelected: any = {};
    rmntpService = inject(RmntpService);
    ngOnInit(): void {
        this.loadList();
    }

    loadList() {
        this.loading = true;
        this.rmntpService.listAll().subscribe(
            (res) => {
                this.loading = false;
                this.rmntpList = res.data;
            },
            (err) => {
                this.loading = false;
                console.error(err);
            }
        );
    }

    openFile(item: any) {
    this.rmntpService.downloadFile(item).subscribe(
        (response) => {
            // Verificar si los encabezados están disponibles
            if (response.headers) {
                // Obtener el nombre del archivo desde Content-Disposition
                const contentDisposition = response.headers.get(
                    'Content-Disposition'
                );
                let fileName = 'archivo_generado.txt'; // Nombre por defecto
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match && match[1]) {
                        fileName = match[1];
                    }
                }

                // Crear un enlace para descargar el archivo
                const blob = response.body;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName; // Usar el nombre del archivo del backend
                a.click();
                window.URL.revokeObjectURL(url); // Liberar el recurso creado
            } else {
                console.error('Encabezados no disponibles en la respuesta');
            }
        },
        (error) => {
            console.error('Error al descargar el archivo:', error);
        }
    );
    }
}
