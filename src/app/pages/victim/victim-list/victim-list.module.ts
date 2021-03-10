import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VictimListPageRoutingModule } from './victim-list-routing.module';

import { VictimListPage } from './victim-list.page';
import { HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { IonicGestureConfig } from 'src/utils/HammerGestureConfig';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VictimListPageRoutingModule,
    HammerModule,
  ],
  declarations: [VictimListPage],
})
export class VictimListPageModule {}
