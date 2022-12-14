import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EmojisModel } from 'src/app/model/emojisModel';
import { GroupChat } from 'src/app/model/GroupChat';
import { UserModel } from 'src/app/model/userModel';
import { ChatService } from 'src/app/service/chat.service';
import { DataService } from 'src/app/service/data.service';
import emojis from "../../.././data/emojis.json";
import Callback = JQuery.Deferred.Callback;
import {ResponsiveService} from "../../../service/responsive.service";
import { ImageService } from 'src/app/service/image.service';
import {GifService} from "../../../service/gif.service";

declare var $: any;

@Component({
  selector: 'app-right-typing',
  templateUrl: './right-typing.component.html',
  styleUrls: ['./right-typing.component.scss'],
})
export class RightTypingComponent implements OnInit,AfterViewInit {
  @Input() selectedUser: UserModel = {};
  selectedGroup: GroupChat = {};
  selectedEmoji: EmojisModel = {};
  checkEmojisShow: boolean = false;
  checkGifShow: boolean = false;
  background: string = 'black';
  backgroundInput:string="#222323"
  emojisList: {
    emoji?: string;
    name?: string;
    shortname?: string;
    unicode?: string;
    html?: string;
    category?: string;
    order?: string;
  }[] = emojis;



  // emojisList: {
  //   [key: string]: {
  //       unicode: string[];
  //       fname: string;
  //       uc: string;
  //       isCanonical: boolean;
  //   }
  // }= emojione.emojioneList;

   message: string = '';

  constructor(
    private dataService: DataService,
    private chatService: ChatService,
    private imageService: ImageService,
    private res : ResponsiveService,
    private gif : GifService
  ) {}
  ngAfterViewInit(): void {

  }

  public showGif(){
    return this.gif.isShowGif;
  }

  public sendImage(event:any){
    this.imageService.sendImage(event);
  }
  public darkMode() {
    return this.dataService.isDarkMode;
  }
  ngOnInit(): void {
    this.dataService.selectedEmoji$.subscribe(
      (value) => (this.selectedEmoji = value)
    );

    }


    public isShowTypingMobile(){
    return this.res.isMobileRes(564);
    }

  checkShowManager(){
    return this.dataService.isShowManager;
  }

  public gifClick(){
    this.gif.isShowGif = !this.gif.isShowGif;
  }
  public isChatBoxSelected() {
    return this.chatService.isChatBoxSelected();
  }
  public selectEmoji(emojis: EmojisModel) {
    this.dataService.selectedEmoji$.next({});
    this.selectedEmoji = emojis;
    console.log(this.selectEmoji);
    this.message = this.message + this.selectedEmoji.emoji;
  }
  public showEmoji() {
    let m=$("#moji").val();

    $("#emotions").emojioneArea({
      pickerPosition: "top",
      toneStyle:"bullet",
      events: {
        emojibtn_click: function (button, event) {
          console.log('event:emojibtn.click, emoji=' + button.data("name"));
          m+=button.data("name");
        },
        keydown: function (button, event) {


          // console.log('event:'+event.+', emoji=' + button.data("name"));
          m+=event.key;
        }
   }


    });

    let el = $("#emotions").emojioneArea();
    let message  = $("#emotions").val();

  }

  public sendTo() {
    // let message  = $("#emotions").val();

    // this.message=message;
    // console.log(this.message);
    this.chatService.sendTo(this.message);
    this.message = '';
  }


}
