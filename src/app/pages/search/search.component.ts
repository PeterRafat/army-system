import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { Soldier, Recommendation } from '../../models/soldier.model';
import { SoldierCardComponent } from '../../components/soldier-card/soldier-card.component';
import { RecommendationListComponent } from '../../components/recommendation-list/recommendation-list.component';

interface SoldierWithLatestRecommendation extends Soldier {
  latest_target_unit?: string;
 recommendation_count?: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
 imports: [CommonModule, FormsModule, SoldierCardComponent, RecommendationListComponent],
  template: `
    <div class="container py-4" dir="rtl">
      <div class="row mb-4">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <h4 class="card-title mb-3"><i class="bi bi-search"></i> بحث عن الجنود</h4>
              <p class="text-muted mb-3">ابحث باسم الجندي أو رقم الشرطة (يمكنك استخدام كلا الفلترين)</p>
              <div class="alert alert-warning mb-3" *ngIf="nameError || policeError">
                <i class="bi bi-exclamation-triangle"></i>
                {{ nameError || policeError }}
              </div>
              
              <!-- Advanced Filter Mode Indicator -->
              <div class="alert alert-info mb-3" *ngIf="advancedFilterMode">
                <i class="bi bi-lightning-fill"></i>
                <strong>وضع الفلتر المتقدم نشط!</strong>
                - ابحث باستخدام نمط %حرف% (مثال: %ب%ي%ت% سيجد: بيت محمد، بيبو تامر، إلخ)
              </div>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">اسم الجندي</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      [(ngModel)]="searchName"
                      (ngModelChange)="validateNameInput()"
                      placeholder="مثال:   فلان الفلاني فلان"
                      title="اضغط على الزر لتفعيل الفلتر المتقدم (%حرف%نمط%)"
                    >
                    <button 
                      class="btn btn-outline-primary" 
                      type="button"
                      (click)="toggleAdvancedFilter()"
                      [class.active]="advancedFilterMode"
                      title="تفعيل/إلغاء الفلتر المتقدم"
                    >
                      <i class="bi" [class.bi-lightning-fill]="advancedFilterMode" [class.bi-lightning]="!advancedFilterMode"></i>
                      {{ advancedFilterMode ? 'متقدم' : 'عادي' }}
                    </button>
                  </div>
                  <small class="text-muted">
                    <i class="bi bi-info-circle"></i>
                    عند التفعيل: سيتم إزالة المسافات وتحويل الاسم لنمط %حرف%حرف%
                  </small>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">رقم الشرطة</label>
                  <input 
                    type="text" 
                   class="form-control form-control-lg" 
                    placeholder="أدخل رقم الشرطة (مثال: POL-2024-001)..."
                    [(ngModel)]="searchPoliceNumber"
                    (ngModelChange)="validatePoliceInput()"
                    (keyup.enter)="search()"
                    #policeInput
                  >
                  <small class="text-muted">أرقام وحروف إنجليزية فقط</small>
                </div>
              </div>
              <div class="mt-4 d-flex gap-2 justify-content-center">
                <button 
                  class="btn btn-primary btn-lg px-4" 
                  type="button" 
                  (click)="search()"
                  [disabled]="!searchName.trim() && !searchPoliceNumber.trim()"
                >
                  <i class="bi bi-search"></i> بحث
                </button>
                <button 
                  class="btn btn-outline-secondary btn-lg px-4" 
                  type="button" 
                  (click)="clearSearch()"
                >
                  <i class="bi bi-x-circle"></i> مسح
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="alert alert-info text-center">
              <div class="spinner-border spinner-border-sm ms-2" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
              </div>
              جاري البحث عن الجنود...
            </div>
          </div>
        </div>
      }

      @if (error) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle"></i> {{ error }}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>
        </div>
      }

      <!-- All Soldiers Table -->
      @if (!selectedSoldier && !loading) {
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-people"></i> جميع الجنود</h5>
            <span class="badge bg-light text-dark">{{ allSoldiers.length }} جندي</span>
          </div>
          <div class="card-body">
            <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
              <table class="table table-hover table-striped">
                <thead class="table-primary sticky-top">
                  <tr>
                    <th>الاسم</th>
                    <th>رقم الشرطة</th>
                    <th>المحافظة</th>
                    <th>المؤهل</th>
                    <th>الوحدة الحالية</th>
                    <th>عدد التوصيات</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  @for (soldier of allSoldiers; track soldier.id) {
                    <tr>
                      <td><strong>{{ soldier.name }}</strong></td>
                      <td>{{ soldier.police_number }}</td>
                      <td>{{ soldier.governorate }}</td>
                      <td>{{ soldier.qualification }}</td>
                      <td>
                        <span *ngIf="soldier.latest_target_unit" class="badge bg-success">
                          {{ soldier.latest_target_unit }}
                        </span>
                        <span *ngIf="!soldier.latest_target_unit" class="text-muted">
                          {{ soldier.current_unit }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-info text-dark">
                          {{ soldier.recommendation_count || 0 }}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn btn-primary btn-sm" 
                          (click)="selectSoldier(soldier)"
                          title="عرض التوصيات"
                        >
                          <i class="bi bi-eye"></i> عرض
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

      @if (selectedSoldier) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4><i class="bi bi-person-check"></i> الجندي المحدد</h4>
              <button class="btn btn-outline-secondary btn-sm" (click)="clearSelection()">
                <i class="bi bi-x-circle"></i> مسح التحديد
              </button>
            </div>
            <app-soldier-card [soldier]="selectedSoldier">
            </app-soldier-card>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <app-recommendation-list [recommendations]="selectedSoldierRecommendations" (deleteRecommendation)="handleDeleteRecommendation($event)"></app-recommendation-list>
          </div>
        </div>

        <!-- Add Recommendation Button Under Table -->
        <div class="row mb-4">
          <div class="col-12 text-center">
            <button class="btn btn-success btn-lg" (click)="showAddRecommendation = true">
              <i class="bi bi-plus-circle"></i> إضافة توصية
            </button>
          </div>
        </div>

        @if (showAddRecommendation) {
          <div class="row mb-4">
            <div class="col-md-8 offset-md-2">
              <div class="card shadow-sm border-success">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0"><i class="bi bi-file-earmark-plus"></i> إضافة توصية</h5>
                </div>
                <div class="card-body">
                  <form (ngSubmit)="submitRecommendation()">
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
                    <div class="d-flex gap-2">
                      <button type="submit" class="btn btn-success">
                        <i class="bi bi-check-circle"></i> إرسال التوصية
                      </button>
                      <button type="button" class="btn btn-outline-secondary" (click)="showAddRecommendation = false">
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        }
      }

      @if (results.length > 0 && !selectedSoldier) {
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-list-ul"></i> نتائج البحث</h5>
            <span class="badge bg-light text-dark">{{ results.length }} جندي</span>
          </div>
          <div class="card-body">
            
            <!-- Governorate Filter -->
            @if (availableGovernorates.length > 1) {
              <div class="row mb-3">
                <div class="col-md-6 offset-md-6">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-geo-alt"></i>
                    </span>
                    <select 
                      class="form-select" 
                      [(ngModel)]="governorateFilter"
                      (ngModelChange)="filteredResults"
                    >
                      <option value="">كل المحافظات</option>
                      @for(gov of availableGovernorates; track gov) {
                        <option [value]="gov">{{ gov }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>
            }

            <!-- Results Table -->
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead class="table-primary sticky-top">
                  <tr>
                    <th>الاسم</th>
                    <th>رقم الشرطة</th>
                    <th>المحافظة</th>
                    <th>المؤهل</th>
                    <th>الوحدة الحالية</th>
                    <th>عدد التوصيات</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  @for (soldier of filteredResults; track soldier.id) {
                    <tr>
                      <td><strong>{{ soldier.name }}</strong></td>
                      <td>{{ soldier.police_number }}</td>
                      <td>{{ soldier.governorate }}</td>
                      <td>{{ soldier.qualification }}</td>
                      <td>
                        <span *ngIf="soldier.latest_target_unit" class="badge bg-success">
                          {{ soldier.latest_target_unit }}
                        </span>
                        <span *ngIf="!soldier.latest_target_unit" class="text-muted">
                          {{ soldier.current_unit }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-info text-dark">
                          {{ soldier.recommendation_count || 0 }}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn btn-primary btn-sm" 
                          (click)="selectSoldier(soldier)"
                          title="عرض التوصيات"
                        >
                          <i class="bi bi-eye"></i> عرض
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

      @if (searched && results.length === 0 && !loading && !selectedSoldier) {
        <div class="row">
          <div class="col-12">
            <div class="alert alert-warning text-center">
              <i class="bi bi-inbox"></i> لم يتم العثور على جنود تطابق بحثك.
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .input-group {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .card {
      border: none;
    }
    
    button {
      cursor: pointer;
    }
  `]
})
export class SearchComponent {
  searchName = '';
  searchPoliceNumber= '';
  nameError = '';
  policeError = '';
 results: SoldierWithLatestRecommendation[] = [];
  allSoldiers: SoldierWithLatestRecommendation[] = []; // All soldiers for table display
  selectedSoldier: Soldier | null = null;
  selectedSoldierRecommendations: Recommendation[] = [];
  loading = false;
  error: string | null = null;
  searched = false;
  showAddRecommendation= false;
  advancedFilterMode = false; // Toggle mode with button
  governorateFilter = ''; // Filter by governorate in results

