import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmenityService } from '../../service/amenity.service';
import { AuthService } from '../../service/auth.service';
import { Amenity } from '../../models';

@Component({
  selector: 'app-admin-amenities',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-amenities.component.html',
  styleUrl: './admin-amenities.component.css',
})
export class AdminAmenitiesComponent implements OnInit {
  amenities: Amenity[] = [];
  loading = true;
  isMenuOpen = false;

  success = '';
  error = '';

  
  showCreateForm = false;
  newName = '';
  creating = false;

  
  editingId: number | null = null;
  editName = '';
  updating = false;

  constructor(
    private amenityService: AmenityService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.amenityService.getAmenities().subscribe({
      next: (data) => {
        this.amenities = data.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load amenities.';
        this.loading = false;
      },
    });
  }


  submitCreate(): void {
    const name = this.newName.trim();
    if (!name) { this.error = 'Name cannot be empty.'; return; }

    this.creating = true;
    this.success = '';
    this.error = '';

    this.amenityService.createAmenity({ name }).subscribe({
      next: (created) => {
        this.amenities = [...this.amenities, created].sort((a, b) => a.name.localeCompare(b.name));
        this.newName = '';
        this.showCreateForm = false;
        this.creating = false;
        this.success = `Amenity "${created.name}" created successfully.`;
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to create amenity.';
        this.creating = false;
        setTimeout(() => (this.error = ''), 4000);
      },
    });
  }

  cancelCreate(): void {
    this.newName = '';
    this.showCreateForm = false;
  }


  startEdit(amenity: Amenity): void {
    this.editingId = amenity.amenityID;
    this.editName = amenity.name;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editName = '';
  }

  submitUpdate(id: number): void {
    const name = this.editName.trim();
    if (!name) { this.error = 'Name cannot be empty.'; return; }

    this.updating = true;
    this.success = '';
    this.error = '';

    this.amenityService.updateAmenity(id, { name }).subscribe({
      next: (updated) => {
        const idx = this.amenities.findIndex(a => a.amenityID === id);
        if (idx !== -1) this.amenities[idx] = updated;
        this.amenities = [...this.amenities].sort((a, b) => a.name.localeCompare(b.name));
        this.editingId = null;
        this.updating = false;
        this.success = `Amenity updated to "${updated.name}".`;
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to update amenity.';
        this.updating = false;
        setTimeout(() => (this.error = ''), 4000);
      },
    });
  }

  deleteAmenity(amenity: Amenity): void {
    if (!confirm(`Delete amenity "${amenity.name}"? This will remove it from all associated rooms.`)) return;

    this.success = '';
    this.error = '';

    this.amenityService.deleteAmenity(amenity.amenityID).subscribe({
      next: () => {
        this.amenities = this.amenities.filter(a => a.amenityID !== amenity.amenityID);
        this.success = `Amenity "${amenity.name}" deleted.`;
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to delete amenity.';
        setTimeout(() => (this.error = ''), 4000);
      },
    });
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }

  logout(event?: Event): void {
    event?.preventDefault();
    this.authService.logout();
  }

  get username(): string {
    return this.authService.currentUser?.username ?? 'Admin';
  }
}