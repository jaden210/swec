import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-demo-wheel",
  templateUrl: "./demo-wheel.component.html",
  styleUrls: ["./demo-wheel.component.scss"],
})
export class DemoWheelComponent implements OnInit {
  @Input() title: string;
  @Input() body: string;
  @Output() closed = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public close() {
    this.closed.emit(true);
  }
}
