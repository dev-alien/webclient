System.register(["@angular/core", '@angular/platform-browser', '@angular/forms', "./header.component", './app.component', "./sign_up.component", 'ng2-google-recaptcha', "./recaptcha_overlay.component", "@angular2-material/card", "@angular2-material/button", "@angular2-material/icon", "./sign_in.component", "./status_window.component", "./contacts.component", "./keys.pipe", "./contact_add.component", "./conversations.component", "./conversation.component", 'angular2-perfect-scrollbar', "./message.component", "./user_info_link.component", "./create_conversation.component", "./users_selection_box.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_1, forms_1, header_component_1, app_component_1, sign_up_component_1, ng2_google_recaptcha_1, recaptcha_overlay_component_1, card_1, button_1, icon_1, sign_in_component_1, status_window_component_1, contacts_component_1, keys_pipe_1, contact_add_component_1, conversations_component_1, conversation_component_1, angular2_perfect_scrollbar_1, message_component_1, user_info_link_component_1, create_conversation_component_1, users_selection_box_component_1;
    var PERFECT_SCROLLBAR_CONFIG, AppModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (header_component_1_1) {
                header_component_1 = header_component_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (sign_up_component_1_1) {
                sign_up_component_1 = sign_up_component_1_1;
            },
            function (ng2_google_recaptcha_1_1) {
                ng2_google_recaptcha_1 = ng2_google_recaptcha_1_1;
            },
            function (recaptcha_overlay_component_1_1) {
                recaptcha_overlay_component_1 = recaptcha_overlay_component_1_1;
            },
            function (card_1_1) {
                card_1 = card_1_1;
            },
            function (button_1_1) {
                button_1 = button_1_1;
            },
            function (icon_1_1) {
                icon_1 = icon_1_1;
            },
            function (sign_in_component_1_1) {
                sign_in_component_1 = sign_in_component_1_1;
            },
            function (status_window_component_1_1) {
                status_window_component_1 = status_window_component_1_1;
            },
            function (contacts_component_1_1) {
                contacts_component_1 = contacts_component_1_1;
            },
            function (keys_pipe_1_1) {
                keys_pipe_1 = keys_pipe_1_1;
            },
            function (contact_add_component_1_1) {
                contact_add_component_1 = contact_add_component_1_1;
            },
            function (conversations_component_1_1) {
                conversations_component_1 = conversations_component_1_1;
            },
            function (conversation_component_1_1) {
                conversation_component_1 = conversation_component_1_1;
            },
            function (angular2_perfect_scrollbar_1_1) {
                angular2_perfect_scrollbar_1 = angular2_perfect_scrollbar_1_1;
            },
            function (message_component_1_1) {
                message_component_1 = message_component_1_1;
            },
            function (user_info_link_component_1_1) {
                user_info_link_component_1 = user_info_link_component_1_1;
            },
            function (create_conversation_component_1_1) {
                create_conversation_component_1 = create_conversation_component_1_1;
            },
            function (users_selection_box_component_1_1) {
                users_selection_box_component_1 = users_selection_box_component_1_1;
            }],
        execute: function() {
            PERFECT_SCROLLBAR_CONFIG = {
                suppressScrollX: true
            };
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        imports: [
                            platform_browser_1.BrowserModule,
                            ng2_google_recaptcha_1.Ng2GoogleRecaptchaModule,
                            card_1.MdCardModule,
                            button_1.MdButtonModule,
                            icon_1.MdIconModule,
                            forms_1.FormsModule,
                            angular2_perfect_scrollbar_1.PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)
                        ],
                        declarations: [
                            app_component_1.AppComponent,
                            header_component_1.HeaderComponent,
                            sign_up_component_1.SignUpComponent,
                            sign_in_component_1.SignInComponent,
                            status_window_component_1.StatusWindowComponent,
                            recaptcha_overlay_component_1.ReCaptchaBlockComponent,
                            contacts_component_1.ContactsComponent,
                            contact_add_component_1.AddContactComponent,
                            conversations_component_1.ConversationsComponent,
                            conversation_component_1.ConversationComponent,
                            message_component_1.MessageComponent,
                            user_info_link_component_1.UserInfoLink,
                            create_conversation_component_1.CreateConversationComponent,
                            users_selection_box_component_1.UsersSelectionBox,
                            keys_pipe_1.KeysPipe
                        ],
                        bootstrap: [app_component_1.AppComponent],
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_1("AppModule", AppModule);
        }
    }
});
//# sourceMappingURL=app.module.js.map