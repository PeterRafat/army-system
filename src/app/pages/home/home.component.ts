import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5" dir="rtl">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="text-center mb-5">
            <h1 class="display-4 fw-bold text-primary">
              <i class="bi bi-shield-check"></i> نظام التوصيات للأفراد العسكريين
            </h1>
            <p class="lead text-muted mt-3">
              إدارة وتتبع توصيات الجنود بكفاءة - استبدال تصفية إكسل بقاعدة بيانات حديثة
            </p>
          </div>

          <div class="row g-4 mt-4">
            <div class="col-md-6">
              <div class="card h-100 shadow-sm border-primary">
                <div class="card-body text-center p-4">
                  <div class="display-1 text-primary mb-3">
                    <i class="bi bi-search"></i>
                  </div>
                  <h3 class="card-title h4 mb-3">بحث عن الجنود</h3>
                  <p class="card-text text-muted mb-4">
                    ابحث بسرعة عن الجنود بالاسم أو رقم الشرطة مع دعم متقدم لتطبيع النص العربي.
                  </p>
                  <ul class="list-unstyled text-end mx-auto" style="max-width: 300px;">
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> مطابقة جزئية للاسم</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> بحث برقم الشرطة</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> تطبيع النص العربي</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> عرض الملفات الكاملة</li>
                  </ul>
                  <a routerLink="/search" class="btn btn-primary btn-lg mt-3">
                    <i class="bi bi-search"></i> ابدأ البحث
                  </a>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card h-100 shadow-sm border-success">
                <div class="card-body text-center p-4">
                  <div class="display-1 text-success mb-3">
                    <i class="bi bi-file-earmark-plus"></i>
                  </div>
                  <h3 class="card-title h4 mb-3">إدارة التوصيات</h3>
                  <p class="card-text text-muted mb-4">
                    أضف وتتبع توصيات الجنود مع سجل تدقيق كامل وسجل تاريخي.
                  </p>
                  <ul class="list-unstyled text-end mx-auto" style="max-width: 300px;">
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> إضافة توصيات جديدة</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> عرض سجل التوصيات</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> تتبع جميع التغييرات</li>
                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success"></i> إمكانيات التصدير</li>
                  </ul>
                  <a routerLink="/recommendations" class="btn btn-success btn-lg mt-3">
                    <i class="bi bi-list-ul"></i> عرض كل التوصيات
                  </a>
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
    }
    
    .btn-lg {
      padding: 0.75rem 2rem;
      font-weight: 600;
    }
    
    h1 {
      font-size: 2.5rem;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class HomeComponent {}
