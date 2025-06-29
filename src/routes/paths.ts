export const APP_ROUTES = {
  public: {
    login: '/' as const,
    register: '/register' as const,
    therms: {
      privacyPolicy_serviceTherm: '/therms/register' as const,
    },
  },
  private: {
    schedule: '/home/schedule' as const,
    patients: '/home/patients' as const,
    total: '/home/total' as const,
    profile: '/home/profile' as const,
    graph: '/home/graph' as const,
    therms: {
      registerPatient: '/home/therms/register-patient' as const,
    },
  },
}
