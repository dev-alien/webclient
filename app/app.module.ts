import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser'
import { FormsModule }   from '@angular/forms';

import {HeaderComponent} from "./header.component";

import {AppComponent} from './app.component'
import {SignUpComponent} from "./sign_up.component";
import { Ng2GoogleRecaptchaModule }  from 'ng2-google-recaptcha';
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";

import {MdCardModule} from "@angular2-material/card";
import {MdButtonModule} from "@angular2-material/button";
import {MdIconModule} from "@angular2-material/icon";
import {MdIconRegistry} from "@angular2-material/icon";
import {SignInComponent} from "./sign_in.component";
import {StatusWindowComponent} from "./status_window.component";
import {ContactsComponent} from "./contacts.component";
import {KeysPipe} from "./keys.pipe";
import {AddContactComponent} from "./contact_add.component";
import {ConversationsComponent} from "./conversations.component";
import {ConversationComponent} from "./conversation.component";
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';
import {MessageComponent} from "./message.component";
import {UserInfoLink} from "./user_info_link.component";
import {CreateConversationComponent} from "./create_conversation.component";
import {UsersSelectionBox} from "./users_selection_box.component";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        Ng2GoogleRecaptchaModule,
        MdCardModule,
        MdButtonModule,
        MdIconModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        SignUpComponent,
        SignInComponent,
        StatusWindowComponent,
        ReCaptchaBlockComponent,
        ContactsComponent,
        AddContactComponent,
        ConversationsComponent,
        ConversationComponent,
        MessageComponent,
        UserInfoLink,
        CreateConversationComponent,
        UsersSelectionBox,
        KeysPipe
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

}