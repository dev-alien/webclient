import {Component, OnInit} from "@angular/core";
import {ViewChild, ElementRef} from "@angular/core";

declare var draggable_window: any;

@Component({
    selector: 'status-window',
    templateUrl: './app/status_window.component.html',
    styleUrls: ['./app/status_window.component.css']
})
export class StatusWindowComponent {
    @ViewChild('mainBlock') mainBlock: ElementRef;
    private isShown: boolean = false;
    private status: string = "";
    private caption: string = "";
    constructor() {

    }

    public setPosition(x: number, y: number) {
        this.mainBlock.nativeElement.style.left = x + 'px';
        this.mainBlock.nativeElement.style.top = y + 'px';
    }

    public setCaption(caption: string): void {
        this.caption = caption;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public show(): void {
        this.isShown = true;
        draggable_window.showIt(this.mainBlock.nativeElement);
        var elWidth = parseInt(window.getComputedStyle(this.mainBlock.nativeElement).width, 10);
        var elHeight = 100;

        var docWidth = document.documentElement.clientWidth;
        var docHeight = window.innerHeight;
        var x = (docWidth/2 - elWidth/2);
        var y = (docHeight/2 - elHeight/2);

        this.mainBlock.nativeElement.style.left =
            x+"px";
        this.mainBlock.nativeElement.style.top =
            y+"px";
    }

    public close(): void {
        this.isShown = false;
    }
}