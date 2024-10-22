#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { AuthStack } from '../lib/stacks/auth-stack';

const app = new cdk.App();

const env = { 
  account: '145023092605', // Your AWS account ID
  region: 'us-east-2'
};

// Create the auth stack
new AuthStack(app, 'EngagerAuthStack', {
  env: env,
  description: 'Authentication infrastructure for Engager application',
});

// Keep the main infrastructure stack if you need it for other resources
new InfrastructureStack(app, 'InfrastructureStack', {
  env: env,
  description: 'Main infrastructure for Engager application',
});