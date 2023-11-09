import { Injectable } from '@angular/core';

@Injectable()
export class WindowsService {

  get windowsRef() {
    return window
  }

}