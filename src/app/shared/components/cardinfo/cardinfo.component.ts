import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
@Component({
    selector: 'app-cardinfo-shared',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span
                        class="block text-blue-600 font-medium mb-3 text-xl "
                        >{{data.title}}</span
                    >
                    <div *ngFor="let item of data.items" class="text-blue-600 font-large mb-1">
                        {{item.label}}:
                        <span class="text-green-500 font-medium"
                            >{{item.value}} </span
                        >
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './cardinfo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardinfoComponent {
    @Input() data: any;
    constructor() {}
    ngOnInit() {
        // console.log(this.data);
    }
}
