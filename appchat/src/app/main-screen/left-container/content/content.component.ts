import { Component, OnInit } from '@angular/core';
import { ChatContent } from 'src/app/model/ChatContent';
import { GroupChat } from 'src/app/model/GroupChat';
import { UserModel } from 'src/app/model/userModel';
import { ChatService } from 'src/app/service/chat.service';
import { DataService } from 'src/app/service/data.service';
import { GifService } from 'src/app/service/gif.service';
import { UserService } from 'src/app/service/user.service';
import { WebSocketService } from 'src/app/service/web-socket.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from "@angular/animations";

import {ResponsiveService} from "../../../service/responsive.service";

import { ImageService } from 'src/app/service/image.service';
import { SearchUserService } from 'src/app/service/search-user.service';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger("listAnimation",[
      transition('* => *',[
        query(':enter', style({opacity:0}),{optional:true}),
        query(':enter', stagger('50ms',[
          animate('0.3s', keyframes([
            style({opacity:0, transform: "translateX(-75px)",offset: 0}),
            style({opacity:1, transform: "translateX(0px)",offset: 1}),
          ]))
        ]),{optional:true})
      ])
    ])
  ],
})
export class ContentComponent implements OnInit {
  USERLOGIN: UserModel = {};
  checkSearch: boolean = false;
  name: string = '';
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private wss: WebSocketService,
    private chatService: ChatService,
    private gifService: GifService,
    private searchUserService:SearchUserService,

    private res: ResponsiveService,

