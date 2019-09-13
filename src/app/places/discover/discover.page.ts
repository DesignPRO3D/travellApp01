import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from '../../auth/auth.service';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
	loadedPlaces: Place[];
	listedLoadedPlaces: Place[];
	relevantPlaces: Place[];

	private placeSub: Subscription;

	constructor(
		private service: PlacesService,
		private menuCtrl: MenuController,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.placeSub = this.service.places.subscribe(places => {
			this.loadedPlaces = places;
			this.relevantPlaces = this.loadedPlaces;
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		});
	}

	onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		if (event.detail.value === 'all') {
			this.relevantPlaces = this.loadedPlaces;
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		} else {
			this.relevantPlaces = this.loadedPlaces.filter(
				place => place.userId !== this.authService.userId
			);
		}
		this.listedLoadedPlaces = this.relevantPlaces.slice();
	}

	ngOnDestroy() {
		if (this.placeSub) {
			this.placeSub.unsubscribe();
		}
	}

	// onOpenMenu() {
	// 	this.menuCtrl.toggle();
	// }
}
