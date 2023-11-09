import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Option } from "../option.model";


@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {

//   @Input() theme: Option;
//   @Input() options: Array<Option>;
//   @Output() themeChange: EventEmitter<Option> = new EventEmitter<Option>();

//   ngOnChanges() {
//     console.log(this.theme);
//   }

//   changeTheme(themeToSet: Option) {
//     this.themeChange.emit(themeToSet);
//   }
}
