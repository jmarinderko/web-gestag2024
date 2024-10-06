import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

    ngOnInit(): void { }

    constructor() { }



}
