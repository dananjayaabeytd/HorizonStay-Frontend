import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Standalone component import
        RouterTestingModule, // Mock routing
        HttpClientTestingModule, // Mock HttpClient
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title set to "web-app"', () => {
    expect(component.title).toEqual('web-app');
  });

  it('should call `initFlowbite` during OnInit', () => {
    const initFlowbiteSpy = spyOn<any>(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(initFlowbiteSpy).toHaveBeenCalled();
  });

  it('should render the navigation bar', () => {
    const navElement = fixture.nativeElement.querySelector('app-nav');
    expect(navElement).toBeTruthy();
  });

  it('should render the router outlet', () => {
    const routerOutletElement = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutletElement).toBeTruthy();
  });

  it('should render the footer', () => {
    const footerElement = fixture.nativeElement.querySelector('app-footer');
    expect(footerElement).toBeTruthy();
  });
});
