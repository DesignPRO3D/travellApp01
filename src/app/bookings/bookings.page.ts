import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.page.html',
	styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
	loadedBookings: Booking[];
	private bookingsSub: Subscription;

	constructor(
		private service: BookingService,
		private loadingCtrl: LoadingController
	) {}

	ngOnInit() {
		this.bookingsSub = this.service.bookings.subscribe(bookings => {
			this.loadedBookings = bookings;
			console.log(bookings);
		});
	}

	onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
		slidingEl.close();
		this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
			loadingEl.present();
			this.service.cancelBooking(bookingId).subscribe(() => {
				loadingEl.dismiss();
			});
		});
	}

	ngOnDestroy() {
		if (this.bookingsSub) {
			this.bookingsSub.unsubscribe();
		}
	}
}
