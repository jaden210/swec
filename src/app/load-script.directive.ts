import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

declare var calendar: any;

@Directive({
  selector: '[appLoadScript]'
})
export class LoadScriptDirective implements OnInit, OnDestroy {
  private script: HTMLScriptElement;
  private link: HTMLLinkElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.loadScript();
  }

  loadScript() {
    // Create link element for CSS
    this.link = this.renderer.createElement('link');
    this.renderer.setAttribute(this.link, 'href', 'https://calendar.google.com/calendar/scheduling-button-script.css');
    this.renderer.setAttribute(this.link, 'rel', 'stylesheet');
    this.renderer.appendChild(document.head, this.link);

    // Create script element
    this.script = this.renderer.createElement('script');
    this.renderer.setAttribute(this.script, 'src', 'https://calendar.google.com/calendar/scheduling-button-script.js');
    this.renderer.setAttribute(this.script, 'async', '');
    this.renderer.appendChild(document.body, this.script);

    // Initialize the button once the script is loaded
    this.script.onload = () => {
      var target = this.el.nativeElement;
      window.addEventListener('load', function() {
        calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Cy1OH8ugMFhwage47Df2-Fv5eGPs59AmDaLaG-7CCyv5gRJtSSy2rjMyFm_QCA44D58P86_XY?gv=true',
          color: '#212121',
          label: 'Book an appointment',
          target,
        });
      });
    };
  }

  ngOnDestroy() {
    // Remove the script and link from the DOM
    if (this.script) {
      this.renderer.removeChild(document.body, this.script);
    }
    if (this.link) {
      this.renderer.removeChild(document.head, this.link);
    }
  }
}
