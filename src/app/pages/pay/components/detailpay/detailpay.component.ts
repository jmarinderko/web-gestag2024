import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Reason, TransitTaxe } from 'src/app/interfaces/TransitTaxe.interface';
import { CurrencyClPipe } from 'src/app/shared/pipe/currency-cl.pipe';
import { ReasonService } from 'src/app/services/reason.service';
import { PayService } from 'src/app/services/pay.service';
import { PaymentBox } from 'src/app/interfaces/Pay.interface';
@Component({
    selector: 'app-detail-pay',
    standalone: true,
    imports: [CommonModule, CurrencyClPipe],
    templateUrl: './detailpay.component.html',
    styleUrl: './detailpay.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailpayComponent {
    @Input() transittaxes: TransitTaxe = null;
    reason: Reason = null;
    paymentBox: PaymentBox = null;
    reasonService = inject(ReasonService);
    payService = inject(PayService);
    constructor() {}

    ngOnInit() {
        if (this.transittaxes.pay) {
            this.loadReasons();
            this.loadPaymentBoxById();
        }
    }

    loadReasons(): void {
        this.reasonService.reasonById(this.transittaxes.pay.tipo_pago).subscribe((res) => {
            this.reason = res.data;
        });
    }

    loadPaymentBoxById(){
        this.payService.getPaymentBoxById(this.transittaxes.pay.id_caja).subscribe((res) => {
            this.paymentBox = res.data;
        });
    }
}
