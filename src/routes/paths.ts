export const APP_ROUTES = {
  public: {
    login: '/' as const,
    register: '/register' as const,
  },
  private: {
    schedule: '/home/schedule' as const,
    patients: '/home/patients' as const,
    total: '/home/total' as const,
    profile: '/home/profile' as const,
  },
  therms: {
    registerPatient: '/therms/register-patient' as const,
    privacyPolicy: 'https://example.com/privacy-policy' as const,
    termsOfService: 'https://example.com/terms-of-service' as const,
  },
}
