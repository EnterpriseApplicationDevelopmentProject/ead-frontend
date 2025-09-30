# Customer Authentication Frontend

A clean, minimalist authentication system built with Next.js 15, TypeScript, and Tailwind CSS for customer login and registration with Spring Boot backend integration.

## Features

### 🔐 Authentication System
- **Simple Login Form** with email/password authentication
- **Customer Registration Form** with essential customer fields (name, email, phone, date of birth)
- **JWT Token Management** with secure storage
- **Google Sign-in Integration** ready for implementation
- **Auto-redirect** based on authentication status

### 🎨 User Interface
- **Clean Minimalist Design** with white background and bold typography
- **Full-screen Layout** with centered forms
- **Mobile-First Responsive Design** 
- **Dark Gray Color Scheme** with excellent contrast
- **Smooth Loading States** and clear error messages
- **Customer-Focused UX** with intuitive navigation

### 🛡️ Security Features
- **Input Validation** with Zod schemas
- **XSS Protection** through proper data sanitization
- **CSRF Protection** with secure cookies
- **Token Expiration** handling
- **Secure Storage** of authentication data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # Customer login page
│   ├── signup/            # Customer registration page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to login)
├── components/
│   └── auth/              # Authentication components
│       ├── LoginForm.tsx  # Clean login form with Google integration
│       └── SignUpForm.tsx # Customer registration form
├── context/
│   └── AuthContext.tsx    # Authentication state management
├── lib/
│   ├── api.ts            # API client and auth functions
│   ├── types.ts          # TypeScript definitions
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Form validation schemas
└── styles/               # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Spring Boot backend running on port 8080

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NODE_ENV=development
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## Spring Boot Backend Integration

### Required API Endpoints

Your Spring Boot backend should implement these endpoints:

#### Authentication Endpoints
```java
// POST /api/auth/login
@PostMapping("/auth/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    // Validate credentials and return JWT token
}

// POST /api/auth/signup
@PostMapping("/auth/signup")
public ResponseEntity<LoginResponse> signUp(@RequestBody SignUpRequest request) {
    // Create new user account and return JWT token
}

// POST /api/auth/logout
@PostMapping("/auth/logout") 
public ResponseEntity<Void> logout() {
    // Invalidate token
}

// POST /api/auth/refresh
@PostMapping("/auth/refresh")
public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshRequest request) {
    // Refresh JWT token
}

// GET /api/auth/me
@GetMapping("/auth/me")
public ResponseEntity<User> getCurrentUser() {
    // Return current user profile
}

// GET /api/auth/verify
@GetMapping("/auth/verify")
public ResponseEntity<Void> verifyToken() {
    // Verify token validity
}
```

#### Request/Response Models

**LoginRequest:**
```java
public class LoginRequest {
    private String email;
    private String password;
    // getters and setters
}
```

**SignUpRequest:**
```java
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String dateOfBirth;
    private boolean termsAccepted;
    private boolean marketingEmails;
    // getters and setters
}
```

**LoginResponse:**
```java
public class LoginResponse {
    private User user;
    private String token;
    private String refreshToken;
    private long expiresIn; // seconds
    // getters and setters
}
```

**User:**
```java
public class User {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String dateOfBirth;
    private boolean isActive;
    private boolean marketingEmails;
    // getters and setters
}
```

### Spring Security Configuration

Example Spring Security configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/login", "/api/auth/refresh").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## Authentication Flow

1. **User Access**: Customer visits the application at any URL
2. **Auto-Redirect**: System automatically redirects to `/login` page
3. **Login/Register**: Customer can login or navigate to registration
4. **Form Validation**: Frontend validates input with comprehensive error handling
5. **API Integration**: Sends authentication requests to Spring Boot backend
6. **Token Management**: Securely stores JWT tokens for session management
7. **Success Handling**: Authentication context manages post-login flow
8. **Google Integration**: Ready for Google OAuth implementation

## Key Pages

### Login Page (`/login`)
- **Clean Design**: Large "LOGIN" title with white background
- **Simple Form**: Email and password fields with validation
- **Google Sign-in**: Ready for OAuth integration
- **Navigation**: Links to registration and password recovery

### Registration Page (`/signup`)
- **Customer Fields**: Name, email, phone, date of birth
- **Password Confirmation**: Ensures password accuracy
- **Terms Handling**: Built-in terms acceptance
- **Seamless UX**: Easy navigation back to login

## Security Best Practices

### Token Management
- JWT tokens stored in secure HTTP-only cookies
- Automatic token refresh before expiration
- Proper cleanup on logout

### Input Validation
- Client-side validation with Zod schemas
- Server-side validation in Spring Boot
- SQL injection prevention
- XSS protection

### CORS Configuration
Ensure your Spring Boot backend allows the frontend domain:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## Customization

### Styling
- Modify input field styling in `src/components/auth/LoginForm.tsx` and `SignUpForm.tsx`
- Update global styles in `src/app/globals.css`
- Customize colors by modifying the gray color scheme classes
- Adjust typography by changing font weights and sizes

### Form Fields
- Add/remove customer fields in `SignUpForm.tsx`
- Update validation in `src/lib/validations.ts`
- Modify API integration in `src/context/AuthContext.tsx`

### Google Integration
- Configure Google OAuth provider
- Update Google sign-in buttons with proper client configuration
- Add Google authentication handling in the auth context

### Branding
- Update page titles and descriptions
- Modify button text and messaging
- Customize error messages and user feedback

## Current Features

✅ **Clean Login Form** - Email/password with Google sign-in option  
✅ **Customer Registration** - Name, email, phone, DOB fields  
✅ **Input Validation** - Form validation with error handling  
✅ **Responsive Design** - Mobile-first approach  
✅ **Dark Gray Theme** - High contrast, accessible colors  
✅ **Loading States** - Button states and error feedback  
✅ **Navigation** - Seamless flow between login/signup  

## Ready for Integration

🔄 **Spring Boot Backend** - API endpoints defined and ready  
🔄 **Google OAuth** - UI components ready for OAuth integration  
🔄 **Token Management** - JWT handling implemented  
🔄 **Error Handling** - Comprehensive error states  

---

**Customer Authentication Frontend** - Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
