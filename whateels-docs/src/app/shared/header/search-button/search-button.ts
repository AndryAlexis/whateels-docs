import { Component } from '@angular/core';
import { SearchModalService } from '../../services/search-modal.service';

@Component({
	selector: 'app-search-button',
	imports: [],
	templateUrl: './search-button.html',
	styleUrl: './search-button.css',
})
export class SearchButton {
	constructor(public searchModalService: SearchModalService) {}
}