  newRecommendation = {
    soldier_id: '',
    target_unit: '',
 recommended_by: '',
 recommended_to: '' // Empty - field removed from UI but kept for DB compatibility
  };

  constructor(private supabaseService: SupabaseService) {
  this.loadAllSoldiers();
  }

  /**
   * Toggle advanced filter mode on/off
   */
  toggleAdvancedFilter() {
   this.advancedFilterMode = !this.advancedFilterMode;
    
   if (this.advancedFilterMode && this.searchName && this.searchName.trim().length > 0) {
      // Convert to pattern when enabling
     const trimmedName = this.searchName.trim();
      
      // Remove extra spaces and existing % signs
      // Split by spaces to get words, then join with %
     const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
      
     if (words.length > 0) {
        // Join words with % and add % at start and end
       const patternText = '%' + words.join('%') + '%';
       this.searchName = patternText;
        
        // Trigger search after conversion
        setTimeout(() => this.search(), 300);
      }
    } else if (!this.advancedFilterMode && this.searchName && this.searchName.includes('%')) {
      // Clean up pattern when disabling
     const cleanText = this.searchName.replace(/%/g, '').trim();
     this.searchName = cleanText;
      
      // Trigger search after cleanup
      setTimeout(() => this.search(), 300);
    }
  }

