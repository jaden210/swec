import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material/material.module";
import { DemoWheelComponent } from "../demo-wheel/demo-wheel.component";
import { InfoDialog } from "./info-dialog/info-dialog.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FooterComponent } from "../footer/footer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    DragDropModule
  ],
  declarations: [DemoWheelComponent, InfoDialog, ToolbarComponent, FooterComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DemoWheelComponent,
    InfoDialog,
    ToolbarComponent,
    FooterComponent,
    DragDropModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
