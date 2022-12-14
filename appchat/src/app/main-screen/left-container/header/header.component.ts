import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from 'src/app/model/userModel';
import { DataService } from 'src/app/service/data.service';
import { SearchUserService } from 'src/app/service/search-user.service';
import { UserService } from 'src/app/service/user.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  roomName: string = '';
  USERLOGIN: UserModel = {};
  name: string='';
  check: boolean = false;
  constructor(
    private dataService: DataService,
    private searchUserService: SearchUserService,
  ) {}

  ngOnInit(): void {
  }
  public search() {
    this.searchUserService.keySearch=this.name;
  }
  public showFunction() {
    this.dataService.isShowFunction = true;
    this.dataService.isShowSetting = false;
    this.dataService.isShowListChatBox = false;
    this.dataService.isShowListFriend = false;
    this.dataService.isShowSearch = false;
  }
  public showSetting() {
    this.dataService.isShowSetting = true;
    this.dataService.isShowListChatBox = false;
    this.dataService.isShowListFriend = false;
    this.dataService.isShowSearch = false;
    this.dataService.isShowFunction = false;
  }
  public getUserlogin() {
    return this.dataService.USERLOGIN;
  }
  public showListChatBox() {
    this.dataService.isShowListChatBox = true;
    this.dataService.isShowListFriend = false;
    this.dataService.isShowSetting = false;
    this.dataService.isShowSearch = false;
    this.dataService.isShowFunction = false;
  }
  public showListFriend() {
    this.dataService.isShowListFriend = true;
    this.dataService.isShowListChatBox = false;
    this.dataService.isShowSetting = false;
    this.dataService.isShowSearch = false;
    this.dataService.isShowFunction = false;
  }
  public isShowListChatBox() {
    return this.dataService.isShowListChatBox;
  }
  public isShowListFriend() {
    return this.dataService.isShowListFriend;
  }
  public isShowSetting() {
    return this.dataService.isShowSetting;
  }
  public isShowFunction() {

    return this.dataService.isShowFunction;
  }
  public showSearch() {
    this.dataService.isShowSearch = true;
    this.dataService.isShowListFriend = false;
    this.dataService.isShowListChatBox = false;
    this.dataService.isShowSetting = false;
    this.dataService.isShowFunction = false;

  }
}
