import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigateByUrl('/auth/login');
      }
      return isAuthenticated;
    })
  );
}
