import { isPlatformBrowser } from '@angular/common';
import {inject, Inject, Injectable, PLATFORM_ID, Service} from '@angular/core';

@Service()
export class CookieHelper {
  private readonly platformId = inject(PLATFORM_ID)

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
