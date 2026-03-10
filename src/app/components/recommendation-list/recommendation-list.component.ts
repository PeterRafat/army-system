import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Recommendation } from '../../models/soldier.model';

@Component({
  selector: 'app-recommendation-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="card shadow-sm">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0"><i class="bi bi-file-text"></i> التوصيات</h5>
      </div>
      <div class="card-body">
        @if (recommendations.length === 0) {
          <div class="alert alert-info mb-0">
            <i class="bi bi-info-circle"></i> لم يتم العثور على توصيات لهذا الجندي.
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-light">
                <tr>
                  <th>الوحدة المستهدفة</th>
                  <th>توصية من</th>
                  <th>التاريخ</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                @for (rec of recommendations; track rec.id) {
                  <tr>
                    <td>{{ rec.target_unit }}</td>
                    <td>{{ rec.recommended_by }}</td>
                    <td>{{ rec.created_at | date:'mediumDate' }}</td>
                    <td>
                      <button 
                       class="btn btn-danger btn-sm" 
                        (click)="deleteRecommendation.emit(rec.id)"
                       title="حذف التوصية"
                      >
                        <i class="bi bi-trash"></i> حذف
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .table {
      margin-bottom: 0;
    }
    
    th {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    td {
      vertical-align: middle;
      font-size: 0.9rem;
    }
    .btn {
      white-space: nowrap;
    }
  `]
})
export class RecommendationListComponent {
  @Input() recommendations: Recommendation[] = [];
  @Output() deleteRecommendation = new EventEmitter<string>();
}
