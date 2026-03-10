import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { Recommendation, Soldier } from '../../models/soldier.model';

interface RecommendationWithSoldier extends Recommendation {
  soldier_name?: string;
  soldier_police_number?: string;
  soldier_governorate?: string;
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4" dir="rtl">
      <div class="row mb-4">
        <div class="col-12">
          <h3><i class="bi bi-file-text"></i> كل التوصيات</h3>
        </div>
      </div>

      <!-- Search Section -->
      <div class="row mb-4">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3"><i class="bi bi-search"></i> بحث في التوصيات</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">اسم الجندي</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="أدخل اسم الجندي..."
                    [(ngModel)]="searchName"
                    (keyup.enter)="filterRecommendations()"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">رقم الشرطة</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="أدخل رقم الشرطة..."
                    [(ngModel)]="searchPoliceNumber"
                    (keyup.enter)="filterRecommendations()"
                  >
                </div>
              </div>
              <div class="mt-3 d-flex gap-2">
                <button class="btn btn-primary" (click)="filterRecommendations()">
                  <i class="bi bi-search"></i> بحث
                </button>
                <button class="btn btn-outline-secondary" (click)="clearSearch()">
                  <i class="bi bi-x-circle"></i> مسح
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="alert alert-info text-center">
          <div class="spinner-border spinner-border-sm ms-2" role="status">
            <span class="visually-hidden">جاري التحميل...</span>
          </div>
          جاري تحميل التوصيات...
        </div>
      }

      @if (error) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle"></i> {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      }

      @if (filteredRecommendations.length === 0 && !loading) {
        <div class="alert alert-warning text-center">
          <i class="bi bi-inbox"></i> لم يتم العثور على توصيات تطابق بحثك.
        </div>
      }

      <!-- Add Recommendation Button -->
      <div class="row mb-3">
        <div class="col-12 text-end">
          <button class="btn btn-success btn-lg" (click)="showAddForm = true">
            <i class="bi bi-plus-circle"></i> إضافة توصية جديدة
          </button>
        </div>
      </div>

      @if (filteredRecommendations.length > 0) {
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead class="table-primary">
                  <tr>
                    <th>اسم الجندي</th>
                    <th>رقم الشرطة</th>
                    <th>المحافظة</th>
                    <th>الوحدة المستهدفة</th>
                    <th>توصية من</th>
                    <th>التاريخ</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rec of filteredRecommendations; track rec.id) {
                    <tr>
                      <td>{{ rec.soldier_name || 'غير معروف' }}</td>
                      <td>{{ rec.soldier_police_number || 'غير متاح' }}</td>
                      <td>{{ rec.soldier_governorate || '-' }}</td>
                      <td>{{ rec.target_unit }}</td>
                      <td>{{ rec.recommended_by }}</td>
                      <td>{{ rec.created_at | date:'mediumDate' }}</td>
                      <td>
                        <button
                          class="btn btn-danger btn-sm" 
                          (click)="deleteRecommendation(rec.id)"
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
          </div>
        </div>
      }

      <!-- Add Recommendation Form Modal -->
      @if (showAddForm) {
        <div class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header bg-success text-white">
                <h5 class="modal-title"><i class="bi bi-file-earmark-plus"></i> إضافة توصية جديدة</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeAddForm()"></button>
              </div>
              <div class="modal-body">
                <form (ngSubmit)="submitRecommendation()">
                  <!-- Soldier Search -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">بحث عن الجندي</label>
                    <div class="row g-2">
                      <div class="col-md-8">
                        <input 
                          type="text" 
                          class="form-control form-control-lg" 
                          placeholder="اكتب اسم الجندي أو رقم الشرطة للبحث..."
                          [(ngModel)]="soldierSearchQuery"
                          name="soldierSearchQuery"
                          (ngModelChange)="searchSoldiersForRecommendation()"
                        >
                      </div>
                      <div class="col-md-4">
                        <button type="button" class="btn btn-primary btn-lg w-100" (click)="searchSoldiersForRecommendation()">
                          <i class="bi bi-search"></i> بحث
                        </button>
                      </div>
                    </div>
                    <small class="text-muted">ابحث بالاسم أو رقم الشرطة</small>
                  </div>

                  <!-- Soldiers List -->
                  @if (soldierSearchResults.length > 0) {
                    <div class="mb-4">
                      <label class="form-label fw-bold">اختر الجندي</label>
                      <div class="list-group">
                        @for (soldier of soldierSearchResults; track soldier.id) {
                          <button
                            type="button" 
                            class="list-group-item list-group-item-action"
                            [class.active]="newRecommendation.soldier_id === soldier.id"
                            (click)="selectSoldier(soldier)"
                          >
                            <div class="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{{ soldier.name }}</strong>
                                <br>
                                <small>رقم الشرطة: {{ soldier.police_number }}</small>
                              </div>
                              <i class="bi bi-check-circle-fill" *ngIf="newRecommendation.soldier_id === soldier.id"></i>
                            </div>
                          </button>
                        }
                      </div>
                    </div>
                  }

                  <!-- Selected Soldier Info -->
                  @if (selectedSoldier) {
                    <div class="alert alert-info mb-4">
                      <h6 class="fw-bold"><i class="bi bi-person-check"></i> الجندي المختار:</h6>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <strong>الاسم:</strong> {{ selectedSoldier.name }}
                        </div>
                        <div class="col-md-6">
                          <strong>رقم الشرطة:</strong> {{ selectedSoldier.police_number }}
                        </div>
                        <div class="col-md-6">
                          <strong>المحافظة:</strong> {{ selectedSoldier.governorate }}
                        </div>
                        <div class="col-md-6">
                          <strong>الوحدة الحالية:</strong> {{ selectedSoldier.current_unit }}
                        </div>
                      </div>
                    </div>
                  }

                  <!-- Recommendation Details -->
                  <div class="mb-3">
                    <label class="form-label">الوحدة المستهدفة</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [(ngModel)]="newRecommendation.target_unit"
                      name="target_unit"
                      placeholder="أدخل الوحدة المستهدفة (مثال: قسم الامن)"
                     required
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">توصية من</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      [(ngModel)]="newRecommendation.recommended_by"
                      name="recommended_by"
                      placeholder="أدخل اسم الضابط الذي يوصي (مثال: المقدم فلان الفلانى)"
                     required
                    >
                  </div>

                  <div class="d-flex gap-2 justify-content-end mt-4">
                    <button type="submit" class="btn btn-success btn-lg">
                      <i class="bi bi-check-circle"></i> إرسال التوصية
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-lg" (click)="closeAddForm()">
                      <i class="bi bi-x-circle"></i> إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show"></div>
      }
    </div>
  `,
  styles: [`
    .table {
      margin-bottom: 0;
    }
    
    th {
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    
    td {
      vertical-align: middle;
      font-size: 0.9rem;
    }
    
    .card {
      border: none;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  recommendations: RecommendationWithSoldier[] = [];
  filteredRecommendations: RecommendationWithSoldier[] = [];
  loading = false;
  error: string | null = null;
  searchName = '';
  searchPoliceNumber = '';
  
  // Add recommendation form properties
  showAddForm = false;
  soldierSearchQuery = '';
  soldierSearchResults: Soldier[] = [];
  selectedSoldier: Soldier | null = null;
  
  newRecommendation = {
    soldier_id: '',
    target_unit: '',
  recommended_by: '',
  recommended_to: ''
  };

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
   this.loadRecommendations();
  }

  private async loadRecommendations() {
    this.loading = true;
    this.error = null;

    try {
      const recs = await this.supabaseService.getAllRecommendations();
      
      // Fetch soldier details for each recommendation
      this.recommendations = await Promise.all(
        recs.map(async (rec) => {
          const soldier = await this.supabaseService.getSoldierById(rec.soldier_id);
          return {
            ...rec,
            soldier_name: soldier?.name || 'Unknown',
            soldier_police_number: soldier?.police_number || 'N/A',
            soldier_governorate: soldier?.governorate || '-'
          };
        })
      );
      
      this.filteredRecommendations = this.recommendations;
    } catch (err) {
      this.error = 'Failed to load recommendations. Please try again.';
      console.error('Error loading recommendations:', err);
    } finally {
      this.loading = false;
    }
  }

  filterRecommendations() {
    const normalizedName = this.supabaseService.normalizeArabic(this.searchName.toLowerCase());
    const normalizedPoliceNumber = this.searchPoliceNumber.toLowerCase();

    this.filteredRecommendations = this.recommendations.filter(rec => {
      const matchName = !this.searchName || 
        this.supabaseService.normalizeArabic((rec.soldier_name || '').toLowerCase()).includes(normalizedName);
      
      const matchPoliceNumber = !this.searchPoliceNumber || 
        (rec.soldier_police_number || '').toLowerCase().includes(normalizedPoliceNumber);
      
      return matchName && matchPoliceNumber;
    });
  }

  clearSearch() {
    this.searchName = '';
    this.searchPoliceNumber = '';
    this.filteredRecommendations = this.recommendations;
  }

  async deleteRecommendation(recommendationId: string) {
   if (confirm('هل أنت متأكد أنك تريد حذف هذه التوصية؟')) {
     try {
       await this.supabaseService.deleteRecommendation(recommendationId);
       
      this.recommendations = this.recommendations.filter(rec => rec.id !== recommendationId);
      this.filteredRecommendations = this.filteredRecommendations.filter(rec => rec.id !== recommendationId);
      } catch (err) {
      this.error = 'فشل حذف التوصية. يرجى المحاولة مرة أخرى.';
       console.error('Error deleting recommendation:', err);
      }
    }
  }

  async searchSoldiersForRecommendation() {
   if (!this.soldierSearchQuery.trim()) {
    this.soldierSearchResults = [];
   return;
    }

   const query = this.soldierSearchQuery.trim();
   const normalizedQuery = this.supabaseService.normalizeArabic(query.toLowerCase());
  this.soldierSearchResults = await this.supabaseService.searchSoldiers(normalizedQuery);
  }

  selectSoldier(soldier: Soldier) {
  this.selectedSoldier = soldier;
  this.newRecommendation.soldier_id = soldier.id;
  }

  closeAddForm() {
  this.showAddForm = false;
  this.soldierSearchQuery = '';
  this.soldierSearchResults = [];
  this.selectedSoldier= null;
  this.newRecommendation = {
     soldier_id: '',
     target_unit: '',
    recommended_by: '',
    recommended_to: ''
    };
  }

  async submitRecommendation() {
   if (!this.selectedSoldier) {
    this.error = 'يرجى اختيار جندي أولاً';
   return;
    }

   if (!this.newRecommendation.target_unit || !this.newRecommendation.recommended_by) {
    this.error = 'يرجى ملء جميع الحقول المطلوبة.';
   return;
    }

  this.loading = true;
  this.error = null;

    try {
     const result = await this.supabaseService.addRecommendation(this.newRecommendation);
     if (result) {
      this.closeAddForm();
       await this.loadRecommendations();
       alert('تم إضافة التوصية بنجاح!');
      } else {
      this.error = 'فشل إضافة التوصية. يرجى المحاولة مرة أخرى.';
      }
    } catch(err) {
    this.error = 'حدث خطأ. يرجى المحاولة مرة أخرى.';
    } finally {
    this.loading = false;
    }
  }
}
