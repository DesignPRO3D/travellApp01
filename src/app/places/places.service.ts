import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	private _places = new BehaviorSubject<Place[]>([
		new Place(
			'p1',
			'Manhattan Mansion',
			'In the heart of New York City',
			'https://cdn.vox-cdn.com/thumbor/o8i78cus90a1owJAbC-kzlr7ALs=/0x0:6303x4202/1200x800/filters:focal(2648x1597:3656x2605)/cdn.vox-cdn.com/uploads/chorus_image/image/63239068/GettyImages_929640540_2.0.jpg',
			149.99,
			new Date('2019-05-01'),
			new Date('2019-11-31'),
			'abc'
		),
		new Place(
			'p2',
			"L'Amour Towjours",
			'A romantic place in Paris',
			'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
			189.89,
			new Date('2019-07-01'),
			new Date('2019-10-31'),
			'abc'
		),
		new Place(
			'p3',
			'The foggy palace',
			'Not your average city trip',
			'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
			99.45,
			new Date('2019-04-21'),
			new Date('2019-12-24'),
			'abc'
		)
	]);

	get places() {
		return this._places.asObservable();
	}

	constructor(private authService: AuthService) {}

	getPlace(id: string) {
		return this.places.pipe(
			take(1),
			map(places => {
				return { ...places.find(place => place.id === id) };
			})
		);
	}

	updatePlace(placeId: string, title: string, description: string) {
		return this.places.pipe(
			take(1),
			delay(1000),
			tap(places => {
				const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
				const updatedPlaces = [...places];
				const oldPlace = updatedPlaces[updatePlaceIndex];
				updatedPlaces[updatePlaceIndex] = new Place(
					oldPlace.id,
					title,
					description,
					oldPlace.imageUrl,
					oldPlace.price,
					oldPlace.availableFrom,
					oldPlace.availableTo,
					oldPlace.userId
				);
				this._places.next(updatedPlaces);
			})
		);
	}

	addPlace(
		title: string,
		description: string,
		price: number,
		datefrom: Date,
		dateTo: Date
	) {
		const _img =
			'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg';
		const newplace = new Place(
			Math.random().toString(),
			title,
			description,
			_img,
			price,
			datefrom,
			dateTo,
			this.authService.userId
		);
		return this.places.pipe(
			take(1),
			delay(1000),
			tap(places => {
				this._places.next(places.concat(newplace));
			})
		);
	}
}
