# Engager

Brand content analysis and management platform built with Next.js and AWS.

## Project Structure

```
engager-app/
├── infrastructure/        # AWS CDK Infrastructure code
│   ├── bin/              # CDK app entry point
│   ├── lib/              # Stack definitions
│   │   └── stacks/       # Individual stack files
│   └── test/             # Infrastructure tests
└── src/                  # Next.js application code
    ├── app/              # App router pages
    ├── components/       # React components
    └── lib/              # Shared utilities
        └── aws/          # AWS configuration
```

## Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS CDK CLI
- GitHub account

## Quick Start

1. **Infrastructure Setup:**
```bash
cd infrastructure
npm install
cdk bootstrap
cdk deploy --all
```

2. **Environment Setup:**
```bash
cp .env.example .env.local
# Update with your AWS Cognito credentials
```

3. **Development Server:**
```bash
npm install
npm run dev
```

## Documentation

- Uses AWS Cognito for authentication
- Role-based access:
  - Super Admin (Engager staff)
  - Brand Owner
  - Editor
  - Observer
- Frontend: Next.js 14 with App Router
- Infrastructure: AWS CDK
- Deployment: AWS Amplify
- Production: https://tryengager.com

## License

Proprietary - All rights reserved