    private imageService: ImageService

  ) {}

  ngOnInit(): void {
    this.dataService.search$.subscribe((text) => (this.name = text));
    this.USERLOGIN = JSON.parse(sessionStorage.USERLOGIN);
  }

  public selected(index :number){
    let listActive : any = document.getElementsByClassName("chat-active");
    for(let i = 0; i < listActive.length; i++){
      listActive.item(i).classList.remove("chat-active");
    }
    let className:string = "user-"+index;
    let listElements : any = document.getElementsByClassName(className);
    for(let i = 0; i < listElements.length; i++){
      listElements.item(i).classList.add("chat-active");
    }
  }

  public logout() {
    this.wss.logout();
  }
  public getListSearch() {
    this.res.isClickShowLeftContainer = false;
    return this.searchUserService.search(this.name);
  }
  public isCheckSearch() {
    return this.name.length != 0;
  }
  public isShowSearch() {
    return this.dataService.isShowSearch;
  }
  public checkUser(user: UserModel) {
    return this.wss.checkUser(user);
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
  public getListUser() {

    return this.dataService.getListUser();
  }
  public getUSERLOGIN() {
    return this.dataService.USERLOGIN;
  }
  public getChatContentExample() {
    return this.dataService.getChatContentExample();
  }



  public setSelectedChatContent(chatContent: ChatContent, index:number) {

    this.res.isClickShowLeftContainer = false;

    // this.userService.getAudio();
    this.dataService.isShowSearchMessage = false;
    this.dataService.selectedChatContent.messages?.forEach(f => {
      f.highlight = false;
    })
    console.log(this.getLastTime(chatContent));

    this.chatService.setSelectedChatContent(chatContent);
    this.selected(index);
  }
  public setSelectedChatContentByUserModel(usermodel: UserModel, index:number) {
    this.selected(index);
    this.res.isClickShowLeftContainer = false;
    this.checkUser(usermodel);
    this.dataService.isShowSearchMessage = false;
    this.dataService.selectedChatContent.messages?.forEach(f => {
      f.highlight = false;
    })
    this.chatService.setSelectedChatContentByUserModel(usermodel);

  }

  public goToBottom() {
    let bottomPoint = document.getElementById('chatContent') || document.body;
    bottomPoint.scrollTo(0, bottomPoint.scrollHeight);
  }

  public getStringLastMessage(chatContent: ChatContent): string {
    let messages = this.chatService.getLastMessage(chatContent);
    let rs = messages.message;
    if (messages.description=="NOTIFICATION") {
      return rs;
    }
    if (rs != 'Chưa có tin nhắn mới') {
      if (this.imageService.isImage(messages.message)) {
        if (messages.mine) {
          rs= 'Bạn đã gửi 1 ảnh';
        } else {
          rs = messages.userName + ' đã gửi 1 ảnh';
        }
      }else if (this.gifService.isGif(messages.message)) {
        if (messages.mine) {
          rs= 'Bạn đã gửi 1 gif';
        } else {
          rs = messages.userName + ' đã gửi 1 gif';
        }
      }else{
          if (messages.mine) {
            rs = 'Bạn: ' + messages.message;
          } else {
            if (chatContent.isGroup) {
              rs = messages.userName + ': ' + messages.message;
            } else {
              rs = messages.message;
            }
          }

        }
      }
      if(rs!=undefined&&rs.length>25) rs=rs.substring(0,25)+"...";
    return rs;
  }
  public getLastTime(chatContent: ChatContent) {
    let messages = this.chatService.getLastMessage(chatContent);
    // let mes = this.roomName.split(' ');
    let today = new Date();
    let thatday = new Date(messages.createAt);
    var dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //xét trường hợp năm nhuận
    if (today.getFullYear() % 400 == 0) {
      dayOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
      if (today.getFullYear() % 4 == 0) {
        dayOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      }
    }
    let rs: string = '';
    //chuyển ngày tháng năm giờ phút sang giây
    let distanceYear = today.getFullYear() - thatday.getFullYear();
    if (distanceYear <= 1) {
      let distanceMonth =
        distanceYear * 12 + today.getMonth() - thatday.getMonth();
      let distanceDate = today.getDate() - thatday.getDate();
      if (distanceMonth > 12) {
        rs = '1 năm';
      } else if (distanceMonth == 12) {
        if (distanceDate >= 0) {
          rs = '1 năm';
        } else {
          rs = '11 tháng';
        }
      } else {
        if (distanceMonth > 1) {
          if (distanceDate >= 0) {
            rs = distanceMonth + ' tháng';
          } else {
            rs = distanceMonth - 1 + ' tháng';
          }
        } else {
          if (distanceMonth==1) {
            if (distanceDate >= 0) {
              rs = distanceMonth + ' tháng';
            } else {
              rs = dayOfMonth[today.getMonth()]+distanceDate + ' ngày';
            }
          } else {
            let distanceHours = today.getHours() - thatday.getHours();
            if (distanceDate > 1) {
              if (distanceHours >= 0) {
                rs = distanceDate + ' ngày';
              } else{
                rs = distanceDate-1 + ' ngày';
              }
            }else{
              if (distanceDate==1) {
                if (distanceHours>=0) {
                  rs = '1 ngày';
                } else {
                  rs = 24+distanceHours+' giờ';
                }
              }else{
                let distanceMinutes = today.getMinutes() - thatday.getMinutes();
                if (distanceHours > 1) {
                  if (distanceMinutes>=0) {
                    rs =distanceHours+' giờ';
                  }else{
                    rs =distanceHours-1+' giờ';
                  }
                }else{
                  if (distanceHours == 1) {
                    if (distanceMinutes>=0) {
                      rs ='1 giờ';
                    }else{
                      rs =60+distanceMinutes+' phút';
                    }
                  }else{
                    if (distanceMinutes>0) {
                      rs =distanceMinutes+' phút';
                    }else{
                      rs =1+' phút';
                    }
                  }
                }
              }
            }
          }

        }
      }
    } else {
      let distanceMonth = today.getMonth() - thatday.getMonth();
      if (distanceMonth > 0) {
        rs = distanceYear + ' năm';
      } else if (distanceMonth == 0) {
        let distanceDate = today.getDate() - thatday.getDate();
        if (distanceDate >= 0) {
          rs = distanceYear + ' năm';
        } else {
          rs = distanceYear - 1 + ' năm';
        }
      } else rs = distanceYear - 1 + ' năm';
    }
    return rs;
  }
}
