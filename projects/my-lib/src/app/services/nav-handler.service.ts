import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { routePaths } from '../../app/constants/routing.constant';

declare var createComponent;

@Injectable({
	providedIn: 'root'
})
export class NavHandlerService {

	constructor(private router: Router) {
		
	}

	goto(cmpnt, meta) {
		if(environment.library) {
			this.givePath(cmpnt, meta)
		} else {
			this.navigateTo(cmpnt, meta);
		}
	}

	givePath(cmpntName, details) {
		if(details && typeof(details) == "object") {
			for (const detail in details) {
				if (details.hasOwnProperty(detail)) {
					localStorage.setItem(detail, details[detail]);
				}
			}
		}
		createComponent(cmpntName);
	}

	navigateTo(cmpntName, details) {
		let paths = {
			"login": [routePaths.AUTH,routePaths.LOGIN],
			"signup": [routePaths.AUTH, routePaths.SIGNUP],
			"account-link": [routePaths.CONSENTS],
			"dashboard": [routePaths.DASHBOARD],
			"consents": [routePaths.CONSENTS],
			'consent': [routePaths.CONSENT, ...Object.values(details)],
			"linking-intro": [routePaths.START_ACCOUNT_LINKING]
		}
		let path = paths[cmpntName];
		this.router.navigate(path);
	}

}
