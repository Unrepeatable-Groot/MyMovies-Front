import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss']
})
export class MediaDetailsComponent implements OnInit {

  media: any;
  relatedMedia: any[] = [];
  comments: any[] = [];
  showDeleteModal = false;
  type!: string;
  id!: number;
  newComment = '';
  editingCommentId: number | null = null;
  editingContent = '';
  commentError = '';

  isFavorite = false;
  currentReaction: number | null = null;
  likesCount = 0;
  dislikesCount = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type')!;
      this.id = +params.get('id')!;
      this.loadMedia();
    });
  }

  private getCategoryNumber(): number {
    switch(this.type) {
      case 'movies': return 0;
      case 'serials': return 1;
      case 'animations': return 2;
      default: return 0;
    }
  }

  loadMedia(): void {
    const headers = this.authService.isLoggedIn() ? this.getHeaders() : {};
    this.http.get<any>(`${environment.apiUrl}/movie/${this.id}`, { headers }).subscribe({
      next: data => {
        this.media = data;
        this.likesCount = data.likesCount;
        this.dislikesCount = data.dislikesCount;
        this.currentReaction = data.currentUserReaction;
        this.checkFavoriteFromApi();
        this.loadRelated();
        this.loadComments();
      },
      error: err => console.error(err)
    });
  }

  loadRelated(): void {
    this.http.get<any[]>(`${environment.apiUrl}/movie/random?category=${this.getCategoryNumber()}&excludeId=${this.id}`).subscribe({
      next: data => {
        this.relatedMedia = data;
      },
      error: err => console.error(err)
    });
  }

  loadComments(): void {
    this.http.get<any[]>(`${environment.apiUrl}/comment/${this.id}`).subscribe({
      next: data => {
        this.comments = data;
      },
      error: err => console.error(err)
    });
  }

  private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  get charCount(): number {
    return this.newComment.length;
  }

  submitComment(): void {
    if (!this.newComment.trim()) {
      this.commentError = 'Comment cannot be empty.';
      return;
    }
    if (this.newComment.length > 500) {
      this.commentError = 'Comment cannot exceed 500 characters.';
      return;
    }
    this.commentError = '';

    const dto = { content: this.newComment, movieId: this.id };
    this.http.post<any>(`${environment.apiUrl}/comment`, dto, {
      headers: this.getHeaders()
    }).subscribe({
      next: comment => {
        this.comments.unshift(comment);
        this.newComment = '';
      },
      error: err => console.error(err)
    });
  }

  startEdit(comment: any): void {
    this.editingCommentId = comment.id;
    this.editingContent = comment.content;
  }

  saveEdit(comment: any): void {
    if (!this.editingContent.trim()) return;

    const dto = { content: this.editingContent, movieId: this.id };
    this.http.put<any>(`${environment.apiUrl}/comment/${comment.id}`, dto, {
      headers: this.getHeaders()
    }).subscribe({
      next: updated => {
        comment.content = this.editingContent;
        this.editingCommentId = null;
      },
      error: err => console.error(err)
    });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editingContent = '';
  }

  deleteComment(commentId: number): void {
    this.http.delete(`${environment.apiUrl}/comment/${commentId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
      },
      error: err => console.error(err)
    });
  }

  canEdit(comment: any): boolean {
    const userId = this.authService.getCurrentUserId();
    return comment.userId === +userId!;
  }

  canDelete(comment: any): boolean {
    const userId = this.authService.getCurrentUserId();
    return comment.userId === +userId! || this.authService.isAdmin();
  }

  isAdminComment(comment: any): boolean {
    return comment.userRole === 1 || comment.userRole === 2;

  }
  checkFavoriteFromApi(): void {
    if (!this.authService.isLoggedIn()) return;
    const headers = this.getHeaders();
    this.http.get<any[]>(`${environment.apiUrl}/movie/favorites`, { headers }).subscribe({
      next: favorites => {
        this.isFavorite = favorites.some(f => f.id === this.id);
      },
      error: err => console.error(err)
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) return;
    const headers = this.getHeaders();

    if (this.isFavorite) {
      this.http.delete(`${environment.apiUrl}/movie/favorites/${this.id}`, { headers }).subscribe({
        next: () => this.isFavorite = false,
        error: err => console.error(err)
      });
    } else {
      this.http.post(`${environment.apiUrl}/movie/favorites/${this.id}`, {}, { headers }).subscribe({
        next: () => this.isFavorite = true,
        error: err => console.error(err)
      });
    }
  }

  react(type: number): void {
    if (!this.authService.isLoggedIn()) return;
    const headers = this.getHeaders();

    if (this.currentReaction === type) {
      this.http.delete(`${environment.apiUrl}/movie/reaction/${this.id}`, { headers }).subscribe({
        next: () => {
          if (type === 0) this.likesCount--;
          else this.dislikesCount--;
          this.currentReaction = null;
        },
        error: err => console.error(err)
      });
    } else {
      const dto = { movieId: this.id, type };
      this.http.post(`${environment.apiUrl}/movie/reaction`, dto, { headers }).subscribe({
        next: () => {
          if (this.currentReaction === 0) this.likesCount--;
          if (this.currentReaction === 1) this.dislikesCount--;
          this.currentReaction = type;
          if (type === 0) this.likesCount++;
          else this.dislikesCount++;
        },
        error: err => console.error(err)
      });
    }
  }

  scrollRelated(direction: 'left' | 'right'): void {
    const middle = document.querySelector('.inside .middle') as HTMLElement;
    const down = document.querySelector('.inside .down') as HTMLElement;

    if (!middle) return;
    const scrollAmount = direction === 'right' ? 555 : -555;
    middle.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    if (down) down.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  deleteMovie(): void {
    this.http.delete(`${environment.apiUrl}/movie/${this.id}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.router.navigate(['/']);
      },
      error: err => console.error(err)
    });
  }
}