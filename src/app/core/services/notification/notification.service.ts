import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss} from '@angular/material/snack-bar';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, filter, map, take, tap} from 'rxjs/operators';

import {NotificationComponent, NotificationType} from '../../components/notification/notification.component';

interface SnackBarItem {
  message: string;
  type: NotificationType;
  beingDispatched: boolean;
}

@Injectable()
export class NotificationService {
  private readonly _config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: 'km-notification',
  };

  private readonly _notificationPopDelay = 250;  // in ms
  private readonly snackBarQueue = new BehaviorSubject<SnackBarItem[]>([]);

  constructor(private readonly _snackBar: MatSnackBar) {
    /* Dispatches all queued snack bars one by one */
    this.snackBarQueue.asObservable()
        .pipe(filter(queue => queue.length > 0 && !queue[0].beingDispatched))
        .pipe(tap(() => {
          const updatedQueue = this.snackBarQueue.value;
          updatedQueue[0].beingDispatched = true;
          this.snackBarQueue.next(updatedQueue);
        }))
        .pipe(map(queue => queue[0]))
        .subscribe(snackBarItem => this._open(snackBarItem.message, snackBarItem.type));
  }

  private _open(message: string, type: NotificationType): void {
    const snackBarRef = this._snackBar.openFromComponent(NotificationComponent, this._config);

    snackBarRef.instance.message = message;
    snackBarRef.instance.snackBarRef = snackBarRef;
    snackBarRef.instance.type = type;

    this.popNotification(snackBarRef.afterDismissed());
  }

  private popNotification(dismissed: Observable<MatSnackBarDismiss>): void {
    dismissed.pipe(delay(this._notificationPopDelay)).pipe(take(1)).subscribe(() => {
      const updatedQueue = this.snackBarQueue.value;
      if (updatedQueue[0].beingDispatched) {
        updatedQueue.shift();
      }
      this.snackBarQueue.next(updatedQueue);
    });
  }

  private _pushNotification(message: string, type: NotificationType): void {
    this.snackBarQueue.next(
        this.snackBarQueue.value.concat([{message, type, beingDispatched: false}]),
    );
  }

  success(message: string): void {
    this._pushNotification(message, NotificationType.success);
  }

  error(message: string): void {
    this._pushNotification(message, NotificationType.error);
  }
}
