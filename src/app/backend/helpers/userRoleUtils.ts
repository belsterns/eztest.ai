import { OnboardingType, OrganizationRoles } from "../constants/StaticMessages";

export async function getRoleName(onboardingType: string | null): Promise<string> {
  if (!onboardingType) {
    throw new Error("Onboarding type is required.");
  }

  const lowerCaseType = onboardingType.toLowerCase();

  switch (lowerCaseType) {
    case OnboardingType.SignUp:
      return OrganizationRoles.SuperAdmin;
    case OnboardingType.Invite:
      return OrganizationRoles.WorkspaceMember;
    default:
      throw new Error(`Invalid onboardingType: ${onboardingType}`);
  }
}
