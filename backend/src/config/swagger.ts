export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Verity Health — QA Playground Auth API',
    version: '2.0.0',
    description:
      'Auth API for QA testing. Patient & Doctor registration, login, and session verification.\n\n' +
      'To import into Postman: **Import → Link** → `http://localhost:3001/api-docs.json`'
  },
  externalDocs: {
    description: 'Download OpenAPI JSON for Postman import',
    url: 'http://localhost:3001/api-docs.json'
  },
  tags: [
    {
      name: 'Public',
      description: '🔓 No authentication required'
    },
    {
      name: 'Protected',
      description: '🔒 Bearer JWT token required — obtain via POST /api/auth/login'
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Public'],
        summary: '🔓 Register a new Patient or Doctor account',
        description:
          'Validates patient/doctor fields with Zod, creates user credentials in Supabase Auth, and creates the medical profile in public.profiles table.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/PatientRegisterRequest' },
                  { $ref: '#/components/schemas/DoctorRegisterRequest' }
                ],
                discriminator: {
                  propertyName: 'role',
                  mapping: {
                    patient: '#/components/schemas/PatientRegisterRequest',
                    doctor: '#/components/schemas/DoctorRegisterRequest'
                  }
                }
              },
              examples: {
                'Patient Registration': {
                  summary: 'Register a new Patient account',
                  value: {
                    role: 'patient',
                    firstName: 'John',
                    lastName: 'Doe',
                    dateOfBirth: '1990-05-15',
                    gender: 'male',
                    phoneNumber: '+1 555-0199',
                    email: 'patient.john@example.com',
                    password: 'SuperSecure123!#',
                    confirmPassword: 'SuperSecure123!#',
                    termsAccepted: true
                  }
                },
                'Doctor Registration': {
                  summary: 'Register a new Doctor account',
                  value: {
                    role: 'doctor',
                    firstName: 'Sarah',
                    lastName: 'Smith',
                    email: 'dr.smith@hospital.org',
                    phoneNumber: '+1 555-0299',
                    medicalLicenseNumber: 'MED-9874521-TX',
                    specialization: 'Cardiology',
                    department: 'Cardiology',
                    yearsOfExperience: 8,
                    qualification: 'MBBS, MD (Cardiology)',
                    licenseDocument: 'medical_license_tx_smith.pdf',
                    password: 'DoctorSecure123!#',
                    confirmPassword: 'DoctorSecure123!#',
                    termsAccepted: true
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterSuccessResponse'
                }
              }
            }
          },
          400: {
            description: 'Validation errors (e.g. missing required field, weak password, invalid phone)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse'
                }
              }
            }
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Public'],
        summary: '🔓 Sign in with email and password',
        description:
          'Authenticates against Supabase Auth and returns an active JWT access token along with the user profile.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginSuccessResponse'
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/register-status': {
      get: {
        tags: ['Public'],
        summary: '🔓 Check registration service health and supported roles',
        description: 'Called on registration page mount to verify backend and database connection status.',
        responses: {
          200: {
            description: 'Service is available',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'available' },
                    message: { type: 'string', example: 'Healthcare Registration Service is online and ready.' },
                    supportedRoles: { type: 'array', items: { type: 'string' }, example: ['patient', 'doctor'] },
                    supabaseConnected: { type: 'boolean', example: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/home': {
      get: {
        tags: ['Protected'],
        summary: '🔒 Dashboard state & profile check (optional auth)',
        description:
          'Called on home page mount. Optionally pass a Bearer token — if valid, returns the authenticated user profile with role-specific medical details. Without a token, returns public status only.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Home API status response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HomeResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Protected'],
        summary: '🔒 Verify session token and retrieve live profile',
        description:
          'Requires Bearer JWT token in Authorization header. Returns 200 with full user profile or 401 if token is expired/invalid. ' +
          'Use the token returned from POST /api/auth/login.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Session valid',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MeResponse'
                }
              }
            }
          },
          401: {
            description: 'Unauthorized or token invalid',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token returned from /api/auth/login'
      }
    },
    schemas: {
      PatientRegisterRequest: {
        type: 'object',
        required: [
          'firstName',
          'lastName',
          'dateOfBirth',
          'phoneNumber',
          'email',
          'password',
          'confirmPassword',
          'termsAccepted'
        ],
        properties: {
          role: { type: 'string', enum: ['patient'], default: 'patient', example: 'patient' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          dateOfBirth: { type: 'string', format: 'date', example: '1990-05-15' },
          gender: { type: 'string', enum: ['male', 'female', 'other', 'prefer_not_to_say'], example: 'male' },
          phoneNumber: { type: 'string', example: '+1 555-0199' },
          email: { type: 'string', format: 'email', example: 'patient.john@example.com' },
          password: { type: 'string', minLength: 12, example: 'SuperSecure123!#' },
          confirmPassword: { type: 'string', example: 'SuperSecure123!#' },
          termsAccepted: { type: 'boolean', example: true }
        }
      },
      DoctorRegisterRequest: {
        type: 'object',
        required: [
          'role',
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'medicalLicenseNumber',
          'specialization',
          'department',
          'qualification',
          'licenseDocument',
          'password',
          'confirmPassword',
          'termsAccepted'
        ],
        properties: {
          role: { type: 'string', enum: ['doctor'], example: 'doctor' },
          firstName: { type: 'string', example: 'Sarah' },
          lastName: { type: 'string', example: 'Smith' },
          email: { type: 'string', format: 'email', example: 'dr.smith@example.com' },
          phoneNumber: { type: 'string', example: '+1 555-0299' },
          medicalLicenseNumber: { type: 'string', example: 'MED-9874521-TX' },
          specialization: { type: 'string', example: 'Cardiology' },
          department: { type: 'string', example: 'Cardiology' },
          yearsOfExperience: { type: 'number', example: 8 },
          qualification: { type: 'string', example: 'MBBS, MD (Cardiology)' },
          licenseDocument: { type: 'string', example: 'medical_license_tx_smith.pdf' },
          password: { type: 'string', minLength: 12, example: 'DoctorSecure123!#' },
          confirmPassword: { type: 'string', example: 'DoctorSecure123!#' },
          termsAccepted: { type: 'boolean', example: true }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'patient.john@example.com' },
          password: { type: 'string', example: 'SuperSecure123!#' }
        }
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['patient', 'doctor', 'admin'] },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phoneNumber: { type: 'string' },
          dateOfBirth: { type: 'string', nullable: true },
          gender: { type: 'string', nullable: true },
          medicalLicenseNumber: { type: 'string', nullable: true },
          specialization: { type: 'string', nullable: true },
          department: { type: 'string', nullable: true },
          yearsOfExperience: { type: 'number', nullable: true },
          qualification: { type: 'string', nullable: true },
          licenseDocument: { type: 'string', nullable: true },
          termsAccepted: { type: 'boolean' }
        }
      },
      RegisterSuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Account created successfully! You can now sign in.' },
          user: { $ref: '#/components/schemas/UserProfile' }
        }
      },
      LoginSuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Welcome back! Login successful.' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
          expiresAt: { type: 'number', example: 1789466961 },
          user: { $ref: '#/components/schemas/UserProfile' }
        }
      },
      HomeResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Welcome to Healthcare QA Playground API' },
          status: { type: 'string', example: 'online' },
          authenticated: { type: 'boolean', example: true },
          user: { $ref: '#/components/schemas/UserProfile', nullable: true }
        }
      },
      MeResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Session is valid.' },
          user: { $ref: '#/components/schemas/UserProfile' }
        }
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Please correct the highlighted fields.' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' },
            example: { medicalLicenseNumber: 'Medical license number is required' }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Email or password is incorrect.' }
        }
      }
    }
  }
}
