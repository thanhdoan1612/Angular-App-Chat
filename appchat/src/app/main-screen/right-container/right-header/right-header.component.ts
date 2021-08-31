import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChatService } from 'src/app/service/chat.service';
import { ResponsiveService } from '../../../service/responsive.service';
import { SearchMessageService } from 'src/app/service/search-message.service';

@Component({
  selector: 'app-right-header',
  templateUrl: './right-header.component.html',
  styleUrls: ['./right-header.component.scss'],
  animations: [
    trigger('headerAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-1vw)',
        }),
        animate(
          '0.3s',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.3s',
          style({
            opacity: 0,
            transform: 'translateX(1vw)',
          })
        ),
      ]),
    ]),
    trigger('iconAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(16px)',
        }),
        animate(
          '0.3s',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class RightHeaderComponent implements OnInit {
  background: string = '#222323';
  color: string = '#aaaaaa';
  keyWord: string = '';
  managerButtonDark: boolean = false;
  constructor(
    private dataService: DataService,
    private chatService: ChatService,
    private res: ResponsiveService,
    private searchMessageService: SearchMessageService
  ) {}

  ngOnInit(): void {}
  public darkMode() {
    return this.dataService.isDarkMode;
  }
  public getKeyWordToSearch() {
    this.dataService.setSearchKeywordMessage(this.keyWord);
    this.searchMessageService.searchMessage(this.keyWord);
    this.dataService.searchKeyWord.splice(
      0,
      this.dataService.searchKeyWord.length
    );
    this.searchMessageService.searchIndex = 0;
    this.dataService.isShowSearchMessage = true;
  }
  public getKeyWord(event: any) {
    this.keyWord = event.target.value;
  }
  public getSelectedChatContent() {
    return this.dataService.getSelectedChatContent();
  }
  public showManager() {
    this.managerButtonDark = !this.managerButtonDark;
    this.dataService.isShowManager = !this.dataService.isShowManager;
  }
  public showListFriend() {
    this.res.isClickShowLeftContainer = !this.res.isClickShowLeftContainer;
  }
  public showListFriendButton() {
    return this.res.isMobileRes(992);
  }
}
