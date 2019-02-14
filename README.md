
# Setup Environment

## Create Environment CloudFormation Stack

```bash
aws cloudformation validate-template --template-body file://environment.cfn.yml
aws cloudformation create-stack --stack-name sls-ts-dynamodb-transactions-sample --template-body file://environment.cfn.yml --capabilities CAPABILITY_IAM
```

## Copy GitHub to CodeCommit

```bash
git clone --mirror https://github.com/nihemak/sls-ts-dynamodb-transactions-sample.git sls-ts-dynamodb-transactions-sample
cd sls-ts-dynamodb-transactions-sample
git push ssh://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/sls-ts-dynamodb-transactions-sample --all
cd ..
```

## Create Serverless Environment

```bash
aws codebuild start-build --project-name sls-ts-dynamodb-transactions-sample --source-version master
```
