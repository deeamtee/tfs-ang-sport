import {Component, Input, OnInit} from '@angular/core';
import {NEVER, Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {IPurchase} from '../model/i-purchase';
import {IWallet} from '../model/iwallet';
import {TrainingService} from './training.service';
import {TrainListService} from '../train-list/train-list.service';

@Component({
  selector: 'tfs-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {
  @Input() wallet: IWallet;

  purchases$: Observable<IPurchase[]>;
  balance$: Observable<number>;
  total = 0;
  isAddPurchaseOpen = false;
  currentOpen = 0;

  private destroy$ = new Subject();
  private changeTitleSubject = new Subject<string>();

  constructor(private purchasesService: TrainingService,
              private walletListService: TrainListService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.setUpNameChanges();

    if (this.wallet) {
      this.loadPurchases();
      return;
    }

    this.route.params.pipe(
      switchMap(({id}) => {
        if (id) {
          return this.walletListService.getWalletById(id);
        }

        return NEVER;
      }),
      takeUntil(this.destroy$)
    )
      .subscribe(wallet => {
        if (wallet) {
          this.wallet = wallet;
          this.loadPurchases();
          return;
        }

        this.router.navigate(['wallets']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  toggleAdd() {
    this.isAddPurchaseOpen = !this.isAddPurchaseOpen;
  }

  onAddPurchase(purchase: IPurchase) {
    this.purchasesService.addPurchase(purchase, this.wallet.id)
      .subscribe(() => {
        this.toggleAdd();
      });
  }

  loadPurchases() {
    this.purchases$ = this.purchasesService.loadPurchases(this.wallet.id);
    this.balance$ = this.purchases$
      .pipe(
        map(purchases => this.wallet.amount - TrainingService.calcTotal(purchases)),
        startWith(this.wallet.amount)
      );
  }

  isCurrentOpen(index: number) {
    return index === this.currentOpen;
  }

  setCurrentOpen(index: number) {
    if (this.currentOpen === index) {
      this.currentOpen = null;
      return;
    }

    this.currentOpen = index;
  }

  onPreviewDelete(purchase: IPurchase) {
    this.purchasesService.deletePurchase(purchase.id, this.wallet.id);
  }

  changeTitle(title: string) {
    this.changeTitleSubject.next(title);
  }

  private setUpNameChanges() {
    this.changeTitleSubject
      .pipe(
        map(name => name.trim()),
        filter(name => !!name),
        map(name => name.length <= 20 ? name : name.substr(0, 20)),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => this.walletListService.updateWallet({...this.wallet, name}))
      )
      .subscribe((res) => {
        console.log('--- res', res);
      });

  }
}
