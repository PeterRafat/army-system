import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" dir="rtl">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-shield-check"></i> نظام الأفراد العسكري
        </a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/search" 
                routerLinkActive="active"
              >
                بحث عن الجنود
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/recommendations" 
                routerLinkActive="active"
              >
                التوصيات
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.25rem;
    }
    
    .nav-link {
      font-weight: 500;
      margin: 0 0.5rem;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  `]
})
export class NavbarComponent {}
