import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CookieHelper {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public getCookieByName(name: any): any {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  public logout() {

  }
}
