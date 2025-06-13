import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../modules/user.model';
import { UserDTO } from '../modules/userDTO.model';


@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private apiUrl = 'https://rentcar.stepprojects.ge/api/Users'; 

  
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  
  public currentUser: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private tokenCheckInterval: any; 

  constructor(private http: HttpClient) {
    this.initUserFromStorage();
    this.startTokenValidityCheck(); 
  }

 
  private initUserFromStorage(): void {
    try {
      const savedUserString = localStorage.getItem('currentUser');
      
      if (
        savedUserString &&
        savedUserString !== 'undefined' &&
        savedUserString !== 'null'
      ) {
        const savedUser = JSON.parse(savedUserString);
        this.currentUserSubject.next(savedUser); 
        console.log('User loaded from storage:', !!savedUser);
      } else {
        console.log('No valid user data in storage');
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }

 
  register(user: UserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

 
  login(user: Partial<UserDTO>): Observable<any> {
    console.log('ავტორიზაციის მცდელობა:', user);

    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap({
        next: (response) => {
          console.log('API პასუხი:', response);

          
          if (response && response.token) {
            try {
             
              localStorage.setItem('token', response.token);

              
              if (response.user) {
               
                const fullUser = {
                  ...response.user,
                  token: response.token, 
                };

                const userJson = JSON.stringify(fullUser);
                localStorage.setItem('currentUser', userJson);
                this.currentUserSubject.next(fullUser);
                console.log(
                  'მომხმარებლის მონაცემები წარმატებით შენახულია:',
                  fullUser
                );
              } else {
                
                const minimalUser = {
                  phoneNumber: user.phoneNumber,
                  token: response.token,
                } as User;

                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(minimalUser)
                );
                this.currentUserSubject.next(minimalUser);
                console.log(
                  'შექმნილია მინიმალური მომხმარებლის პროფილი:',
                  minimalUser
                );

                
                this.fetchUserDetails().subscribe({
                  next: (userDetails) => {
                    console.log(
                      'მომხმარებლის დეტალები მიღებულია:',
                      userDetails
                    );
                  },
                  error: (err) => {
                    console.error(
                      'მომხმარებლის დეტალების მიღების შეცდომა:',
                      err
                    );
                  },
                });
              }
            } catch (error) {
              console.error('შეცდომა მონაცემების შენახვისას:', error);
             
              if (response.user) {
                this.currentUserSubject.next(response.user);
              }
            }
          } else {
            console.warn('ავტორიზაციის პასუხში არ არის token');
          }
        },
        error: (error) => {
          console.error('ავტორიზაციის მოთხოვნა წარუმატებელია:', error);
        },
      })
    );
  }

  
  fetchUserDetails(): Observable<User> {
  
    const token = localStorage.getItem('token');
    const currentUser = this.currentUserValue;

    
    if (!token || !currentUser?.phoneNumber) {
      return new Observable((observer) => {
        observer.error(
          'ტოკენი ან მომხმარებლის ტელეფონის ნომერი არ არის ხელმისაწვდომი'
        );
        observer.complete();
      });
    }

    
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    
    return this.http
      .get<User>(`${this.apiUrl}/${currentUser.phoneNumber}`, { headers })
      .pipe(
        tap({
          next: (userDetails) => {
            if (userDetails) {
             
              const enrichedUser: User = {
                ...userDetails,
                token: token,
              };

             
              localStorage.setItem('currentUser', JSON.stringify(enrichedUser));
              this.currentUserSubject.next(enrichedUser);

              console.log(
                'მომხმარებლის სრული მონაცემები განახლებულია:',
                enrichedUser
              );
            }
          },
          error: (error) => {
            console.error('მომხმარებლის დეტალების მიღების შეცდომა:', error);
            
          },
        })
      );
  }

 
  logout() {
    localStorage.removeItem('currentUser'); 
    localStorage.removeItem('token'); 
    this.currentUserSubject.next(null); 
    console.log('User logged out');
  }

 
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  
  isLoggedIn(): boolean {
    try {
      const hasToken = !!localStorage.getItem('token'); 
      const hasUser =
        !!this.currentUserValue || !!localStorage.getItem('currentUser'); 
      const isLoggedIn = hasToken && hasUser; 
      console.log(
        `Auth check: hasToken=${hasToken}, hasUser=${hasUser}, isLoggedIn=${isLoggedIn}`
      );
      return isLoggedIn;
    } catch (e) {
      console.error('Error checking login status:', e);
      return false;
    }
  }

  
  private startTokenValidityCheck(): void {
    
    this.tokenCheckInterval = setInterval(() => {
      this.checkAndUpdateAuthStatus();
    }, 30000);
  }

 
  private checkAndUpdateAuthStatus(): void {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
      
        console.log('No auth token found, logging out');
        this.logout();
        return;
      }

      
      if (this.isTokenExpired(token)) {
        console.log('Auth token expired, logging out');
        this.logout();
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
    }
  }

  
  private isTokenExpired(token: string): boolean {
    try {
      
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
       
        return false;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.exp) {
        
        return false;
      }

      
      return payload.exp * 1000 < Date.now();
    } catch (e) {
     
      return false;
    }
  }

  
  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}