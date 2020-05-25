import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { IProduct } from '../../entity/product.interface';
import { RedirectService } from '../../../../shared/services/redirect.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../shared/services/api.service';
import { ConfirmationPopUpComponent } from '../../../../shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnDestroy {

	private readonly destroy$ = new Subject<void>();

	@Input() public product: IProduct;

	constructor(
		private readonly api: ApiService,
		public readonly redirectService: RedirectService,
		private readonly dialog: MatDialog) { }

	public getUpdateUrl() {
		return `products/update/${this.product.id}`;
	}

	public deleteProduct(product: IProduct) {
		const dialogRef = this.dialog.open(ConfirmationPopUpComponent);
		dialogRef.componentInstance.config.text = 'Do you really want to delete this product?';

		dialogRef.afterClosed().pipe(
		).subscribe((result: boolean) => {
			if (result) {
				this.api.deleteRequest(`products/${product.id}`).pipe(
					takeUntil(this.destroy$)
				).subscribe();
			}
		});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
