import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { mergeMap } from 'rxjs';
import { GeneratedocumentsService } from 'src/app/services/generatedocuments.service';
import { ModulationService } from 'src/app/services/modulation.service';

@Component({
    selector: 'app-letter',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        PanelModule,
        FormsModule,
    ],
    templateUrl: './letter.component.html',
    styleUrl: './letter.component.scss',
})
export class LetterComponent {
    modulationService = inject(ModulationService);
    generatedocumentsService = inject(GeneratedocumentsService);
    htmlLetter: string = '';
    codeLetter: string = '';
    constructor() {}

    findLetter() {
        this.modulationService
            .findLetterByDocument(this.codeLetter)
            .pipe(
                mergeMap((res) => {
                    this.htmlLetter = res.data.html;
                    return this.generatedocumentsService.downloadLetter(
                        this.htmlLetter
                    );
                })
            )
            .subscribe(
                (excelRes) => {
                    const fileURL = URL.createObjectURL(excelRes);
                    window.open(fileURL, '_blank');
                },
                (error) => {
                    console.error('Error loading letter', error);
                }
            );
    }
}


// 1100749469492;
