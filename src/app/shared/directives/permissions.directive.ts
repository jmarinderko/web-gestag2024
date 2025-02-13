import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

;

@Directive({
    selector: '[appPermissions]',
    standalone: true,
})
export class PermissionsDirective {
    @Input('appPermissions') set appPermission(permission: string) {
        const usuarioTienePermiso = this.checkUserPermission(permission);

        if (usuarioTienePermiso) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
    private sessionService = inject(AuthService);

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {}

    private checkUserPermission(permission: string): boolean {
        return this.sessionService.validatePermissionbyControlName(permission);
    }
}
