import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchQuery: string = '';
  profileImage: string | null = null;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.profileImage$.subscribe(img => {
      this.profileImage = img;
    });
    if (this.authService.isLoggedIn()) {
      this.authService.loadCurrentUserImage();
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }
}