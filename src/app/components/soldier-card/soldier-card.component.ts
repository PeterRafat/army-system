import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Soldier } from '../../models/soldier.model';

@Component({
  selector: 'app-soldier-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="card soldier-card h-100 shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0"><i class="bi bi-person-badge"></i> {{ soldier.name }}</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <p class="mb-1"><strong>الرقم المسلسل:</strong></p>
            <p class="text-muted">{{ soldier.serial_number }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1"><strong>رقم الشرطة:</strong></p>
            <p class="text-muted">{{ soldier.police_number }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1"><strong>المحافظة:</strong></p>
            <p class="text-muted">{{ soldier.governorate }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1"><strong>المؤهل:</strong></p>
            <p class="text-muted">{{ soldier.qualification }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1"><strong>الوحدة الحالية:</strong></p>
            <p class="text-muted">{{ soldier.current_unit }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1"><strong>الدفعة:</strong></p>
            <p class="text-muted">{{ soldier.batch }}</p>
          </div>
          <div class="col-md-12">
            <p class="mb-1"><strong>تاريخ التعيين:</strong></p>
            <p class="text-muted">{{ soldier.assigned_date | date:'mediumDate' }}</p>
          </div>
        </div>
      </div>
      <div class="card-footer bg-light">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .soldier-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
    }
    
    .soldier-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    
    .card-header {
      font-weight: 600;
    }
    
    p {
      font-size: 0.9rem;
      margin-bottom: 0.25rem !important;
    }
  `]
})
export class SoldierCardComponent {
  @Input() soldier!: Soldier;
}
