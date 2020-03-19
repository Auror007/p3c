import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginotpPage } from './loginotp.page';

describe('LoginotpPage', () => {
  let component: LoginotpPage;
  let fixture: ComponentFixture<LoginotpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginotpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginotpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
