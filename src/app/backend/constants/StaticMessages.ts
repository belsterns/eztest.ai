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
  static InvalidRepositoryUrl = "Invalid repository URL";
  static InvalidToken = "Invalid repository token";
  static RepoDetailsUpdatedSuccessfully =
    "Repository details have been updated saved.";
  static RepositoryDeletedSuccessfully = "Repository deleted successfully.";
  static RepositoryFetchedSuccessfully =
    "Repository details fetched successfully.";
  static RepositoriesFetchedSuccessfully = "Repositories fetched successfully.";
  static UserEmailAlreadyExists =
    "An account with this email already exists. Please use a different email.";
  static UserEmailNotFound =
    "No account found with this email. Please enter a valid email address";
  static SuccessfullyRegister = "You have successfully registered.";
  static UserNotFound =
    "No matching user found. Please check your details and try again.";
  static InvalidPassword =
    "The password you entered is incorrect. Please try again";
  static SessionNotFound = "Session not found after login";
  static AuthenticationFailed = "Authentication failed";
  static LoginSuccessfully = "You have successfully logged in. Welcome back!";
  static RoleNotFound = "Role not found.";
  static UnAuthorizedUser = "Unauthorized";
  static CreatedByRequired = "Created by param required";
  static YouNotAllowedToInviteAUser =
    "You don't have permission to invite a user";
  static InvalidCredentials = "Invalid credentials";
  static OtpSuccess = "OTP sent";
  static OTPEmailFailed = "OTP failed";
  static OtpExpires = "OTP expired";
  static OtpIncorrect = "Incorrect OTP";
  static PasswordEmailFailed = "Email failed";
  static PasswordIsRequired = "Password is required";
  static UserCreatedEmailFailed = "User created notification email failed";

  // Role messages
  static RoleAlreadyExists = "Role already exists";
  static RolesFetchedSuccessfully = "Roles fetched successfully";

  // User message
  static NoAccess = "No access";

  // Workspace messages
  static WorkspaceAlreadyExists =
    "A workspace with the same name already exists for the user.";
  static WorkspaceNotFound = "Workspace not found.";
  static WorkspaceCreatedSuccessfully = "Workspace created successfully.";
  static WorkspaceUpdatedSuccessfully = "Workspace updated successfully.";
  static WorkspaceFetchedSuccessfully =
    "Workspace details fetched successfully.";
  static WorkspaceDeletedSuccessfully = "Workspace deleted successfully.";
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

export class StatusCode {
  static Success = 200; // OK
  static Created = 201; // Resource successfully created
  static Accepted = 202; // Request accepted but not processed yet
  static NoContent = 204; // Successful request, no content to return

  static BadRequest = 400; // Client error: Invalid request
  static Unauthorized = 401; // Authentication required or failed
  static Forbidden = 403; // User does not have permission
  static NotFound = 404; // Resource not found
  static Conflict = 409; // Conflict with the current state of the resource
  static UnprocessableEntity = 422; // Request is well-formed but has semantic errors

  static InternalServerError = 500; // Generic server error
  static NotImplemented = 501; // Server does not support the requested functionality
  static BadGateway = 502; // Invalid response from an upstream server
  static ServiceUnavailable = 503; // Server is down or overloaded
  static GatewayTimeout = 504; // Timeout from upstream server
}

export class providerMessage {
  static BRANCH_ALREADY_EXISTS = "Branch already exists";
  static BRANCH_NOT_FOUND = "Branch not found";
  static PULL_REQUEST_ALREADY_EXISTS = "Pull request already exists";
}
