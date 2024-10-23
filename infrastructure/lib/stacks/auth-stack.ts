import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the user pool
    this.userPool = new cognito.UserPool(this, 'EngagerUserPool', {
      userPoolName: 'engager-user-pool',
      selfSignUpEnabled: false, // Only Engager staff can create initial users
      userPoolTags: {
        Environment: 'production',
        Project: 'Engager',
        ManagedBy: 'CDK'
      },
      
      // Add this description
      description: 'Engager authentication user pool managed by CDK',

      signInAliases: {
        email: true,
        username: false,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        userRole: new cognito.StringAttribute({ mutable: true }), // 'SUPER_ADMIN', 'OWNER', 'EDITOR', 'OBSERVER'
        brandId: new cognito.StringAttribute({ mutable: true }), // null for SUPER_ADMIN, UUID for brand users
        isEngagerStaff: new cognito.BooleanAttribute({ mutable: false }), // true for SUPER_ADMIN
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    // Add a client application
    const userPoolClient = this.userPool.addClient('EngagerAppClient', {
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
      },
      preventUserExistenceErrors: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
        callbackUrls: [
          'http://localhost:3000/api/auth/callback/cognito',
          'https://tryengager.com/api/auth/callback/cognito'
        ],
      },
    });
  }
}