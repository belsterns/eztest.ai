export class StaticMessage {
  static InvalidGitHubToken = "Invalid github token";
  static RepositoryVerifiedSuccessfully = "Repository verified successfully";
  static RepoAlreadyExists =
    "A repository with the same name already exists under this organization.";
  static RepoDetailsSavedSuccessfully =
    "Repository details have been successfully saved.";
  static RepoSaveFailed =
    "Failed to save repository details. Please try again.";
  static RepositoryNotFound = "Repository not found";
  static RepoDetailsUpdatedSuccessfully =
    "Repository details have been updated saved.";
  static UserEmailAlreadyExists =
    "An account with this email already exists. Please use a different email.";
  static UserEmailNotFound =
    "No account found with this email. Please enter a valid email address.";
  static SuccessfullyRegister = "You have successfully registered.";
  static UserNotFound =
    "No matching user found. Please check your details and try again.";
  static InvalidPassword =
    "The password you entered is incorrect. Please try again.";
  static LoginSuccessfully = "You have successfully logged in. Welcome back!";
  static RoleNotFound = "Role not found.";
  static UnAuthorizedUser = "Unauthorized";
  static CreatedByRequired = "Created by param required";
  static YouNotAllowedToInviteAUser = "You don't have permission to invite a user";
}

export class OnboardingType {
  static SignUp = "signup";
  static Invite = "invite";
}

export class OrganizationRoles {
  static SuperAdmin = "super admin";
  static WorkspaceAdmin = "workspace admin";
  static WorkspaceMember = "workspace member";
}
