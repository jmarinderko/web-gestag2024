import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { RmntpService } from 'src/app/services/rmntps.service';

@Component({
  selector: 'app-create-send-rmntp-by-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TableModule,
    DividerModule,
  ],
  templateUrl: './createSendRmntpByForm.component.html',
  styleUrl: './createSendRmntpByForm.component.scss',
})
export class CreateSendRmntpByFormComponent {
  messages: Message[] | undefined;
  form: FormGroup = this.fb.group({
    rut: [''],
    nombres: [''],
    apellido_paterno: [''],
    apellido_materno: [''],
    patente: [''],
    correlativo_mop: ['']
  });
  rmntpService = inject(RmntpService);
  listInfracciones: any[] = [];
  selectedInfracciones: any[] = [];
  loading: boolean = false;

  @Output() closeEmiter = new EventEmitter<void>();

  constructor(private fb: FormBuilder,private confirmationService: ConfirmationService) { }

  consult() {
    // Verificar que al menos un campo tenga datos
    const formValues = this.form.value;
    const hasAtLeastOneValue = Object.values(formValues).some(value =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
    );

    if (!hasAtLeastOneValue) {
      this.messages = [{ severity: 'error', detail: 'Debe ingresar al menos un criterio de búsqueda' }];
      return;
    }

    if (this.form.invalid) {
      this.messages = [{ severity: 'error', detail: 'Por favor complete los campos' }];
      return;
    }

    this.loading = true;
    this.rmntpService.findInfraccionByForm(this.form.value).subscribe(
      (res) => {
        if (res.data.length === 0) {
          this.messages = [{ severity: 'error', detail: 'No se encontraron infracciones' }];
          this.loading = false;
          return;
        }
        this.listInfracciones = res.data;
        this.loading = false;
      },
      (err) => {
        this.messages = [{ severity: 'error', detail: 'Error al realizar la consulta' }];
        this.loading = false;
      }
    );
  }

  Send() {
    if (this.selectedInfracciones.length == 0) {
      this.messages = [{ severity: 'error', detail: 'Debe seleccionar al menos una infracción' }];
      return;
    }
    this.confirmationService.confirm({
        message: '¿Está seguro de realizar esta acción?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            // Si el usuario acepta, ejecuta la acción
            this.rmntpService.sendByForm(this.selectedInfracciones).subscribe(
                (res) => {
                    if (res.success) {
                        this.messages = [{ severity: 'success', detail: 'Operación realizada correctamente' }];
                        setTimeout(() => {
                            this.closeEmiter.emit();
                        }, 2000);
                    } else {
                        this.messages = [{ severity: 'error', detail: 'Error al realizar la operación' }];
                    }
                },
                (err) => {
                    this.messages = [{ severity: 'error', detail: 'Error al realizar la operación' }];
                }
            )
        }
    });
  }

    clear(table: Table) {
        table.clear();
    }
}