  validateNameInput() {
   const hasNumbers = /\d/.test(this.searchName);
   if (hasNumbers) {
     this.nameError = 'اسم الجندي يجب أن يحتوي على حروف فقط بدون أرقام';
     this.searchName = this.searchName.replace(/\d/g, '');
    } else {
     this.nameError = '';
    }
  }

  validatePoliceInput() {
   const isValid = /^[A-Za-z0-9\-]*$/.test(this.searchPoliceNumber);
   if (!isValid) {
     this.policeError = 'رقم الشرطة يجب أن يحتوي على أرقام وحروف إنجليزية فقط';
     this.searchPoliceNumber = this.searchPoliceNumber.replace(/[^A-Za-z0-9\-]/g, '');
    } else {
     this.policeError = '';
    }
  }

  async search() {
  this.loading = true;
  this.error = null;
  this.searched = true;
  this.governorateFilter = ''; // Reset governorate filter on new search

  try {
    if (this.searchName.trim()) {
      const searchQuery = this.searchName.trim();
      const normalizedName = this.supabaseService.normalizeArabic(searchQuery.toLowerCase());
       
       // Use advanced filter if CTRL is pressed, otherwise use normal search
     const allResults = await this.supabaseService.searchSoldiers(normalizedName, this.advancedFilterMode);
       
       // Filter by police number if provided
     this.results = allResults.filter(soldier => {
       const soldierNormalizedPolice = soldier.police_number.toLowerCase();
        
       const policeMatch = !this.searchPoliceNumber.trim() || 
                          soldierNormalizedPolice.includes(this.searchPoliceNumber.trim().toLowerCase());
        
       return policeMatch;
      });
      
    } else if (this.searchPoliceNumber.trim()) {
     const allResults = await this.supabaseService.getAllSoldiers();
     const searchPolice = this.searchPoliceNumber.trim().toLowerCase();
      
    this.results = allResults.filter(soldier => 
        soldier.police_number.toLowerCase().includes(searchPolice)
      );
    } else {
    this.results = [];
    }
    
   } catch (err) {
    this.error = 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.';
    console.error('Error searching:', err);
    } finally {
    this.loading = false;
    }
  }

  /**
   * Filter results by governorate
   */
  get filteredResults(): SoldierWithLatestRecommendation[] {
  if (!this.governorateFilter.trim()) {
     return this.results as SoldierWithLatestRecommendation[];
    }
    
  const normalizedGovernorate = this.supabaseService.normalizeArabic(this.governorateFilter.toLowerCase());
   return (this.results as SoldierWithLatestRecommendation[]).filter(soldier => {
   const soldierGovernorate = this.supabaseService.normalizeArabic(soldier.governorate.toLowerCase());
     return soldierGovernorate.includes(normalizedGovernorate);
    });
  }

  /**
   * Get unique governorates from results for dropdown
   */
  get availableGovernorates() {
  const governorates = this.results.map(soldier => soldier.governorate);
   return [...new Set(governorates)].sort();
  }

  async handleDeleteRecommendation(recommendationId: string) {
   if (confirm('هل أنت متأكد أنك تريد حذف هذه التوصية؟')) {
     try {
       // Delete from database
       const deleted = await this.supabaseService.deleteRecommendation(recommendationId);
       
      if (deleted) {
         // Remove from local array
       this.selectedSoldierRecommendations = this.selectedSoldierRecommendations.filter(
         rec => rec.id !== recommendationId
         );
       } else {
       this.error = 'فشل حذف التوصية. يرجى المحاولة مرة أخرى.';
       }
     } catch (err) {
     this.error = 'حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.';
       console.error('Error deleting recommendation:', err);
     }
    }
  }

  clearSearch() {
    this.searchName = '';
    this.searchPoliceNumber = '';
    this.results = [];
    this.selectedSoldier = null;
    this.searched = false;
  }

  selectSoldier(soldier: Soldier) {
    this.selectedSoldier = soldier;
    this.newRecommendation.soldier_id = soldier.id;
    this.loadRecommendations(soldier.id);
    this.showAddRecommendation = false;
  }

  clearSelection() {
    this.selectedSoldier = null;
    this.selectedSoldierRecommendations = [];
    this.showAddRecommendation = false;
  }

  private async loadAllSoldiers() {
    try {
      const soldiers = await this.supabaseService.getAllSoldiers();
      
      // Get latest recommendation and count for each soldier
   this.allSoldiers = await Promise.all(
       soldiers.map(async (soldier) => {
         const recommendations = await this.supabaseService.getRecommendationsBySoldierId(soldier.id);
         
       return {
           ...soldier,
           latest_target_unit: recommendations.length > 0 
             ? recommendations[0].target_unit  // Most recent first (already sorted by created_at DESC)
             : undefined,
          recommendation_count: recommendations.length
         };
        })
      );
    } catch (err) {
      console.error('Error loading all soldiers:', err);
    }
  }

  private async loadRecommendations(soldierId: string) {
    try {
      this.selectedSoldierRecommendations = await this.supabaseService.getRecommendationsBySoldierId(soldierId);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  }

  async submitRecommendation() {
   if (!this.newRecommendation.target_unit || 
       !this.newRecommendation.recommended_by) {
     this.error = 'يرجى ملء جميع الحقول المطلوبة.';
    return;
    }

   this.loading = true;
   this.error = null;

    try {
      const result = await this.supabaseService.addRecommendation(this.newRecommendation);
     if (result) {
       this.showAddRecommendation = false;
       this.newRecommendation = {
         soldier_id: this.selectedSoldier?.id || '',
         target_unit: '',
       recommended_by: '',
      recommended_to: '' // Reset to empty
       };
      if (this.selectedSoldier) {
        await this.loadRecommendations(this.selectedSoldier.id);
        }
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
